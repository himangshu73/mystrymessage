"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="flex justify-between mx-auto p-4 bg-green-800">
      <div>
        <h1 className="text-2xl text-white font-extrabold">Mystry Message</h1>
      </div>
      <div>
        {session ? (
          <>
            <span className="text-white mr-4">
              Signed In as{" "}
              <span className="font-bold">{user?.username || user?.email}</span>
            </span>
            <Button className="font-bold" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="font-bold">Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
