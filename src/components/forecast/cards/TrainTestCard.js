export default function TrainTestCard({
    trainTest
}) {

    if (!trainTest) {
        return null;
    }

    return (

        <div
            className="
bg-white
rounded-[32px]
border
border-slate-200
shadow-sm
p-8
mb-8
"
        >

            <p
                className="
uppercase
tracking-[0.25em]
text-blue-600
text-xs
font-semibold
mb-2
"
            >
                Train-Test Analysis
            </p>

            <h2
                className="
text-3xl
font-bold
text-[#0B132B]
mb-8
"
            >
                Train-Test Validation
            </h2>

            <div className="space-y-6">

                <div>

                    <div className="flex justify-between mb-2">

                        <span>
                            Training Data
                        </span>

                        <span>
                            {trainTest.train_percentage}%
                        </span>

                    </div>

                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-blue-600"
                            style={{
                                width:
                                    `${trainTest.train_percentage}%`
                            }}
                        />

                    </div>

                </div>

                <div>

                    <div className="flex justify-between mb-2">

                        <span>
                            Testing Data
                        </span>

                        <span>
                            {trainTest.test_percentage}%
                        </span>

                    </div>

                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-orange-500"
                            style={{
                                width:
                                    `${trainTest.test_percentage}%`
                            }}
                        />

                    </div>

                </div>

            </div>
            <div
                className="
grid
grid-cols-2
md:grid-cols-4
gap-6
mt-8
mb-8
"
            >

                <div className="bg-slate-50 rounded-2xl p-5">

                    <p className="text-sm text-slate-500 mb-2">
                        Training Records
                    </p>

                    <p className="text-3xl font-bold">
                        {trainTest.train_size}
                    </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-5">

                    <p className="text-sm text-slate-500 mb-2">
                        Testing Records
                    </p>

                    <p className="text-3xl font-bold">
                        {trainTest.test_size}
                    </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-5">

                    <p className="text-sm text-slate-500 mb-2">
                        Train Ratio
                    </p>

                    <p className="text-3xl font-bold text-blue-600">
                        {trainTest.train_percentage}%
                    </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-5">

                    <p className="text-sm text-slate-500 mb-2">
                        Test Ratio
                    </p>

                    <p className="text-3xl font-bold text-orange-500">
                        {trainTest.test_percentage}%
                    </p>

                </div>

            </div>

            <div
                className="
grid
grid-cols-1
md:grid-cols-2
gap-6
mt-8
"
            >

                <div
                    className="
bg-slate-50
rounded-2xl
p-5
"
                >

                    <p className="text-sm text-slate-500 mb-2">
                        Training Period
                    </p>

                    <p className="font-semibold">
                        {trainTest.train_start}
                    </p>

                    <p className="text-slate-400 my-2">
                        ↓
                    </p>

                    <p className="font-semibold">
                        {trainTest.train_end}
                    </p>

                </div>

                <div
                    className="
bg-slate-50
rounded-2xl
p-5
"
                >

                    <p className="text-sm text-slate-500 mb-2">
                        Testing Period
                    </p>

                    <p className="font-semibold">
                        {trainTest.test_start}
                    </p>

                    <p className="text-slate-400 my-2">
                        ↓
                    </p>

                    <p className="font-semibold">
                        {trainTest.test_end}
                    </p>
                </div>

            </div>
            <div
                className="
mt-8
rounded-2xl
bg-blue-50
border
border-blue-100
p-6
"
            >

                <h3
                    className="
font-semibold
text-blue-700
mb-3
"
                >
                    Evaluation Note
                </h3>

                <p
                    className="
text-slate-600
leading-7
"
                >
                    Historical demand data were divided into
                    {` ${trainTest.train_percentage}% `}
                    training data and
                    {` ${trainTest.test_percentage}% `}
                    testing data.
                    Training data were used to build forecasting
                    models, while testing data were used to
                    evaluate forecasting performance using
                    MAE, MAPE, and RMSE metrics.
                </p>

            </div>
        </div>

    );

}