"use client";
import { navItems } from "@/constants/constant";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="fixed inset-x-0 top-0 h-25 text-white font-main z-50">
      <div className="absolute inset-0 bg-transparent grid grid-cols-3 items-center backdrop-blur-sm place-items-center">
        {/* Logo */}
        <div className="">
          <h1>
            <Link href={"/"}>Sublime IQ</Link>
          </h1>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex ">
          <ul className="flex gap-6 items-center">
            {navItems.map(({ label, path, key }) => (
              <motion.li
                key={key}
                className="relative pb-1"
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={{
                  rest: { color: "#fff" },
                  hover: { color: "#f87171" },
                }}
              >
                <Link href={path} className="relative">
                  {label}
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 bottom-0 h-[2px] w-full bg-red-500 origin-left scale-x-0"
                    variants={{
                      rest: { scaleX: 0 },
                      hover: { scaleX: 1 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end gap-4 mr-4">
          <button className="">
            <Link href={"/sign-up"}>Sign Up</Link>
          </button>
          <button className="border-1 border-white/40 px-4 py-1 rounded-sm hover:bg-white hover:text-black transition-all duration-300">
            <Link href={"/create"}>Create</Link>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden col-span-2 justify-self-end mr-4"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center py-4 gap-4 animate-fade-in">
          <ul className="flex flex-col gap-4 items-center">
            {navItems.map(({ label, path, key }) => (
              <li key={key}>
                <Link href={path} onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <button className="">Sign Up</button>
          <button className="border-1 border-white/40 px-4 py-1 rounded-sm hover:bg-white hover:text-black transition-all duration-300">
            <Link href={"/create-course"} onClick={() => setMenuOpen(false)}>
              Create
            </Link>
          </button>
        </div>
      )}
    </article>
  );
};

export default Navbar;
