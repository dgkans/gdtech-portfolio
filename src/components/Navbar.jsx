import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { ThemeToggle } from "./ThemeToggle";
import { siteConfig } from "../data/config";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#github", label: "GitHub" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = ({ menuOpen, setMenuOpen }) => {
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <nav
      className="fixed top-0 w-full z-40 backdrop-blur-lg border-b shadow-sm
                 bg-white/70 dark:bg-black/60
                 border-black/10 dark:border-white/10"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a
            href="#home"
            className="font-mono text-xl font-bold text-gray-900 dark:text-white"
          >
            Gaurav<span className="text-blue-500">.tech</span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/${siteConfig.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border border-black/10 dark:border-white/15 hover:border-blue-500/40 hover:bg-blue-500/10 transition-colors"
              aria-label="Gaurav Desai on GitHub"
            >
              <FaGithub className="w-5 h-5" aria-hidden />
            </a>
            <div className="hidden md:flex items-center space-x-6">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <ThemeToggle className="hidden sm:inline-flex" />

            <button
              type="button"
              aria-label="Toggle menu"
              className="w-9 h-9 grid place-items-center cursor-pointer z-40 md:hidden text-gray-700 dark:text-gray-200 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              &#9776;
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
