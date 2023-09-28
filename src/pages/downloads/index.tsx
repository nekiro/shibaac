import React from "react";
import Panel from "../../components/Panel";
import Head from "../../layout/Head";
import { Box, Flex, Text, Heading, Grid } from "@chakra-ui/react";

import { GrPersonalComputer, GrDocumentZip } from "react-icons/gr";
import { ImHappy } from "react-icons/im";
import { MdSpeakerNotes } from "react-icons/md";

const Downloads = () => {
	return (
		<>
			<Head title="Downloads" />
			<Panel header="Downloads">
				<Flex direction={{ base: "column", lg: "row" }} px={4} py={5}>
					<Box flex="1" mb={{ base: 5, lg: 0 }} maxW={{ lg: "40%" }}>
						<Box mb={4}>
							<Text as="span" fontSize="lg" fontWeight="bold">
								Our downloads
							</Text>
							<Heading as="h2" size="lg">
								What We do?
							</Heading>
						</Box>
						<Text>
							We bring the best customer experience in the community, with very
							low fps, a minimum level of bugs, always focusing on improvements.
						</Text>
					</Box>

					<Grid
						templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
						gap={6}
						flex="2"
						maxW={{ lg: "60%" }}
					>
						{[
							{
								Icon: GrPersonalComputer,
								title: "Requirements",
								content: (
									<>
										<Text>Minimum: OS: Windows 7</Text>
										<Text>
											Processor: 2.0 GHz Pentium 4 or equivalent with SSE2
											instruction set support
										</Text>
										<Text>
											Memory: 4GB RAM Graphics: 128MB; if DirectX 9c or OpenGL
											2.1 are not supported, only software renderer mode is
											available (no light effects)
										</Text>
										<Text>Hard Drive: min. 150 MB</Text>
									</>
								),
							},
							{
								Icon: ImHappy,
								title: "Recommended",
								content: (
									<>
										<Text>OS: Windows 7, 10 or newer</Text>
										<Text>
											Processor: 2.5 GHz Intel Core i3 processor or equivalent
										</Text>
										<Text>
											Memory: 8GB RAM Graphics: 512MB; OpenGL 2.1 support
										</Text>
										<Text>Hard Drive: min. 150 MB</Text>
									</>
								),
							},
							{
								Icon: GrDocumentZip,
								title: "Variable distribution",
								content: (
									<Text>
										ZIP download or no shortcut to the client: You need to
										execute Launcher.exe inside the /bin/ folder to open the
										client. If it fails, execute the Tibia.exe inside the /bin/
										folder as administrator.
									</Text>
								),
							},
							{
								Icon: MdSpeakerNotes,
								title: "Note!",
								content: (
									<Text>
										You can find HERE some tips like improving FPS, client
										freezing and not responding, importing map, hotkeys,
										configurations and etc.
									</Text>
								),
							},
						].map(({ Icon, title, content }, index) => (
							<Box key={index} bg="gray.50" p={5} borderRadius="md" shadow="sm">
								<Flex alignItems="center" mb={4}>
									<Box as={Icon} size={30} color="blue.500" />
									<Heading size="md" ml={3}>
										{title}
									</Heading>
								</Flex>
								{content}
							</Box>
						))}
					</Grid>
				</Flex>
			</Panel>
		</>
	);
};

export default Downloads;
