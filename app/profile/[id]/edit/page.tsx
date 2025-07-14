"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";

import { motion } from "motion/react";

import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import SplashButton from "@/app/_components/_buttons/SplashButton";
import StackedNotification from "@/app/_components/StackedNotification";

import { UserType } from "@/types/types";

import { createClient } from "@/utils/supabase/client";

import { updateUser } from "@/app/profile/[id]/edit/actions";

export default function EditProfile() {
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  const userID = params.id;

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const supabase = await createClient();

        const { data: userProfile, error } = await supabase.from("user_profiles").select("*").eq("id", userID).single();

        if (!error && userProfile) {
          const { name, online, instagram, x, tiktok, youtube, location, description, last_study_date, study_streak } = userProfile;

          setUser({
            id: userID as string,
            name: name,
            online: online,
            socials: {
              instagram: instagram || "",
              x: x || "",
              tiktok: tiktok || "",
              youtube: youtube || "",
            },
            location: location || "",
            description: description || "",
            lastStudyDate: last_study_date,
            studyStreak: study_streak,
          });
        } else if (error) {
          console.error("Error fetching user profile:", error);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 py-20 text-zinc-200 selection:bg-zinc-600">
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.25,
          ease: "easeInOut",
        }}
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <Heading />
        <EditProfileForm showNotification={showNotification} user={user} loading={loading} />
      </motion.div>

      <Beams />
      <GradientGrid />
      <StackedNotification isNotifOpen={isNotifOpen} setIsNotifOpen={setIsNotifOpen} message={message} />
    </div>
  );
}

const Heading = () => (
  <div>
    <div className="mb-9 mt-6 space-y-1.5">
      <h1 className="text-2xl font-semibold">Edit your profile</h1>
    </div>
  </div>
);

const EditProfileForm = ({ showNotification, user, loading }: { showNotification: (message: string) => void; user: UserType | null; loading: boolean }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleCancel = () => {
    router.push(`/profile/${user?.id}`);
  };

  const validateForm = (event: FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    let isValid = true;

    if (!name || !name.trim()) {
      showNotification("Name is required!");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!validateForm(event)) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await updateUser(formData);
      if (result?.errorMessage) {
        showNotification(result.errorMessage);
      }
    } catch (error) {
      console.error(error);
      showNotification("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={user?.id || ""} />

      <div className="mb-3">
        <label htmlFor="name" className="mb-1.5 block text-zinc-400">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          defaultValue={user?.name || ""}
          required
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="instagram" className="mb-1.5 block text-zinc-400">
          Instagram URL
        </label>
        <input
          id="instagram"
          name="instagram"
          type="text"
          placeholder="https://www.instagram.com/YourProfileName"
          defaultValue={user?.socials?.instagram || ""}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="x" className="mb-1.5 block text-zinc-400">
          X URL
        </label>
        <input
          id="x"
          name="x"
          type="text"
          placeholder="https://x.com/YourProfileName"
          defaultValue={user?.socials?.x || ""}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="tiktok" className="mb-1.5 block text-zinc-400">
          TikTok URL
        </label>
        <input
          id="tiktok"
          name="tiktok"
          type="text"
          placeholder="https://www.tiktok.com/@YourAccountName"
          defaultValue={user?.socials?.tiktok || ""}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="youtube" className="mb-1.5 block text-zinc-400">
          YouTube URL
        </label>
        <input
          id="youtube"
          name="youtube"
          type="text"
          placeholder="https://www.youtube.com/@YourChannelName"
          defaultValue={user?.socials?.youtube || ""}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="mb-1.5 block text-zinc-400">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Your location"
          defaultValue={user?.location || ""}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="mb-1.5 block text-zinc-400">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={user?.description || ""}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <div className="flex gap-10">
        <SplashButton type="button" disabled={isLoading} onClick={handleCancel} className={`w-full from-red-400 to-red-700 ring-red-500/50 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
          Cancel
        </SplashButton>

        <SplashButton type="submit" disabled={isLoading} className={`w-full ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
          {isLoading ? "Updating..." : "Update"}
        </SplashButton>
      </div>
    </form>
  );
};
