import {
  Geist,
  Geist_Mono
}
  from "next/font/google";

import Navbar
  from "@/components/Navbar";

import "./globals.css";

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",
    subsets: ["latin"]
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",
    subsets: ["latin"]
  });

export default function RootLayout({
  children
}) {

  return (

    <html
      lang="en"
      className={`
${geistSans.variable}
${geistMono.variable}
`}
    >

      <body>

        <Navbar />

        <main
          id="dashboard-content"
          className="
min-h-screen
transition-all
duration-300
ml-[260px]
"
        >
          {children}
        </main>

      </body>

    </html>

  );

}