"use client";

import { registerSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

type registerForm = z.infer<typeof registerSchema>;

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<registerForm>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const onSubmit: SubmitHandler<registerForm> = async (data) => {
    try {
      setStatusMessage("Registering you...");
      const res = await axios.post("/api/registerUser", data);
      if (res.data.message) {
        setStatusMessage(res.data.message || "Registration successful!");
        reset();
        setTimeout(() => {
          router.push("/sign-up");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Something went wrong!";
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.field === "username"
      ) {
        setError("username", { message: errorMessage });
      } else {
        setError("root", { message: errorMessage });
      }

      setStatusMessage("");
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden text-white">
      <div className="w-full h-full grid md:grid-cols-2 grid-cols-1">
        {/* Left Side */}
        <div className="relative hidden md:flex-center">
          <Image
            src={"/images/auth-image.jpg"}
            alt="auth-image"
            fill
            className="object-contain"
          />
        </div>

        {/* Right Side */}
        <div className="relative flex justify-center items-center flex-col gap-5">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(circle 500px at 50% 100%, rgba(139,92,246,0.4), transparent)`,
            }}
          ></div>

          <motion.div
            className="p-8 flex flex-col gap-8 z-10 backdrop-blur-xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold">Sign Up to Sublime IQ</h1>
              <p className="text-sm font-light text-white/60">
                Sign up and turn curiosity into mastery.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter First Name"
                    className="w-37.5 px-4 py-3 rounded-md text-white bg-white/5 placeholder:text-sm text-sm"
                    {...register("firstName", {
                      onChange: () => {
                        clearErrors();
                        setStatusMessage("");
                      },
                    })}
                  />

                  <div className="w-40 flex flex-wrap">
                    {errors.firstName && (
                      <p
                        id="username-error"
                        className="text-xs text-red-300 mt-1"
                      >
                        {errors.firstName.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter Last Name"
                    className="w-37.5 px-4 py-3 rounded-md text-white bg-white/5 placeholder:text-sm text-sm"
                    {...register("lastName", {
                      onChange: () => {
                        clearErrors();
                        setStatusMessage("");
                      },
                    })}
                  />

                  <div className="w-40 flex flex-wrap">
                    {errors.lastName && (
                      <p
                        id="username-error"
                        className="text-xs text-red-300 mt-1"
                      >
                        {errors.lastName.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                className="w-80 px-4 py-3 rounded-md text-white bg-white/5 placeholder:text-sm text-sm"
                {...register("username", {
                  onChange: () => {
                    clearErrors();
                    setStatusMessage("");
                  },
                })}
              />
              {errors.username && (
                <p id="username-error" className="text-xs text-red-300 mt-1">
                  {errors.username.message as string}
                </p>
              )}

              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <div className="relative w-80 border">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-80 px-4 py-3 rounded-md text-white bg-white/5 placeholder:text-sm text-sm"
                  {...register("password", {
                    onChange: () => {
                      clearErrors();
                      setStatusMessage("");
                    },
                  })}
                />

                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>

              {errors.password && (
                <p id="username-error" className="text-xs text-red-300 mt-1">
                  {errors.password.message as string}
                </p>
              )}
              {errors.root && (
                <p className="text-xs text-red-300 mt-2">
                  {errors.root.message as string}
                </p>
              )}
              <button
                type="submit"
                className="bg-[#eee] text-black px-4 py-2 rounded-full mt-6"
                disabled={isSubmitting}
              >
                Sign Up
              </button>

              <p className="text-white/70 flex gap-2 text-sm">
                <span>Already have an account?</span>
                <Link href={"/sign-in"} className="underline">
                  Sign In
                </Link>
              </p>
            </form>

            {/* Status Message */}
            {statusMessage && (
              <p className="text-sm text-white/70 px-4 py-2">{statusMessage}</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
