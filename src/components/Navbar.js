"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
    {
        name: "Dashboard",
        href: "/",
        icon: "◫",
    },
    {
        name: "Items",
        href: "/items",
        icon: "▮",
    },
    {
        name: "History",
        href: "/history",
        icon: "◧",
    },
    {
        name: "Forecast",
        href: "/forecast",
        icon: "◩",
    },
    {
        name: "Results",
        href: "/forecast-result",
        icon: "◎",
    },
    {
        name: "Reports",
        href: "/reports",
        icon: "▣",
    },
];

export default function Navbar() {
    const pathname = usePathname();

    const [collapsed, setCollapsed] =
        useState(false);

    useEffect(() => {
        const main =
            document.getElementById(
                "dashboard-content"
            );

        if (!main) return;

        if (collapsed) {
            main.style.marginLeft =
                "96px";
        } else {
            main.style.marginLeft =
                "260px";
        }
    }, [collapsed]);

    return (
        <>

            <aside
                className={`
fixed
left-0
top-0
h-screen
bg-white
border-r
border-slate-200
z-50
transition-all
duration-300
flex
flex-col

${collapsed
                        ? "w-24"
                        : "w-[260px]"
                    }
`}
            >

                {/* HEADER */}

                <div
                    className="
h-[88px]
border-b
px-6
flex
items-center
justify-between
"
                >

                    {!collapsed && (
                        <div>

                            <h1
                                className="
text-2xl
font-bold
text-slate-900
"
                            >
                                KulinaStock
                            </h1>

                            <p
                                className="
text-sm
text-slate-500
"
                            >
                                Forecast Dashboard
                            </p>

                        </div>
                    )}

                    <button
                        onClick={() =>
                            setCollapsed(
                                !collapsed
                            )
                        }
                        className="
w-10
h-10
rounded-xl
hover:bg-slate-100
transition
"
                    >
                        ☰
                    </button>

                </div>

                {/* MENU */}

                <nav
                    className="
flex-1
px-3
py-5
space-y-2
"
                >

                    {menu.map(
                        (item) => {

                            const active =
                                pathname ===
                                item.href;

                            return (

                                <Link
                                    key={
                                        item.href
                                    }
                                    href={
                                        item.href
                                    }
                                    className={`
flex
items-center
gap-4
rounded-2xl
px-4
py-4
transition

${active
                                            ? `
bg-blue-50
text-blue-600
font-semibold
`
                                            : `
text-slate-600
hover:bg-slate-50
`
                                        }
`}
                                >

                                    <span
                                        className="
text-lg
min-w-[20px]
"
                                    >
                                        {
                                            item.icon
                                        }
                                    </span>

                                    {!collapsed &&
                                        item.name}

                                </Link>

                            );
                        }
                    )}

                </nav>

                {/* FOOTER */}

                <div
                    className="
border-t
p-4
text-sm
text-slate-400
"
                >
                    {!collapsed
                        ? "v1"
                        : ""}
                </div>

            </aside>

        </>
    );
}