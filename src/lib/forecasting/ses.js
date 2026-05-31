export function SES(data, alpha = 0.3) {
    if (!data || data.length === 0) return [];

    let result = [];
    let prevForecast = data[0];

    result.push(prevForecast);

    for (let i = 1; i < data.length; i++) {
        let forecast = alpha * data[i - 1] + (1 - alpha) * prevForecast;
        result.push(forecast);
        prevForecast = forecast;
    }

    return result;
}