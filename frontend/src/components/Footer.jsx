import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { portfolio } from "../data/portfolio";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">M.</span>
          <span>{portfolio.name}</span>
        </a>
        <p>Built with care, one iteration at a time.</p>
        <div className="footer-links">
          <a href={portfolio.emailLink} aria-label="Email">
            <MdEmail aria-hidden="true" />
          </a>
          <a href={portfolio.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <FaGithub aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
