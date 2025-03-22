import Link from "next/link";
import { House, Pi } from "lucide-react";

const links = [
  {
    name: "Experience",
    href: "/experience",
  },
  {
    name: "Skills",
    href: "/skills",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "Certificates",
    href: "/certs",
  },
  {
    name: "Resume",
    href: "/resume",
  },
];

export default async function Navbar({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex flex-row border-b border-white">
        <Link
          className="p-2 m-2 h-12 w-12 flex items-center justify-center rounded-full hover:bg-gray-400 transition-all duration-300"
          href="/"
        >
          <House size={36} />
        </Link>
        <div className="w-1/2 ml-auto flex items-center justify-between mr-8">
          {links.map((link, index) => (
            <Link
              href={link.href}
              key={index}
              className="px-4 py-2 text-white hover:text-gray-400 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
