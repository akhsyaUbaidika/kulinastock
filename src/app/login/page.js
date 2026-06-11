"use client";

import {
    useState,
} from "react";

import {
    useAuth,
} from "@/context/AuthContext";

export default function LoginPage() {

    const {
        login,
    } = useAuth();

    const [
        form,
        setForm
    ] = useState({

        username: "",
        password: "",

    });

    async function submit(
        e
    ) {

        e.preventDefault();

        try {

            await login({

                username:
                    form.username,

                password:
                    form.password,

            });

        } catch (err) {

            alert(
                err.message
            );

        }

    }

    return (

        <main
            className="
min-h-screen
flex
items-center
justify-center
bg-slate-100
p-8
"
        >

            <div
                className="
w-full
max-w-md
bg-white
rounded-[32px]
p-10
shadow-sm
"
            >

                <div
                    className="
mb-8
"
                >

                    <div
                        className="
uppercase
tracking-[0.3em]
text-xs
text-blue-600
mb-3
"
                    >

                        KulinaStock

                    </div>

                    <h1
                        className="
text-4xl
font-bold
"
                    >

                        Login

                    </h1>

                    <p
                        className="
text-slate-500
mt-3
"
                    >

                        Inventory forecasting system.

                    </p>

                </div>

                <form
                    onSubmit={
                        submit
                    }
                    className="
space-y-5
"
                >

                    <input
                        required
                        placeholder="Username"
                        value={
                            form.username
                        }
                        onChange={
                            e =>

                                setForm({

                                    ...form,

                                    username:
                                        e.target
                                            .value

                                })
                        }
                        className="
input-ui
"
                    />

                    <input
                        required
                        type="password"
                        placeholder="Password"
                        value={
                            form.password
                        }
                        onChange={
                            e =>

                                setForm({

                                    ...form,

                                    password:
                                        e.target
                                            .value

                                })
                        }
                        className="
input-ui
"
                    />

                    <button
                        className="
btn-primary
w-full
"
                    >

                        Login

                    </button>

                </form>

            </div>

        </main>

    );

}