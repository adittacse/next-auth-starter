"use client";

import LoginButton from "@/components/LoginButton";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const AuthButtons = () => {
    const session = useSession();

    return (
        <div className="flex gap-5">
            {
                session.status === "authenticated" ? <>
                    <button onClick={() => signOut()} className="btn">Logout</button>
                </> : <>
                    <LoginButton />

                    <Link href="/register" className="btn">
                        Register
                    </Link>
                </>
            }
        </div>
    );
};

export default AuthButtons;