export function Holt(data, alpha = 0.3, beta = 0.1) {
    if (data.length < 2) return data;

    let level = data[0];
    let trend = data[1] - data[0];

    let result = [];

    for (let i = 0; i < data.length; i++) {
        let prevLevel = level;

        level = alpha * data[i] + (1 - alpha) * (level + trend);
        trend = beta * (level - prevLevel) + (1 - beta) * trend;

        result.push(level + trend);
    }

    return result;
}