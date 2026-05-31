import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("stock_history")
        .select(`
            *,
            items (
                item_name
            )
        `)
        .order("period", {
            ascending: false,
        });

    return Response.json({
        success: !error,
        data,
        error,
    });
}

export async function POST(request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from("stock_history")
        .insert([
            {
                item_id: body.item_id,
                stock_used: body.stock_used,
                period: body.period,
            },
        ])
        .select();

    return Response.json({
        success: !error,
        data,
        error,
    });
}