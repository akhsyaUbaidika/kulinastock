export function HoltWinters(
    data,
    alpha = 0.3,
    beta = 0.1,
    gamma = 0.1,
    seasonLength = 7
) {
    if (data.length < seasonLength) return data;

    let level = data[0];
    let trend = data[1] - data[0];

    let seasonals = Array(seasonLength).fill(1);
    let result = [];

    for (let i = 0; i < data.length; i++) {
        let season = seasonals[i % seasonLength];

        let prevLevel = level;

        level = alpha * (data[i] / season) + (1 - alpha) * (level + trend);
        trend = beta * (level - prevLevel) + (1 - beta) * trend;

        seasonals[i % seasonLength] =
            gamma * (data[i] / level) + (1 - gamma) * season;

        let forecast = (level + trend) * seasonals[i % seasonLength];

        result.push(forecast);
    }

    return result;
}