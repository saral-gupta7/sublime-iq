"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { motion } from "motion/react";
const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setStatusMessage("Username is required.");
      return;
    }

    if (!password.trim()) {
      setStatusMessage("Password is required.");
      return;
    }
    try {
      const res = await axios.post("/api/loginUser", { username, password });

      if (res.data.message) {
        setTimeout(() => {
          router.push(`/courses`);
        }, 1500);
      } else {
        router.push("/");
      }
      setStatusMessage(
        res.data.message || "Sign In Successful. Redirecting...."
      );
      setPassword("");
      setUsername("");
    } catch (error) {
      let errorMessage = "Failed to Sign In";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setStatusMessage(errorMessage);
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden text-white">
      <div className="w-full h-full grid md:grid-cols-2 grid-cols-1">
        <div className="relative hidden md:flex-center backdrop-blur-4xl">
          <Image
            src={"/images/auth-image.jpg"}
            alt="auth-image"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative flex justify-center items-center flex-col gap-5">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100%, rgba(139,92,246,0.4), transparent)`,
            }}
          ></div>
          <motion.div
            className="p-8 flex flex-col gap-10 z-10 backdrop-blur-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold">Sign In to Sublime AI</h1>
              <p className="text-sm font-light text-white/60">
                Let&apos;s begin your journey!
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">
              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-80 px-4 py-3 rounded-md text-white placeholder:text-sm text-sm bg-white/5"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-80 px-4 py-3  rounded-md placeholder:text-sm  text-sm bg-white/5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="bg-[#eee] text-black px-4 py-2 rounded-full mt-10"
                type="submit"
              >
                Sign In
              </button>

              <p className="text-white/70 flex gap-2 text-sm ">
                <span>Don&apos;t have an account?</span>
                <Link href={"/sign-up"} className="underline">
                  Sign Up
                </Link>
              </p>
            </form>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {statusMessage && (
                <p className="text-sm text-white/70 px-4 py-2">
                  {statusMessage}
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
