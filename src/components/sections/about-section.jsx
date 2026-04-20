import Section from '../common/section';
import data from '../../data/portfolio-data.json';

export default function AboutSection() {
  const { about } = data;
  return (
    <Section title="About">
      <div className="text-sm/6.5">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className={index > 0 ? 'mt-5' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
