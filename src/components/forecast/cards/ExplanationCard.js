export default function ExplanationCard({
    explanation
}) {

    if (!explanation) {
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
                DSS Explanation
            </p>

            <h2
                className="
text-3xl
font-bold
text-[#0B132B]
mb-8
"
            >
                Why This Method?
            </h2>

            <div className="space-y-6">

                <div>
                    <h3
                        className="
font-semibold
text-lg
mb-2
"
                    >
                        Summary
                    </h3>

                    <p
                        className="
text-slate-600
leading-7
"
                    >
                        {
                            explanation.summary
                        }
                    </p>
                </div>

                <div>
                    <h3
                        className="
font-semibold
text-lg
mb-2
"
                    >
                        Statistical Reason
                    </h3>

                    <p
                        className="
text-slate-600
leading-7
"
                    >
                        {
                            explanation.statistical_reason
                        }
                    </p>
                </div>

                <div>
                    <h3
                        className="
font-semibold
text-lg
mb-2
"
                    >
                        Business Reason
                    </h3>

                    <p
                        className="
text-slate-600
leading-7
"
                    >
                        {
                            explanation.business_reason
                        }
                    </p>
                </div>

            </div>

        </div>

    );

}