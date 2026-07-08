import { supabase } from "@/lib/supabase";

export async function GET() {

    try {

        const { data, error } =
            await supabase
                .from("audit_logs")
                .select(`
                    *,
                    users (
                        username
                    )
                `)
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(100);

        if (error)
            throw error;

        return Response.json({
            success: true,
            data
        });

    }

    catch (err) {

        return Response.json(
            {
                success: false,
                message: err.message
            },
            {
                status: 500
            }
        );

    }

}