export function MAE(actual, forecast) {
    let sum = 0;

    for (let i = 0; i < actual.length; i++) {
        sum += Math.abs(actual[i] - forecast[i]);
    }

    return sum / actual.length;
}

export function MAPE(actual, forecast) {
    let sum = 0;

    for (let i = 0; i < actual.length; i++) {
        if (actual[i] === 0) continue;
        sum += Math.abs((actual[i] - forecast[i]) / actual[i]);
    }

    return (sum / actual.length) * 100;
}

export function RMSE(actual, forecast) {
    let sum = 0;

    for (let i = 0; i < actual.length; i++) {
        sum += Math.pow(actual[i] - forecast[i], 2);
    }

    return Math.sqrt(sum / actual.length);
}