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

export function kstDateLabel(iso) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(iso));
}

export function timeLabel(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(new Date(iso));
}

export function durationLabel(start, end) {
  if (!start) return "—";
  const startMs = new Date(start).getTime();
  const endMs = end ? new Date(end).getTime() : Date.now();
  const mins = Math.max(0, Math.round((endMs - startMs) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

export function defectRateOf(good, defect) {
  const total = Number(good) + Number(defect);
  if (total === 0) return 0;
  return (Number(defect) / total) * 100;
}
