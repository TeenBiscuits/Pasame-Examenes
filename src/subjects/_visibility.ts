// This file exists purely to make static analysis tools see that every
// subject's named exports are consumed.  It is never imported by any
// runtime code — Vite's import.meta.glob in index.ts does the actual
// work.  When adding a subject, add its pair of imports here.

import { meta as bedeMeta } from "./bede/meta";
import { questions as bedeQuestions } from "./bede/questions";
import { meta as cepeMeta } from "./cepe/meta";
import { questions as cepeQuestions } from "./cepe/questions";
import { meta as eceMeta } from "./ece/meta";
import { questions as eceQuestions } from "./ece/questions";
import { meta as emeeleMeta } from "./emeele/meta";
import { questions as emeeleQuestions } from "./emeele/questions";
import { meta as equisiMeta } from "./equisi/meta";
import { questions as equisiQuestions } from "./equisi/questions";
import { meta as equispeMeta } from "./equispe/meta";
import { questions as equispeQuestions } from "./equispe/questions";
import { meta as eseiMeta } from "./esei/meta";
import { questions as eseiQuestions } from "./esei/questions";
import { meta as eseoMeta } from "./eseo/meta";
import { questions as eseoQuestions } from "./eseo/questions";
import { meta as iesedeMeta } from "./iesede/meta";
import { questions as iesedeQuestions } from "./iesede/questions";
import { meta as peeseMeta } from "./peese/meta";
import { questions as peeseQuestions } from "./peese/questions";
import { meta as peiMeta } from "./pei/meta";
import { questions as peiQuestions } from "./pei/questions";
import { meta as deeseMeta } from "./deese/meta";
import { questions as deeseQuestions } from "./deese/questions";
import { meta as redesMeta } from "./redes/meta";
import { questions as redesQuestions } from "./redes/questions";

void bedeMeta;
void bedeQuestions;
void cepeMeta;
void cepeQuestions;
void eceMeta;
void eceQuestions;
void emeeleMeta;
void emeeleQuestions;
void equisiMeta;
void equisiQuestions;
void equispeMeta;
void equispeQuestions;
void eseiMeta;
void eseiQuestions;
void eseoMeta;
void eseoQuestions;
void iesedeMeta;
void iesedeQuestions;
void peeseMeta;
void peeseQuestions;
void peiMeta;
void peiQuestions;
void deeseMeta;
void deeseQuestions;
void redesMeta;
void redesQuestions;
