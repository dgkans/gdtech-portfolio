import { useState } from "react";
import "./App.css";
import { LoadingScreen } from "./components/LoadingScreen";
import { Navbar } from "./components/Navbar";
import { MobileMenu } from "./components/MobileMenu";
import { BackgroundFX } from "./components/BackgroundFX";
import { StatusLine } from "./components/StatusLine";
import { HireMePill } from "./components/HireMePill";
import { ChatBot } from "./components/ChatBot";
import { ImpactStrip } from "./components/ImpactStrip";
import { Home } from "./components/sections/Home";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { GitHubActivity } from "./components/sections/GitHubActivity";
import { Contact } from "./components/sections/Contact";
import "./index.css";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <BackgroundFX />
      <div
        className={`relative z-10 min-h-screen transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Home />
        <ImpactStrip />
        <Skills />
        <Projects />
        <GitHubActivity />
        <Contact />
        <div className="md:h-7" aria-hidden="true" />
      </div>
      <HireMePill />
      <ChatBot />
      <StatusLine />
    </>
  );
}

export default App;
