import LegacyRedirect from "./legacy-redirect";
import { subjects } from "../../subjects";

export function generateStaticParams() {
  const paths: string[][] = [[]];
  for (const subject of subjects) {
    paths.push([subject.id], [subject.id, "practice"], [subject.id, "exam"]);
    for (const topic of subject.topics) {
      paths.push([subject.id, "practice", topic.key]);
    }
    for (const exam of subject.exams) {
      paths.push([subject.id, "exam", exam.year]);
    }
  }
  return paths.map((path) => ({ path }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  await params;
  return <LegacyRedirect />;
}
