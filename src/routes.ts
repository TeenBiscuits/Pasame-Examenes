import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("./routes/language-redirect.tsx"),
  route(":subjectId/practice/:topic", "./routes/legacy-practice-redirect.tsx"),
  route(":subjectId/exam/:examId", "./routes/legacy-exam-redirect.tsx"),
  route(":lang", "./routes/lang-layout.tsx", [
    index("./routes/home.tsx"),
    route(":subjectId", "./routes/subject.tsx"),
    route(":subjectId/practice", "./routes/subject-practice-redirect.tsx"),
    route(":subjectId/practice/:topic", "./routes/practice-topic.tsx"),
    route(":subjectId/exam/:examId", "./routes/exam-simulation.tsx"),
    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
