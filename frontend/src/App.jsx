import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import SkillsPeriodicTable from "./components/SkillsPeriodicTable";
import Projects from "./components/Projects";
import BuildProcess from "./components/BuildProcess";
import ProfileSections from "./components/ProfileSections";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import GlobalEffects from "./components/GlobalEffects";
import TechMarquee from "./components/TechMarquee";

function App() {
  return (
    <div className="portfolio-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <svg
        className="liquid-glass-filter"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <filter
          id="liquid-glass"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008"
            numOctaves="2"
            seed="7"
            result="liquid-noise"
          />
          <feGaussianBlur in="liquid-noise" stdDeviation="2" result="soft-noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft-noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="ambient-background" aria-hidden="true">
        <span className="ambient-blob ambient-blob-violet" />
        <span className="ambient-blob ambient-blob-cyan" />
        <span className="ambient-blob ambient-blob-pink" />
      </div>
      <GlobalEffects />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <AboutSection />
        <TechMarquee />
        <SkillsPeriodicTable />
        <Projects />
        <BuildProcess />
        <ProfileSections />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
