import type { SubjectMeta } from "../data/types";
import { meta as cepeMeta } from "./cepe/meta";
import { meta as eceMeta } from "./ece/meta";
import { meta as emeeleMeta } from "./emeele/meta";
import { meta as equisiMeta } from "./equisi/meta";
import { meta as equispeMeta } from "./equispe/meta";
import { meta as eseiMeta } from "./esei/meta";
import { meta as eseoMeta } from "./eseo/meta";
import { meta as iesedeMeta } from "./iesede/meta";
import { meta as peiMeta } from "./pei/meta";

export const allSubjectMetas: SubjectMeta[] = [
  cepeMeta,
  eceMeta,
  emeeleMeta,
  equisiMeta,
  equispeMeta,
  eseiMeta,
  eseoMeta,
  iesedeMeta,
  peiMeta,
];
