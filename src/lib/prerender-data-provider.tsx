import type { ReactNode } from "react";
import {
  PrerenderDataContext,
  type PrerenderData,
} from "./prerender-data";

export function PrerenderDataProvider({
  data,
  children,
}: {
  data: PrerenderData | null;
  children: ReactNode;
}) {
  return (
    <PrerenderDataContext.Provider value={data}>
      {children}
    </PrerenderDataContext.Provider>
  );
}
