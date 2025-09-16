// utils/sms.ts
export function calculateSmsSegments(message: string) {
    const length = message.length;
    if (length <= 160) return 1;
    if (length <= 306) return 2;
    if (length <= 459) return 3;
    return Math.ceil(length / 153);
}

export function calculateSmsCost(message: string, pricePerCredit = 0.12) {
    const segments = calculateSmsSegments(message);
    const cost = segments * pricePerCredit;
    return {segments, cost};
}

export function generateMemo(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let memo = "";
    for (let i = 0; i < length; i++) {
        memo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return memo;
}
