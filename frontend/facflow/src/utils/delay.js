import { COLORS } from "../constants/colors";
import { toKstDateInputValue } from "./format";

export function daysSince(dateStr) {
  const today = toKstDateInputValue(new Date().toISOString());
  const target = toKstDateInputValue(dateStr);
  const diff = Math.floor(
    (new Date(today) - new Date(target)) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
}

/** planDate 경과 항목을 마감일 기준으로 착수 지연 / 납기 지연으로 분류 */
export function splitByDelaySeverity(items) {
  const today = toKstDateInputValue(new Date().toISOString());
  const startDelayed = [];
  const dueOverdue = [];

  for (const item of items) {
    const due = toKstDateInputValue(item.dueDate);
    if (due < today) dueOverdue.push(item);
    else startDelayed.push(item);
  }

  return { startDelayed, dueOverdue };
}

export function delayVariantStyle(variant) {
  if (variant === "delay-critical") {
    return { accent: COLORS.red, rowHoverClass: "delay-critical" };
  }
  if (variant === "delay-warning") {
    return { accent: COLORS.amber, rowHoverClass: "delay-warning" };
  }
  return { accent: COLORS.hairline, rowHoverClass: "" };
}

export function isDelayVariant(variant) {
  return variant === "delay-warning" || variant === "delay-critical";
}
