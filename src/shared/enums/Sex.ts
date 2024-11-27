export enum Sex {
	Female = 0,
	Male = 1,
}

export type SexType = keyof typeof Sex;
