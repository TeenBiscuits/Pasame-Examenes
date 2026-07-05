interface WebpackRequireContext {
  (key: string): { default: import("./lib/image").QuestionImage };
  keys(): string[];
}

declare const require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ): WebpackRequireContext;
};
