export enum Sex {
	Female = 0,
	Male = 1,
}

export const getSexNames = () => {
	return Object.keys(Sex).filter(([key]) => Number.isNaN(Number(key)));
};

export const getSexByName = (name: keyof typeof Sex) => {
	return Sex[name] || Sex.Female;
};

export type SexType = keyof typeof Sex;
