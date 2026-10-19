import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const particleColors = ["#ff6b35", "#00e5ff", "#ff3fb2", "#ffd166"];
const particles = Array.from({ length: 10 }, (_, index) => ({
  left: `${10 + ((index * 37) % 80)}%`,
  top: `${5 + ((index * 53) % 90)}%`,
  size: 6 + ((index * 17) % 28),
  color: particleColors[index % particleColors.length],
  delay: ((index * 7) % 30) / 10,
  duration: 5 + ((index * 11) % 40) / 10,
}));

const imageVariants = {
  dream: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  doubt: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: [0, -5, 5, 0] },
  },
  progress: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1.05 },
  },
  confidence: {
    initial: { opacity: 0 },
    animate: { opacity: 1, scale: 1 },
  },
};

function Story({ onFinish }) {
  const storySlides = [
    {
      text: "Once upon a time, Muqtehir Mayaleeke dreamt of becoming a software developer.",
      image: "/images/1%20future.png",
      color: "#ff6b35",
      variant: "dream",
    },
    {
      text: "He didn't know where to start, only that he had to begin.",
      image: "/images/2%20confused.png",
      color: "#00e5ff",
      variant: "doubt",
    },
    {
      text: "With his first step, he realized the path had always been there.",
      image: "/images/3%20an%20idea.png",
      color: "#ff3fb2",
      variant: "progress",
    },
    {
      text: "How far has he gone?",
      image: "/images/4%20found%20path.png",
      color: "#ffd166",
      variant: "confidence",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < storySlides.length - 1) {
      const timer = setTimeout(() => {
        setIndex((i) => i + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [index, storySlides.length]);

  const handleContainerClick = () => {
    if (index < storySlides.length - 1) setIndex((i) => i + 1);
  };

  return (
    <div
      style={{
        ...styles.container,
        borderColor: storySlides[index].color,
      }}
      onClick={handleContainerClick}
    >
      <motion.button
        className="skip-btn"
        onClick={onFinish}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.24 }}
        aria-label="Skip story"
      >
        Skip →
      </motion.button>
      <style>{`
        @keyframes bgSpin {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes neonPulse {
          0% { box-shadow: 0 6px 30px rgba(0,0,0,0.6) }
          50% { box-shadow: 0 18px 80px rgba(0,0,0,0.7) }
          100% { box-shadow: 0 6px 30px rgba(0,0,0,0.6) }
        }
      `}</style>

      <div style={styles.bgOverlay} />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5 }}
          style={styles.content}
        >
          <div
            style={{ ...styles.card, borderColor: storySlides[index].color }}
          >
            <motion.img
              src={storySlides[index].image}
              alt=""
              variants={imageVariants[storySlides[index].variant]}
              initial="initial"
              animate="animate"
              transition={{ duration: 1 }}
              style={{
                ...styles.image,
                borderColor: storySlides[index].color,
                boxShadow: `0 12px 40px ${storySlides[index].color}20, inset 0 -6px 18px ${storySlides[index].color}10`,
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              style={{ ...styles.text, color: storySlides[index].color }}
            >
              {storySlides[index].text}
            </motion.p>

            {index === storySlides.length - 1 && (
              <button
                onClick={onFinish}
                style={{
                  ...styles.enterButton,
                  borderColor: storySlides[index].color,
                  color: "#0b0b0b",
                  background: `linear-gradient(90deg, ${storySlides[index].color} 0%, ${storySlides[index].color}cc 100%)`,
                }}
              >
                EXPLORE HIS PORTFOLIO
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {particles.map((p, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            filter: "blur(8px)",
            opacity: 0.85,
            zIndex: 1,
            pointerEvents: "none",
          }}
          animate={{ y: [0, -10 - (i % 6), 0], opacity: [0.8, 1, 0.8] }}
          transition={{
            delay: p.delay,
            repeat: Infinity,
            duration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 10% 20%, rgba(255,107,53,0.06), transparent), radial-gradient(1000px 500px at 90% 80%, rgba(0,229,255,0.06), transparent), #07070a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: "6px solid",
    position: "relative",
    overflow: "hidden",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(255,107,53,0.02), rgba(0,229,255,0.02), rgba(255,63,178,0.02), rgba(255,209,102,0.02))",
    backgroundSize: "400% 400%",
    animation: "bgSpin 10s ease infinite",
    mixBlendMode: "screen",
    zIndex: 0,
    pointerEvents: "none",
  },
  content: {
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "36px 20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    alignItems: "center",
    textAlign: "center",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(10,10,12,0.28))",
    padding: "28px",
    borderRadius: "16px",
    border: "2px solid rgba(255,255,255,0.04)",
    boxShadow: "0 18px 60px rgba(2,6,23,0.7)",
    maxWidth: 720,
  },
  image: {
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "18px",
    border: "4px solid",
  },
  text: {
    maxWidth: "640px",
    fontSize: "18px",
    lineHeight: "1.6",
    fontWeight: 700,
  },
  enterButton: {
    padding: "14px 34px",
    background: "transparent",
    border: "3px solid",
    cursor: "pointer",
    fontSize: "15px",
    borderRadius: 12,
    fontWeight: 900,
    marginTop: 6,
  },
};

export default Story;
