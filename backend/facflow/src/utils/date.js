// export const today = () => "2026-07-11"; // 테스트용

export const today = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().slice(0, 10);
}