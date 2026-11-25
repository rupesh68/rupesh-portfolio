import { DailyQuoteSection } from '@/components/DailyQuoteSection';
import { WritingSection } from '@/components/WritingSection';

export default async function page() {
  return (
    <>
      <WritingSection />
      <DailyQuoteSection />
    </>
  );
}
