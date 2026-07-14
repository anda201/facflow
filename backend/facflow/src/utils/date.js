// export const today = () => "2026-07-11"; // 테스트용

export const today = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
};