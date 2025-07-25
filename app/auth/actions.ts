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

  const authForm = {
    email: email,
    password: password,
  };

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(authForm);

  if (authError) return { errorMessage: authError.message };
  else if (!authData.user) return { errorMessage: "Login failed." };

  const { error: publicError } = await supabase.from("user_profiles").update({ online: true }).eq("id", authData.user.id);

  if (publicError) return { errorMessage: "Status update failed." };

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

  const authForm = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error: authError } = await supabase.auth.signUp(authForm);

  if (authError) return { errorMessage: authError.message };
  else if (!authData.user) return { errorMessage: "Registration failed." };

  const publicForm = {
    id: authData.user.id,
    name: name,
    email: authData.user.email,
    online: false,
    study_streak: 0,
  };

  const { error: publicError } = await supabase.from("user_profiles").insert(publicForm);

  if (publicError) return { errorMessage: publicError.message };

  revalidatePath("/", "layout");
  redirect("/");
}
