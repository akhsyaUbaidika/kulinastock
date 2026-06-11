import { cookies } from "next/headers";

import { redirect } from "next/navigation";

export default async function HomePage() {

  const cookieStore =
    await cookies();

  const auth =
    cookieStore.get(
      "kulinastock_auth"
    );

  if (!auth) {

    redirect("/login");

  }

  let user = null;

  try {

    user =
      JSON.parse(
        decodeURIComponent(
          auth.value
        )
      );

  } catch {

    redirect("/login");

  }

  if (
    user.role === "analyst"
  ) {

    redirect(
      "/forecast-lab"
    );

  }

  redirect("/dashboard");

}