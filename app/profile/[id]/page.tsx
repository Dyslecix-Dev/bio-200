"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { FiMapPin } from "react-icons/fi";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import StackedNotification from "@/app/_components/StackedNotification";
import FloodButton from "@/app/_components/_buttons/FloodButton";

import { BlockType, UserType } from "@/types/types";

import { createClient } from "@/utils/supabase/client";
import { checkAndResetStudyStreak } from "@/app/utils/studyStreak/checkAndResetStudyStreak";

export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const userID = params.id;

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const supabase = await createClient();

        const { data: userProfile, error } = await supabase.from("user_profiles").select("*").eq("id", userID).single();

        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }

        if (!userProfile) {
          console.error("No user profile found");
          return;
        }

        const { name, online, instagram, x, tiktok, youtube, location, description, last_study_date } = userProfile;

        // Check and potentially reset study streak if 2+ days have passed
        const updatedStreak = await checkAndResetStudyStreak(supabase, userID as string);

        setUser({
          id: userID as string,
          name,
          online,
          socials: {
            instagram: instagram || "",
            x: x || "",
            tiktok: tiktok || "",
            youtube: youtube || "",
          },
          location: location || "Earth",
          description: description || "Describe myself? I would rather remain anonymous.",
          lastStudyDate: last_study_date,
          studyStreak: updatedStreak,
        });

        // Show notification based on study streak and last study date
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayFormatted = yesterday.toISOString().split("T")[0];

        const lastStudyDateFormatted = last_study_date ? new Date(last_study_date).toISOString().split("T")[0] : null;

        if (lastStudyDateFormatted === today) {
          showNotification(`Way to go! Your current streak is ${updatedStreak} ${updatedStreak === 1 ? "day" : "days"}.`);
        } else if (updatedStreak === 0) {
          const formattedLastStudyDate = last_study_date ? new Date(last_study_date).toLocaleDateString() : "never";
          showNotification(`You lost your streak! The last time you studied was on ${formattedLastStudyDate}.`);
        } else if (updatedStreak > 0 && lastStudyDateFormatted === yesterdayFormatted) {
          showNotification(`Time to study! Maintain your streak of ${updatedStreak} ${updatedStreak === 1 ? "day" : "days"}.`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userID) {
      fetchUser();
    }
  }, [userID]);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setIsNotifOpen(true);
  };

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
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />

      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="relative z-20 mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4 h-full px-4 py-24 md:px-8 md:py-36 text-white"
      >
        <HeaderBlock user={user} signOut={signOut} />
        <SocialsBlock loading={loading} socials={user?.socials} />
        <div className="col-span-12 grid grid-cols-12 gap-4">
          <LocationBlock location={user?.location} />
          <AboutBlock user={user} />
        </div>

        <Block className="col-span-12 bg-transparent border-none">
          <FloodButton text="Edit Profile" link={`/profile/${userID}/edit`} className={`flex justify-center text-2xl`} />
        </Block>
      </motion.div>

      <Beams />
      <GradientGrid />
      <StackedNotification isNotifOpen={isNotifOpen} setIsNotifOpen={setIsNotifOpen} message={message} />
    </main>
  );
}

const Block = ({ className, ...rest }: BlockType) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={twMerge("col-span-4 rounded-lg border border-zinc-700 bg-zinc-800 p-6", className)}
      {...rest}
    />
  );
};

