import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  route(":lang", "../src/pages/LangLayout.tsx", [
    index("../src/pages/Home.tsx"),
    route(":subjectId", "../src/pages/SubjectHome.tsx"),
    route(
      ":subjectId/practice",
      "../src/pages/PracticeRedirect.tsx",
    ),
    route(":subjectId/practice/:topic", "../src/pages/PracticeTopic.tsx"),
    route(":subjectId/exam/:year", "../src/pages/ExamSimulation.tsx"),
  ]),
  route("*", "../src/pages/CatchAllRedirect.tsx"),
] satisfies RouteConfig;
