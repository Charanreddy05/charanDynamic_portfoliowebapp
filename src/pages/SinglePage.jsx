import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Home         from "./Home";
import About        from "./About";
import Skills       from "./Skills";
import Projects     from "./Projects";
import Experience   from "./Experience";
import Education    from "./Education";
import Certificates from "./Certificates";
import Recognition  from "./Recognition";
import Contact      from "./Contact";

const SECTIONS = [
  "home","about","skills","projects",
  "experience","education","certificates","recognition","contact",
];

function SinglePage() {
  const { hash }   = useLocation();
  const navigate   = useNavigate();
  const initialScrollDone = useRef(false);

  // Scroll to hash target on initial load only (not on every hash change)
  useEffect(() => {
    if (hash && !initialScrollDone.current) {
      initialScrollDone.current = true;
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  // Update URL hash as user scrolls past each section (debounced)
  useEffect(() => {
    let timeout;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              navigate(`#${entry.target.id}`, { replace: true });
            }, 150);
          }
        });
      },
      { rootMargin: "-30% 0px -65% 0px", threshold: 0 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => {
      obs.disconnect();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="w-full">
      <section id="home">         <Home />         </section>
      <section id="about">        <About />        </section>
      <section id="skills">       <Skills />       </section>
      <section id="projects">     <Projects />     </section>
      <section id="experience">   <Experience />   </section>
      <section id="education">    <Education />    </section>
      <section id="certificates"> <Certificates /> </section>
      <section id="recognition">  <Recognition />  </section>
      <section id="contact">      <Contact />      </section>
    </div>
  );
}

export default SinglePage;
