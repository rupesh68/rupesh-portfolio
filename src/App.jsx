import HeroSection from './components/sections/hero-section';
import AboutSection from './components/sections/about-section';
import ProjectsSection from './components/sections/projects-section';
import ExperienceSection from './components/sections/experience-section';
import SkillsSection from './components/sections/skills-section';
import ContactSection from './components/sections/contact-section';
import Footer from './components/common/footer';
import EducationSection from './components/sections/education-section';
import { useVisitorTracking } from './hooks/useVisitorTracking';


export default function App() {
    useVisitorTracking();
  return (
    <main className="max-md:px-4">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
