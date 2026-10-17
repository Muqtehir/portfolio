import "../styles/intro.css";

function Intro({ onStart }) {
  return (
    <div className="intro">
      <h1 className="intro-title">A journey is about to begin</h1>

      <button className="intro-btn" onClick={onStart}>
        ENTER
      </button>
    </div>
  );
}

export default Intro;
