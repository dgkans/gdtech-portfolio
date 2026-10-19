import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#github", label: "GitHub" },
  { href: "#contact", label: "Contact" },
];

export const MobileMenu = ({ menuOpen, setMenuOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full z-40 flex flex-col items-center justify-center
                  bg-white/95 dark:bg-black/95 backdrop-blur-lg
                  transition-all duration-300 ease-in-out
                  ${
                    menuOpen
                      ? "h-screen opacity-100 pointer-events-auto"
                      : "h-0 opacity-0 pointer-events-none"
                  }`}
    >
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-6 right-6 text-3xl focus:outline-none cursor-pointer text-gray-900 dark:text-white"
        aria-label="Close Menu"
      >
        &times;
      </button>

      {NAV_LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          onClick={() => setMenuOpen(false)}
          className={`text-2xl font-semibold my-4 text-gray-900 dark:text-white transform transition-transform duration-300 ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {l.label}
        </a>
      ))}

      <ThemeToggle className="mt-6" />
    </div>
  );
};
