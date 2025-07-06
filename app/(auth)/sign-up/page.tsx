"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setStatusMessage("Username and password are required.");
      return;
    }
    try {
      const res = await axios.post("/api/registerUser", {
        username,
        password,
        firstName,
        lastName,
      });

      if (res.data.message) {
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
      setStatusMessage(res.data.message || "User created Successfully");
      setPassword("");
      setUsername("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      let errorMessage = "Failed to create user";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setStatusMessage(errorMessage);
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden text-white">
      <div className="w-full h-full grid grid-cols-2">
        <div>
          <h1>Some Image</h1>
        </div>
        <div className="relative flex justify-center items-center bg-amber-950 flex-col gap-5">
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(125% 125% at 50% 10%, #000000 40%, #350136 100%)",
            }}
          />
          <div className="p-8 flex flex-col gap-10 z-10 backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold">Sign Up to Sublime AI</h1>
              <p className="text-sm font-light text-white/60">
                Sign up and turn curiosity into mastery.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-5">
                <div className="flex flex-col gap-4">
                  <label htmlFor="name" className="text-sm">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-37.5 px-4 py-3 rounded-md text-white placeholder:text-sm text-sm bg-white/5"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <label htmlFor="name" className="text-sm">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-37.5 px-4 py-3 rounded-md text-white placeholder:text-sm text-sm bg-white/5"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
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
                Sign Up
              </button>
            </form>
            {statusMessage && (
              <p className="text-sm text-green-300 pt-2">{statusMessage}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
