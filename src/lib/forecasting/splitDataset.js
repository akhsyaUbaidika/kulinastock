export function splitDataset(
    dataset,
    splitRatio = 80
) {

    if (!dataset || dataset.length === 0) {

        return {
            train: [],
            test: [],
            trainSize: 0,
            testSize: 0
        };
    }

    const trainSize = Math.floor(
        dataset.length *
        (splitRatio / 100)
    );

    const train =
        dataset.slice(
            0,
            trainSize
        );

    const test =
        dataset.slice(
            trainSize
        );

    return {

        train,
        test,

        trainSize:
            train.length,

        testSize:
            test.length
    };
}