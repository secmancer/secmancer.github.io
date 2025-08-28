import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { SiTryhackme, SiHackthebox } from "react-icons/si";
import { MdSchool } from "react-icons/md";

export default function page() {
  return (
    <div className="grid  grid-rows-[10px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <header className="row-start-1">
          <br />
          <br />
          <h6 className="text-2xl sm:text-4xl text-center">
            Contact me or check out my socials below!
          </h6>
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
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://www.instagram.com/secmancer/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="mr-2" />
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://tryhackme.com/p/secmancer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiTryhackme className="mr-2 size-7" />
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://app.hackthebox.com/profile/2508641"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiHackthebox className="mr-2 size-7" />
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://pwn.college/hacker/secmancer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdSchool className="mr-2 size-7" />
          </a>
        </div>
      </footer>
    </div>
  );
}
