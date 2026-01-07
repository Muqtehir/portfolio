import { useState } from "react";
import Intro from "./components/Intro";
import Story from "./components/Story";
import Gates from "./components/Gates";
import GateStory from "./pages/GateStory";
import GateSkills from "./pages/GateSkills";
import GateProjects from "./pages/GateProjects";
import GateStatus from "./pages/GateStatus";
import GateContact from "./pages/GateContact";
import GateLearn from "./pages/GateLearn";

function App() {
  const [stage, setStage] = useState("intro");
  const [currentGate, setCurrentGate] = useState(null);

  const handleGateClick = (gateId) => {
    setCurrentGate(gateId);
  };

  const handleBackFromGate = () => {
    setCurrentGate(null);
  };

  // Render gate pages
  if (currentGate === "story") return <GateStory onBack={handleBackFromGate} />;
  if (currentGate === "skills")
    return <GateSkills onBack={handleBackFromGate} />;
  if (currentGate === "projects")
    return <GateProjects onBack={handleBackFromGate} />;
  if (currentGate === "status")
    return <GateStatus onBack={handleBackFromGate} />;
  if (currentGate === "contact")
    return <GateContact onBack={handleBackFromGate} />;
  if (currentGate === "learn") return <GateLearn onBack={handleBackFromGate} />;

  // Main flow
  return (
    <>
      {stage === "intro" && <Intro onStart={() => setStage("story")} />}
      {stage === "story" && <Story onFinish={() => setStage("portfolio")} />}
      {stage === "portfolio" && <Gates onGateClick={handleGateClick} />}
    </>
  );
}

export default App;
