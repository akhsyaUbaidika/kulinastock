"use client";

import { usePathname }
    from "next/navigation";

import Navbar
    from "./Navbar";

export default function LayoutWrapper({
    children
}) {

    const pathname =
        usePathname();

    const isLoginPage =
        pathname === "/login";

    return (

        <>

            {
                !isLoginPage
                &&
                <Navbar />
            }

            <main
                className={
                    isLoginPage
                        ? ""
                        : "ml-[260px]"
                }
            >

                {children}

            </main>

        </>

    );

}