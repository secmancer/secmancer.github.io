import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { SiTryhackme, SiHackthebox } from "react-icons/si";
import { MdSchool } from "react-icons/md";

export default function Home() {
  return (
    <div className="grid  grid-rows-[10px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <header className="row-start-1">
          <h1 className="text-4xl sm:text-6xl font-bold text-center">
            Adan Silva
          </h1>
          <br />
          <h6 className="text-2xl sm:text-4xl text-center">
            Cybersecurity Student
          </h6>
          <br />
          <p className="text-center text-[#666] dark:text-[#999] text-lg sm:text-xl mt-2">
            Hello, my name is Adan Silva. I am a college sophmore at Cal Poly
            San Luis Obispo pursuing a Bachelor's Degree in CS, with Data
            Privacy and Security concentration. Currently, I am working as a
            student assistant at Cal Poly's SOC, along with doing internship
            work for NGHTWLL Consulting LLC, where I mostly fullfil centralized
            services administration. I am really interested in pursing a career
            in cybersecurity, in which I'm currently educating myself in.
            Additionally, I have earned my CompTIA Security+ and ITF+
            certificates.
          </p>
        </header>
      </main>
    </div>
  );
}
