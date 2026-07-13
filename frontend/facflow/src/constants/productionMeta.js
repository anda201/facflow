import { CheckCircle2, PlayCircle } from "lucide-react";
import { COLORS } from "./colors";

export const PRODUCTION_STATUS_META = {
  DONE: { label: "완료", color: COLORS.green, icon: CheckCircle2 },
  RUN: { label: "생산중", color: COLORS.amber, icon: PlayCircle },
};

export const PRODUCTION_STATUS_FILTERS = [
  { key: "ALL", label: "전체", color: COLORS.text },
  { key: "RUN", label: "생산중", color: COLORS.amber },
  { key: "DONE", label: "완료", color: COLORS.green },
];
