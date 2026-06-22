import { Link } from "react-router-dom";
import type { SubjectMeta } from "../data/types";
import { getAllQuestions } from "../subjects";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubjectCardProps {
  subject: SubjectMeta;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const t = useT();
  const qs = getAllQuestions(subject.id);

  return (
    <Link
      to={`/${subject.id}`}
      className="block hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none rounded-xl transition-transform duration-200"
      onClick={() => {
        triggerLight();
        track("subject_card_click", { subjectId: subject.id });
      }}
    >
      <Card className="hover:ring-primary/30 transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <span className="text-2xl" role="img" aria-hidden="true">
              {subject.icon}
            </span>
            <Badge variant="secondary" className="font-mono">
              {subject.courseCode}
            </Badge>
          </div>
          <CardTitle>{subject.name}</CardTitle>
          <CardDescription>{subject.university}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>
              {qs.length} {t.subjectCard.questions}
            </span>
            <span>&middot;</span>
            <span>
              {subject.exams.length} {t.subjectCard.exams}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
