"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { registerSchema } from "@/lib/schema";

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse({
      username,
      password,
      firstName,
      lastName,
    });

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0];
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    try {
      setStatusMessage("Registering you...");
      const res = await axios.post("/api/registerUser", {
        username,
        password,
        firstName,
        lastName,
      });

      if (res.data.message) {
        setStatusMessage(res.data.message || "Registration successful!");
        setTimeout(() => {
          router.push("/courses");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Something went wrong!";
      setStatusMessage(errorMessage);
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrors({});
                      setStatusMessage("");
                    }}
                  />
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
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrors({});
                      setStatusMessage("");
                    }}
                  />
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
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({});
                  setStatusMessage("");
                }}
              />

              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-80 px-4 py-3 rounded-md text-white bg-white/5 placeholder:text-sm text-sm"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                  setStatusMessage("");
                }}
              />

              <button
                type="submit"
                className="bg-[#eee] text-black px-4 py-2 rounded-full mt-6"
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

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 text-xs text-red-400 bg-red-400/5 p-4 rounded-md border border-red-400/20 w-full max-w-80">
                <h3 className="font-semibold mb-2">
                  Please fix the following:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

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
