import logo from "../assets/logo.svg";
import menuIcon from "../assets/icons/menu.svg";
import closeIcon from "../assets/icons/close.svg";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";

// ─── Nav links for Crates (replacing RCM's NAV_LINKS) ───

interface NavLink {
  name: string;
  url: string;
  id: string;
  internal?: boolean;
  disabled?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { name: "Crates", url: "/", id: "crates", internal: true },
  { name: "Cards", url: "https://xmaquina-nft.netlify.app", id: "cards" },
  { name: "Docs", url: "https://xmaquina.gitbook.io/xmaquina", id: "docs" },
];

// ─── MenuLink (copied from RCM src/components/shared/MenuLink.tsx) ───

function MenuLink({
  link,
  menuEffect = false,
  className,
  onClick,
}: {
  link: NavLink;
  menuEffect?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const isActive = window.location.pathname === link.url;
  const target = link.internal ? "_self" : "_blank";
  const rel = link.internal ? undefined : "noopener noreferrer";

  if (menuEffect) {
    return (
      <a
        href={link.url}
        target={target}
        rel={rel}
        className={clsx(
          "overflow-hidden flex flex-col relative group",
          isActive && "pointer-events-none"
        )}
        onClick={onClick}
      >
        <li
          aria-disabled={link.disabled}
          className={clsx(
            "font-medium leading-none menu-link-persistent transition-colors",
            isActive
              ? "text-brand menu-link-active"
              : "text-white",
            className
          )}
        >
          {link.name}
          {link.disabled && (
            <span className="text-xs ml-1 text-brand">Soon</span>
          )}
        </li>
        {!link.disabled && (
          <li
            aria-disabled={link.disabled}
            className={clsx(
              "font-medium leading-none absolute bottom-0 left-0 menu-link-duplicate-persistent transition-colors",
              isActive
                ? "text-brand menu-link-active"
                : "text-white",
              className
            )}
          >
            {link.name}
          </li>
        )}
      </a>
    );
  }
  return (
    <a
      className={clsx("w-fit", isActive && "pointer-events-none")}
      href={link.url}
      target={target}
      rel={rel}
      onClick={onClick}
    >
      <li
        aria-disabled={link.disabled}
        className={clsx(
          "font-medium leading-none flex items-start transition-colors",
          isActive ? "text-brand" : "text-white",
          className
        )}
      >
        {link.name}
        {link.disabled && (
          <span className="text-xs ml-1 -translate-y-1 text-brand">soon</span>
        )}
      </li>
    </a>
  );
}

// ─── Hamburger (copied from RCM) ───

const Hamburger = ({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
}) => {
  return (
    <button
      onClick={toggleOpen}
      className="p-2 focus:outline-none"
      aria-label="Toggle menu"
    >
      <img src={isOpen ? closeIcon : menuIcon} alt="menu icon" />
    </button>
  );
};

// ─── TopBar (copied from RCM src/components/layout/top-bar.tsx) ───

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > window.innerHeight * 0.15);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen) {
      setIsVisible(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 500);
    }
  };

  return (
    <nav
      className={clsx(
        "flex items-center justify-between w-full transition-all duration-300",
        scrolled ? "py-3" : "py-8",
        "bg-dark-background",
        "max-w-[90rem]"
      )}
    >
      <div>
        <a href="/">
          <img
            src={logo}
            alt="logo-header"
            className="w-auto h-[17.3px] transition-all duration-300"
          />
        </a>
      </div>
      {/* Desktop Navigation */}
      <ul className="hidden lg:flex gap-8 items-center px-8">
        {NAV_LINKS.map((link) => (
          <MenuLink
            key={`${link.id}-desktop-nav`}
            link={link}
            menuEffect={!link.disabled}
          />
        ))}
      </ul>
      <div className="hidden lg:flex gap-4 items-center">
        {/* Connect button placeholder — matches RCM right-side spacing */}
      </div>
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center">
        <Hamburger isOpen={isOpen} toggleOpen={toggleMenu} />
        <div
          className={clsx(
            "absolute top-0 right-0 flex flex-col justify-between w-full z-10 px-4 py-6 pb-12 transition-all duration-500",
            "bg-dark-background",
            isOpen ? "translate-y-32 opacity-100" : "translate-y-0 opacity-0",
            isVisible ? "visible" : "invisible",
            "h-screen"
          )}
        >
          <ul className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <MenuLink
                key={`${link.id}-mobile-nav`}
                link={link}
                className="text-4xl"
                onClick={toggleMenu}
              />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
