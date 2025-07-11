"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function updateUser(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const instagram = formData.get("instagram") as string;
  const x = formData.get("x") as string;
  const tiktok = formData.get("tiktok") as string;
  const youtube = formData.get("youtube") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  if (!name || !name.trim()) return { errorMessage: "Name is required!" };

  const emptyToNull = (value: string | null): string | null => {
    return value && value.trim() !== "" ? value : null;
  };

  const profileForm = {
    name: name,
    instagram: emptyToNull(instagram),
    x: emptyToNull(x),
    tiktok: emptyToNull(tiktok),
    youtube: emptyToNull(youtube),
    location: emptyToNull(location),
    description: emptyToNull(description),
  };

  const { error } = await supabase.from("user_profiles").update(profileForm).eq("id", id);

  if (error) return { errorMessage: error.message };

  redirect(`/profile/${id}`);
}
