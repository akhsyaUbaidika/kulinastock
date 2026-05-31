import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("id");

    return Response.json({
        success: !error,
        data,
        error,
    });
}

export async function POST(request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from("items")
        .insert([
            {
                item_name: body.item_name,
                category: body.category,
                current_stock: body.current_stock,
            },
        ])
        .select();

    return Response.json({
        success: !error,
        data,
        error,
    });
}