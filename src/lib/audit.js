import { supabase } from "@/lib/supabase";

export async function createAuditLog({
    user_id,
    table_name,
    record_id,
    action,
    field_name = null,
    old_value = null,
    new_value = null
}) {

    const { error } =
        await supabase
            .from("audit_logs")
            .insert({

                user_id,

                table_name,

                record_id,

                action,

                field_name,

                old_value:
                    old_value?.toString() ?? null,

                new_value:
                    new_value?.toString() ?? null

            });

    if (error) {

        console.error(
            "Audit Log Error:",
            error
        );

    }

}