"use client";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/me", { withCredentials: true });
        if (res.data?.user) router.replace("/");
      } catch {}
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setStatusMessage("Please enter both username and password.");
      return;
    }

    try {
      setStatusMessage("Signing you in...");
      const res = await axios.post("/api/loginUser", { username, password });

      if (res.data.message) {
        setUsername("");
        setPassword("");
        setStatusMessage("Signed in! Redirecting...");
        setTimeout(() => (window.location.href = "/courses"), 700);
        return;
      }

      setUsername("");
      setPassword("");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Login failed. Please try again.";
      setStatusMessage(errorMessage);
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden text-white">
      <div className="w-full h-full grid md:grid-cols-2 grid-cols-1">
        {/* Left Illustration */}
        <div className="relative hidden md:flex items-center justify-center">
          <Image
            src={"/images/auth-image.jpg"}
            alt="auth-image"
            fill
            className="object-contain"
          />
        </div>

        {/* Right Form */}
        <div className="relative flex flex-col justify-center items-center px-4">
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
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold">Sign In to Sublime IQ</h1>
              <p className="text-sm font-light text-white/60">
                Let&apos;s begin your journey!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                className="w-80 px-4 py-3 rounded-md bg-white/5 text-sm text-white placeholder:text-sm"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setStatusMessage("");
                }}
              />

              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                className="w-80 px-4 py-3 rounded-md bg-white/5 text-sm text-white placeholder:text-sm"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setStatusMessage("");
                }}
              />

              <button
                type="submit"
                className="bg-[#eee] text-black px-4 py-2 rounded-full mt-10"
              >
                Sign In
              </button>

              <p className="text-sm text-white/70 flex gap-2">
                <span>Don&apos;t have an account?</span>
                <Link href="/sign-up" className="underline">
                  Sign Up
                </Link>
              </p>
            </form>

            {statusMessage && (
              <motion.p
                className="text-sm text-white/70 px-4 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {statusMessage}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
