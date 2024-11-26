import React, { useState } from "react";
import Panel from "@component/Panel";
import Head from "../../layout/Head";
import StrippedTable from "@component/StrippedTable";
import { Box, Button, ButtonGroup, Flex, Heading, Text } from "@chakra-ui/react";
import { getVocationNameById, Vocation } from "src/shared/enums/Vocation";
import { trpc } from "@util/trpc";
import { Skill } from "src/shared/enums/Skill";
import { getSkillKeyByValue } from "../../shared/enums/Skill";

const vocations: { label: string; value: Vocation | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Sorcerer", value: Vocation.Sorcerer },
	{ label: "Druid", value: Vocation.Druid },
	{ label: "Paladin", value: Vocation.Paladin },
	{ label: "Knight", value: Vocation.Knight },
	{ label: "None", value: Vocation.None },
];

const categories = [
	{ label: "Experience", value: Skill.Experience },
	{ label: "Magic", value: Skill.Magic },
	{ label: "Shield", value: Skill.Shield },
	{ label: "Distance", value: Skill.Distance },
	{ label: "Club", value: Skill.Club },
	{ label: "Sword", value: Skill.Sword },
	{ label: "Axe", value: Skill.Axe },
	{ label: "Fist", value: Skill.Fist },
	{ label: "Fishing", value: Skill.Fishing },
];

export default function Highscores() {
	const [filter, setFilter] = useState<{ skill: Skill; vocation: Vocation | "all" }>({
		skill: Skill.Experience,
		vocation: "all",
	});
	const highscores = trpc.community.highscores.useInfiniteQuery(
		{ vocation: filter.vocation, skill: filter.skill },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor },
	);

	return (
		<>
			<Head title="Highscores" />
			<Panel header="Highscores">
				<Box textAlign="center" mb={4}>
					<Heading as="h2" size="lg" mb={2}>
						Rankings for {getSkillKeyByValue(filter.skill)}
					</Heading>
					<Text mb={2}>Vocation: {filter.vocation === "all" ? "all" : getVocationNameById(filter.vocation)}</Text>
					<Flex justify="center" mb={4}>
						<ButtonGroup variant="outline" spacing={2}>
							{categories.map((category) => (
								<Button
									key={category.label}
									onClick={() => {
										setFilter((prevFilter) => ({
											...prevFilter,
											skill: category.value,
										}));
									}}
									colorScheme={filter.skill === category.value ? "purple" : "gray"}
								>
									{category.label}
								</Button>
							))}
						</ButtonGroup>
					</Flex>
					<Flex justify="center" mb={4}>
						<ButtonGroup variant="outline" spacing={2}>
							{vocations.map((vocation) => (
								<Button
									key={vocation.label}
									onClick={() => setFilter((prevFilter) => ({ ...prevFilter, vocation: vocation.value }))}
									colorScheme={filter.vocation === vocation.value ? "purple" : "gray"}
								>
									{vocation.label}
								</Button>
							))}
						</ButtonGroup>
					</Flex>
				</Box>

				<StrippedTable
					isLoading={highscores.isLoading}
					head={[{ text: "Rank" }, { text: "Name" }, { text: "Vocation" }, { text: "Level" }]}
					body={
						highscores.data
							? highscores.data.pages[0].players.map((player, index) => [
									{ text: `${index + 1}` },
									{ text: player.name, href: `/character/${player.name}` },
									{ text: getVocationNameById(player.vocation) },
									{ text: player.level },
								])
							: [
									[
										{
											text: "There is no data to show",
											// colspan: 6,
										},
									],
								]
					}
				/>
			</Panel>
		</>
	);
}
