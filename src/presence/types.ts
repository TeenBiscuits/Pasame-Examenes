export type WeeklyStudent = {
	username: string;
	isCurrentStudent: boolean;
	profileKey: string;
};

export type WeeklyPresence = {
	studentCount: number;
	students: readonly WeeklyStudent[];
	hasSummary: boolean;
};
