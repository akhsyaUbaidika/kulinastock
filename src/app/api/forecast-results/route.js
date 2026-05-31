import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("forecast_results")
        .select(`
            *,
            items (
                item_name
            )
        `)
        .order("created_at", {
            ascending: false,
        });

    return Response.json({
        success: !error,
        data,
        error,
    });
}