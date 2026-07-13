export function fmt(n) {
  return Number(n).toLocaleString("ko-KR");
}

export function fmtPct(n, digits = 1) {
  return Number(n ?? 0).toFixed(digits);
}

export function weekdayLabel(iso) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}

export function dateLabel(iso) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(d);
}

export function toKstDateInputValue(iso) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function kstDateInputToIso(dateStr) {
  return `${dateStr}T00:00:00+09:00`;
}

export function displayDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00+09:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}
