export default {
  ci: {
    collect: {
      startServerCommand: "pnpm preview --port 4173",
      url: [
        "http://localhost:4173/",
        "http://localhost:4173/en",
        "http://localhost:4173/es",
        "http://localhost:4173/gl",
      ],
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
