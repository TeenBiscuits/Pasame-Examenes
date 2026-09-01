type ProfanityFilter = {
	exists: (value: string) => boolean;
};

let filterPromise: Promise<ProfanityFilter> | null = null;

function getFilter() {
	filterPromise ??= import("@2toad/profanity").then(
		({ Profanity }) =>
			new Profanity({
				languages: ["en", "es"],
				wholeWord: false,
			}),
	);
	return filterPromise;
}

export async function containsProfanity(username: string) {
	return (await getFilter()).exists(username);
}
