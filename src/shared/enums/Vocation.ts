export enum Vocation {
	None = 0,
	Druid = 1,
	Sorcerer = 2,
	Paladin = 3,
	Knight = 4,
}

export type VocationType = keyof typeof Vocation;

export const getVocationByName = (name: keyof typeof Vocation): Vocation => {
	return Vocation[name] || Vocation.None;
};

export const getVocationNameById = (id: Vocation): string => {
	return Vocation[id] || "None";
};
