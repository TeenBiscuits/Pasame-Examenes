import type { Config } from "@react-router/dev/config";
import { allSubjectMetas } from "./src/subjects/prerender-urls";

const languages = ["en", "es", "gl"] as const;

export default {
  ssr: false,
  async prerender() {
    const urls: string[] = [];

    for (const lang of languages) {
      urls.push(`/${lang}`);
      for (const subject of allSubjectMetas) {
        urls.push(`/${lang}/${subject.id}`);
        for (const topic of subject.topics) {
          urls.push(`/${lang}/${subject.id}/practice/${topic.key}`);
        }
        for (const exam of subject.exams) {
          urls.push(`/${lang}/${subject.id}/exam/${exam.year}`);
        }
      }
    }

    return urls;
  },
} satisfies Config;
