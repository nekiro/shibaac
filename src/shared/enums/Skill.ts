export enum Skill {
	Fist = "skill_fist",
	Club = "skill_club",
	Sword = "skill_sword",
	Axe = "skill_axe",
	Distance = "skill_dist",
	Shield = "skill_shielding",
	Fishing = "skill_fishing",
	Magic = "maglevel",
	Experience = "level",
}

export type SkillType = keyof typeof Skill;

export const getSkillByName = (name: keyof typeof Skill): Skill => {
	return Skill[name];
};

export const getSkillKeyByValue = (value: string): string | undefined => {
	return Object.keys(Skill).find((key) => Skill[key as keyof typeof Skill] === value);
};
