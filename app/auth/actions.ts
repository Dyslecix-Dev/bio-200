"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !email.trim()) return { errorMessage: "Email is required!" };
  if (!/\S+@\S+\.\S+/.test(email)) return { errorMessage: "Please enter a valid email address!" };
  if (!password) return { errorMessage: "Password is required!" };
  if (password.length < 8) return { errorMessage: "Password must be at least 8 characters!" };

  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) return { errorMessage: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm_password = formData.get("confirm_password") as string;

  if (!name) return { errorMessage: "Name is required!" };
  if (!email || !email.trim()) return { errorMessage: "Email is required!" };
  if (!/\S+@\S+\.\S+/.test(email)) return { errorMessage: "Please enter a valid email address!" };
  if (!password) return { errorMessage: "Password is required!" };
  if (password.length < 8) return { errorMessage: "Password must be at least 8 characters!" };
  if (!confirm_password) return { errorMessage: "Confirm password is required!" };
  if (confirm_password.length < 8) return { errorMessage: "Confirm password must be at least 8 characters!" };
  if (password !== confirm_password) return { errorMessage: "Passwords do not match!" };

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) return { errorMessage: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}
