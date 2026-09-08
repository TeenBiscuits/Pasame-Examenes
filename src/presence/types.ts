export type WeeklyStudent = {
	username: string;
	isCurrentStudent: boolean;
	profileKey: string;
};

export type WeeklyPresence = {
	studentCount: number | null;
	students: readonly WeeklyStudent[];
	hasSummary: boolean;
};
