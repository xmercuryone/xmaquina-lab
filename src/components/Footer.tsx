import logo from "../assets/logo.svg";
import ArrowCircle from "./ArrowCircle";
import clsx from "clsx";

// ─── Footer links (copied from RCM utils/constants.ts) ───

interface FooterLink {
  name: string;
  url: string;
  id: string;
}

const LINKS: FooterLink[] = [
  {
    name: "Docs",
    url: "https://xmaquina.gitbook.io/xmaquina",
    id: "docs",
  },
  {
    name: "T&C",
    url: "https://www.xmaquina.io/legal-pages/terms-conditions",
    id: "auction-tc",
  },
  {
    name: "Support",
    url: "https://discord.gg/xmaquina",
    id: "discord",
  },
];

// ─── MenuLink for footer (copied from RCM, simplified) ───

function FooterMenuLink({ link }: { link: FooterLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="overflow-hidden flex flex-col relative group"
    >
      <li className="font-medium leading-none menu-link-persistent text-white transition-colors">
        {link.name}
      </li>
      <li className="font-medium leading-none absolute bottom-0 left-0 menu-link-duplicate-persistent text-white transition-colors">
        {link.name}
      </li>
    </a>
  );
}

// ─── Footer (copied from RCM src/components/layout/footer.tsx) ───

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className={clsx(
        "flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between",
        "py-8 w-full lg:min-h-[120px] lg:gap-16 gap-8",
        "max-w-[90rem]"
      )}
    >
      <div className="flex gap-8 justify-center items-center w-full lg:w-auto">
        <a href="/">
          <img src={logo} alt="logo-footer" className="w-auto h-4" />
        </a>
        <p className="text-[14px] leading-[1.5] tracking-[0] font-light text-body">
          &copy; {new Date().getFullYear()} XMAQUINA Foundation. | All rights reserved
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:justify-between flex-1 gap-8">
        <div className="flex flex-1">
          <ul className="flex gap-8 items-center">
            {LINKS.map((link) => (
              <FooterMenuLink key={`${link.id}-footer-nav`} link={link} />
            ))}
          </ul>
        </div>
        <div className="w-full lg:w-auto flex items-center justify-center lg:justify-between min-w-[169px]">
          <button
            onClick={scrollToTop}
            className="group font-normal flex items-center gap-8 cursor-pointer"
          >
            Back to top
            <ArrowCircle />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
