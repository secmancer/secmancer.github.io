import { Github } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="grid  grid-rows-[10px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <header className="row-start-1">
          <h1 className="text-4xl sm:text-6xl font-bold text-center">
            Adan Silva
          </h1>
          <h6 className="text-2xl sm:text-4xl text-center">
            Cybersecurity Student
          </h6>
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
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://github.com/secmancer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2" />
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://www.linkedin.com/in/adan-silva-secmancer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="mr-2" />
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="mailto:adan.t.silva77@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail className="mr-2" />
          </a>
        </div>
      </footer>
    </div>
  );
}
