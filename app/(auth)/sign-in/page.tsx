"use client";

import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type loginForm = {
  username: string;
  password: string;
};

const SignInPage = () => {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    setError,

    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<loginForm>();

  const [statusMessage, setStatusMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/me", { withCredentials: true });
        if (res.data?.user) router.replace("/");
      } catch {}
    };
    checkSession();
  }, [router]);

  const onSubmit: SubmitHandler<loginForm> = async (data) => {
    try {
      setStatusMessage("Signing you in...");
      const res = await axios.post("/api/loginUser", data);

      if (res.data.message) {
        setStatusMessage("Signed in! Redirecting...");

        reset();
        setTimeout(() => (window.location.href = "/courses"), 700);
        return;
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Login failed. Please try again.";

      if (errorMessage.includes("Username")) {
        setError("username", { message: errorMessage });
      } else if (errorMessage.includes("password")) {
        setError("password", { message: errorMessage });
      } else {
        setError("root", { message: errorMessage });
      }

      setStatusMessage("");
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden text-white">
      <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
        {/* Left Image */}
        <div className="relative hidden items-center justify-center md:flex">
          <Image
            src={"/images/auth-image.jpg"}
            alt="auth-image"
            fill
            className="object-contain"
          />
        </div>

        {/* Right Form */}
        <div className="relative flex flex-col items-center justify-center px-4">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100%, rgba(139,92,246,0.4), transparent)`,
            }}
          ></div>

          <motion.div
            className="z-10 flex flex-col gap-10 p-8 backdrop-blur-xl"
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                className="w-80 rounded-md bg-white/5 px-4 py-3 text-sm text-white placeholder:text-sm"
                {...register("username", {
                  required: "Username can't be empty",
                  onChange: () => {
                    clearErrors();
                    setStatusMessage("");
                  },
                })}
              />
              {errors.username && (
                <p id="username-error" className="mt-1 text-xs text-red-300">
                  {errors.username.message as string}
                </p>
              )}

              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <div className="relative w-80">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter password"
                  className="w-full rounded-md bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-sm"
                  {...register("password", {
                    required: "Password can't be empty",

                    onChange: () => {
                      clearErrors();
                      setStatusMessage("");
                    },
                  })}
                />

                <div
                  className="absolute top-1/2 right-4 -translate-y-1/2 transform cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>

              {errors.password && (
                <p id="username-error" className="mt-1 text-xs text-red-300">
                  {errors.password.message as string}
                </p>
              )}

              <button
                type="submit"
                className="mt-10 rounded-full bg-[#eee] px-4 py-2 text-black"
                disabled={isSubmitting}
              >
                Sign In
              </button>

              <p className="flex gap-2 text-sm text-white/70">
                <span>Don&apos;t have an account?</span>
                <Link href="/sign-up" className="underline">
                  Sign Up
                </Link>
              </p>
            </form>

            {statusMessage && (
              <motion.p
                className="px-4 py-2 text-sm text-white/70"
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

export default SignInPage;