const HeaderBlock = ({ user, signOut }: { user: UserType | null; signOut: () => Promise<void> }) => (
  <Block className="flex flex-col gap-4 col-span-12 row-span-2 md:col-span-6">
    <div className="w-full flex justify-between">
      <RxAvatar className="w-10 h-10 rounded-full bg-slate-300 object-cover object-top shrink-0" />

      <button onClick={signOut} className="text-neutral-200 hover:text-indigo-400 transition-colors duration-700 cursor-pointer">
        Logout
      </button>
    </div>

    <h1 className="text-4xl font-medium leading-tight">{user?.name}</h1>

    <div className="flex items-center justify-between">
      <span className={`w-fit px-2 py-1 text-lg font-medium rounded-full ${user?.online === true ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
        {user?.online ? "Online" : "Offline"}
      </span>

      <h2
        className={`px-2 py-1 text-xl font-medium leading-tight rounded-full ${
          user?.studyStreak === 0 ? "bg-red-200 text-red-800" : (user?.studyStreak || 0) > 0 ? "bg-yellow-200 text-yellow-800" : ""
        } ${(user?.studyStreak || 0) > 7 ? "bg-green-200 text-green-800" : ""}`}
      >
        Study Streak: {user?.studyStreak || 0} {user?.studyStreak === 1 ? "day" : "days"}
      </h2>
    </div>
  </Block>
);

const SocialsBlock = ({ loading, socials }: { loading: boolean; socials?: { instagram?: string; tiktok?: string; x?: string; youtube?: string } }) => {
  const isDisabled = (socialLink?: string) => loading || !socialLink || socialLink.trim() === "";

  return (
    <>
      <Block
        whileHover={
          !isDisabled(socials?.instagram)
            ? {
                rotate: "-2.5deg",
                scale: 1.1,
              }
            : {}
        }
        className={`col-span-6  md:col-span-3 ${isDisabled(socials?.instagram) ? "opacity-50 cursor-not-allowed bg-zinc-400" : "bg-[#D62976]"}`}
      >
        {isDisabled(socials?.instagram) ? (
          <div className="grid h-full place-content-center text-3xl text-white">
            <SiInstagram />
          </div>
        ) : (
          <Link href={socials?.instagram || "#"} target="_blank" rel="nofollow noopener noreferrer" className="grid h-full place-content-center text-3xl text-white">
            <SiInstagram />
          </Link>
        )}
      </Block>

      <Block
        whileHover={
          !isDisabled(socials?.x)
            ? {
                rotate: "2.5deg",
                scale: 1.1,
              }
            : {}
        }
        className={`col-span-6  md:col-span-3 ${isDisabled(socials?.x) ? "opacity-50 cursor-not-allowed bg-zinc-400" : "bg-black"}`}
      >
        {isDisabled(socials?.x) ? (
          <div className="grid h-full place-content-center text-3xl text-white">
            <FaXTwitter />
          </div>
        ) : (
          <Link href={socials?.x || "#"} target="_blank" rel="nofollow noopener noreferrer" className="grid h-full place-content-center text-3xl text-white">
            <FaXTwitter />
          </Link>
        )}
      </Block>

      <Block
        whileHover={
          !isDisabled(socials?.tiktok)
            ? {
                rotate: "-2.5deg",
                scale: 1.1,
              }
            : {}
        }
        className={`col-span-6  md:col-span-3 ${isDisabled(socials?.tiktok) ? "opacity-50 cursor-not-allowed bg-zinc-400" : "bg-zinc-50"}`}
      >
        {isDisabled(socials?.tiktok) ? (
          <div className="grid h-full place-content-center text-3xl text-black">
            <SiTiktok />
          </div>
        ) : (
          <Link href={socials?.tiktok || "#"} target="_blank" rel="nofollow noopener noreferrer" className="grid h-full place-content-center text-3xl text-black">
            <SiTiktok />
          </Link>
        )}
      </Block>

      <Block
        whileHover={
          !isDisabled(socials?.youtube)
            ? {
                rotate: "2.5deg",
                scale: 1.1,
              }
            : {}
        }
        className={`col-span-6  md:col-span-3 ${isDisabled(socials?.youtube) ? "opacity-50 cursor-not-allowed bg-zinc-400" : "bg-red-500"}`}
      >
        {isDisabled(socials?.youtube) ? (
          <div className="grid h-full place-content-center text-3xl text-white">
            <SiYoutube />
          </div>
        ) : (
          <Link href={socials?.youtube || "#"} target="_blank" rel="nofollow noopener noreferrer" className="grid h-full place-content-center text-3xl text-white">
            <SiYoutube />
          </Link>
        )}
      </Block>
    </>
  );
};

const LocationBlock = ({ location }: { location?: string }) => (
  <Block className="col-span-12 flex flex-col items-center justify-center gap-4 md:col-span-3 bg-zinc-400">
    <FiMapPin className="text-3xl text-zinc-800" />
    <p className="text-center text-lg text-zinc-800">{location}</p>
  </Block>
);

const AboutBlock = ({ user }: { user?: UserType | null }) => (
  <Block className="col-span-12 text-3xl leading-snug md:col-span-9">
    <p>{user?.description}</p>
  </Block>
);
