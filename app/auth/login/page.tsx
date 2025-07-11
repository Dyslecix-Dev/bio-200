"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

import { motion } from "motion/react";

import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import SplashButton from "@/app/_components/_buttons/SplashButton";
import StackedNotification from "@/app/_components/StackedNotification";

import { login } from "@/app/auth/actions";

export default function Login() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        <LoginForm showNotification={showNotification} />
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
      <h1 className="text-2xl font-semibold">Sign in to your account</h1>
      <p className="text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-blue-400">
          Sign Up.
        </Link>
      </p>
    </div>
  </div>
);

const LoginForm = ({ showNotification }: { showNotification: (message: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (event: FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let isValid = true;

    if (!email || !email.trim()) {
      showNotification("Email is required!");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showNotification("Please enter a valid email address!");
      isValid = false;
    } else if (!password) {
      showNotification("Password is required!");
      isValid = false;
    } else if (password.length < 8) {
      showNotification("Password must be at least 8 characters!");
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
      const result = await login(formData);

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="mb-1.5 block text-zinc-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@provider.com"
          required
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label htmlFor="password" className="block text-zinc-400">
            Password
          </label>

          <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition duration-300">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          required
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>

      <SplashButton type="submit" disabled={isLoading} className={`w-full ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
        {isLoading ? "Logging In..." : "Login"}
      </SplashButton>
    </form>
  );
};
