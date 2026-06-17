export default function BestMethodCard({
    method
}) {

    if (!method) {
        return null;
    }

    return (

        <div
            className="
bg-gradient-to-br
from-blue-50
to-white
rounded-[32px]
border
border-blue-100
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
                Best Method
            </p>

            <h2
                className="
text-4xl
font-bold
text-[#0B132B]
mb-4
"
            >
                {method.name}
            </h2>

            <div
                className="
grid
grid-cols-1
md:grid-cols-3
gap-4
mb-6
"
            >

                <div>
                    <p className="text-slate-500 text-sm">
                        MAPE
                    </p>

                    <p className="text-2xl font-bold">
                        {method.mape}%
                    </p>
                </div>

                <div>
                    <p className="text-slate-500 text-sm">
                        MAE
                    </p>

                    <p className="text-2xl font-bold">
                        {method.mae}
                    </p>
                </div>

                <div>
                    <p className="text-slate-500 text-sm">
                        RMSE
                    </p>

                    <p className="text-2xl font-bold">
                        {method.rmse}
                    </p>
                </div>

            </div>

            <div className="space-y-3">

                {method.reason?.map(
                    reason => (

                        <div
                            key={reason}
                            className="
flex
items-center
gap-3
text-slate-700
"
                        >

                            <span
                                className="
text-emerald-600
font-bold
"
                            >
                                ✓
                            </span>

                            <span>
                                {reason}
                            </span>

                        </div>

                    )
                )}

            </div>

        </div>

    );

}