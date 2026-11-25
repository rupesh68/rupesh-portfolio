import { BlurAccordion } from '@/components/BlurAccordion';
import { CompaniesWorkedWith } from '@/components/CompaniesWorkedWith';
import { DailyQuoteSection } from '@/components/DailyQuoteSection';
import { DottedUnderline } from '@/components/DottedUnderline';
import { FocusAreas } from '@/components/FocusAreas';
import { GitHubActivity } from '@/components/GitHubActivity';
import { HeroSection } from '@/components/HeroSection';
import { ProjectIndex } from '@/components/ProjectSection';
import { WritingList } from '@/components/WritingList';
import { getGitHubStats } from '@/lib/github';
import { TechSkills } from '@/components/TechSkills';
export default async function Home() {
  const github = await getGitHubStats();
  return (
    <>
      <HeroSection />
      <DottedUnderline />

      <DailyQuoteSection />
      <DottedUnderline />

      <TechSkills />

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
    </>
  );
}
