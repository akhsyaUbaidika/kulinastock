"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b p-4 flex gap-6">
            <Link href="/">
                Dashboard
            </Link>

            <Link href="/items">
                Items
            </Link>

            <Link href="/forecast">
                Forecast
            </Link>

            <Link href="/history">
                History
            </Link>
        </nav>
    );
}