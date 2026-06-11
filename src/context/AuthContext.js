"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

const AuthContext =
    createContext();

export function AuthProvider({
    children
}) {

    const router =
        useRouter();

    const [
        user,
        setUser
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    useEffect(() => {

        fetch("/api/auth/me")

            .then(res =>
                res.json()
            )

            .then(data => {

                if (
                    data.authenticated
                ) {

                    setUser(
                        data.user
                    );

                }

                setLoading(false);

            });

    }, []);

    async function login({
        username,
        password,
    }) {

        const response =
            await fetch(
                "/api/auth/login",
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({

                            username,
                            password,

                        }),

                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error
            );

        }

        setUser(
            data.user
        );

        if (
            data.user.role
            === "analyst"
        ) {

            router.push(
                "/forecast-lab"
            );

            return;
        }

        router.push("/");

    }

    async function logout() {

        await fetch(
            "/api/auth/logout",
            {
                method:
                    "POST"
            }
        );

        setUser(null);

        router.push("/login");

    }

    return (

        <AuthContext.Provider
            value={{

                user,

                role:
                    user?.role,

                loading,

                isAuthenticated:
                    !!user,

                login,

                logout,

            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(
        AuthContext
    );

}