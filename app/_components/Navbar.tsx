"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

import { motion } from "motion/react";

import FloodButton from "./_buttons/FloodButton";

import { NavLinkType } from "@/types/types";

import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const [userID, setUserID] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = await createClient();

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error);
          return;
        }

        if (user) {
          setUserID(user.id);
        }
      } catch (error) {
        console.error("Error in getUser:", error);
      }
    }

    getUser();
  }, []);

  async function signOut() {
    try {
      const supabase = await createClient();

      if (userID) {
        const { error: publicError } = await supabase.from("user_profiles").update({ online: false }).eq("id", userID);

        if (publicError) {
          console.error("Status update failed:", publicError);
        }
      }

      const { error: authError } = await supabase.auth.signOut();

      if (authError) {
        console.error("Error signing out:", authError);
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <nav className="relative z-30 left-[50%] top-8 flex w-fit -translate-x-[50%] items-center gap-6 rounded-lg border-[1px] border-neutral-700 bg-neutral-900 p-2 pr-4 text-sm text-neutral-500">
      <div className="hidden md:block">
        <Logo />
      </div>

      <NavLink link="/">Home</NavLink>
      <NavLink link="/contact">Contact</NavLink>
      {/* <NavLink link="/leaderboard">Leaderboard</NavLink> */}
      <NavLink link="/faq">FAQ</NavLink>

      <FloodButton text="Profile" link={`/profile/${userID}`} />

      <LogoutButton onClick={signOut}>Logout</LogoutButton>
    </nav>
  );
}

const Logo = () => {
  return (
    <svg width="24" height="auto" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 fill-neutral-50">
      <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" stopColor="#000000" />
      <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" stopColor="#000000" />
    </svg>
  );
};

const NavLink = ({ link, onClick, children }: NavLinkType) => {
  const pathname = usePathname();

  return (
    <Link href={`${link}`} rel="nofollow" onClick={onClick} className="block overflow-hidden">
      <motion.div whileHover={{ y: -20 }} transition={{ ease: "backInOut", duration: 0.5 }} className="h-[20px]">
        <span className={`flex h-[20px] items-center ${pathname !== link ? "text-neutral-50" : "text-blue-500"}`}>{children}</span>
        <span className={`flex h-[20px] items-center ${pathname !== link ? "text-neutral-50" : "text-blue-500"}`}>{children}</span>
      </motion.div>
    </Link>
  );
};

const LogoutButton = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => {
  return (
    <button onClick={onClick} className="block overflow-hidden cursor-pointer">
      <motion.div whileHover={{ y: -20 }} transition={{ ease: "backInOut", duration: 0.5 }} className="h-[20px]">
        <span className="flex h-[20px] items-center text-neutral-50">{children}</span>
        <span className="flex h-[20px] items-center text-neutral-50">{children}</span>
      </motion.div>
    </button>
  );
};

