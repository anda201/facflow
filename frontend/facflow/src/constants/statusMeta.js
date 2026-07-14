import { Clock, PlayCircle, CheckCircle2, Ban } from "lucide-react";
import { COLORS } from "./colors";

export const PLAN_STATUS_META = {
  WAIT: { label: "대기", color: COLORS.muted, icon: Clock },
  RUN: { label: "진행중", color: COLORS.amber, icon: PlayCircle },
  DONE: { label: "완료", color: COLORS.green, icon: CheckCircle2 },
  CANCEL: { label: "취소", color: COLORS.red, icon: Ban },
};

export const EQUIP_META = {
  IDLE: { label: "대기중", color: COLORS.green },
  RUN: { label: "가동중", color: COLORS.amber },
  STOP: { label: "점검중", color: COLORS.red },
};

export const PLAN_STATUS_FILTERS = [
  { key: "ALL", label: "전체", color: COLORS.text },
  { key: "WAIT", label: "대기", color: COLORS.muted },
  { key: "RUN", label: "진행중", color: COLORS.amber },
  { key: "DONE", label: "완료", color: COLORS.green },
  { key: "CANCEL", label: "취소", color: COLORS.red },
];

export const PRODUCTION_STATUS_META = {
  DONE: { label: "완료", color: COLORS.green, icon: CheckCircle2 },
  RUN: { label: "생산중", color: COLORS.amber, icon: PlayCircle },
};

export const PRODUCTION_STATUS_FILTERS = [
  { key: "ALL", label: "전체", color: COLORS.text },
  { key: "RUN", label: "생산중", color: COLORS.amber },
  { key: "DONE", label: "완료", color: COLORS.green },
];
