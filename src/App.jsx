import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { DottedUnderline } from './components/comman/DottedUnderline';
import { DailyQuoteSection } from './components/DailyQuoteSection';
import { TechSkills } from './components/TechSkills';
import { ProjectIndex } from './components/ProjectSection';
import { GitHubActivity } from './components/GitHubActivity';
import { getGitHubStats } from './lib/github';
import { CompaniesWorkedWith } from './components/CompaniesWorkedWith';
import { BlurAccordion } from './components/BlurAccordion';
import { FocusAreas } from './components/FocusAreas';
import { WritingList } from './components/WritingList';
import { WritingSection } from './components/WritingSection';

const DEFAULT_GITHUB = {
  username: import.meta.env.VITE_GITHUB_USERNAME || 'rupesh68',
  publicRepos: 0,
  totalStars: 0,
  dailyCounts: [],
  endDate: undefined,
};

function HomePage() {
  const [github, setGithub] = useState(DEFAULT_GITHUB);

  useEffect(() => {
    let active = true;
    getGitHubStats()
      .then((data) => {
        if (active) setGithub(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <HeroSection />
      <DottedUnderline />
      <DailyQuoteSection />
      <DottedUnderline />
      <TechSkills />
      <DottedUnderline />
      <ProjectIndex />
      <DottedUnderline />
      <GitHubActivity
        username={github.username}
        repos={github.publicRepos}
        stars={github.totalStars}
        data={github.dailyCounts}
        endDate={github.endDate}
      />

      <DottedUnderline />
      <CompaniesWorkedWith />
      <DottedUnderline />
      <BlurAccordion />
      <DottedUnderline />
      <FocusAreas />
      <DottedUnderline />
      <WritingList />
      <DottedUnderline />
    </>
  );
}

function WritingPage() {
  return (
    <>
      <WritingSection />
      <DottedUnderline />
      <DailyQuoteSection />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/writing" element={<WritingPage />} />
    </Routes>
  );
}
