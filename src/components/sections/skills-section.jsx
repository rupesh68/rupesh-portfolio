import Section from '../common/section';
import data from '../../data/portfolio-data.json';

export default function SkillsSection() {
  const { skills } = data;

  return (
    <Section title="Skills">
      <div className="flex flex-wrap gap-4">
        {skills.map((skill, index) => (
          <p
            key={index}
            className="border cursor-default border-gray-300 hover:bg-gray-100/70 text-gray-600 text-[13px] rounded-full px-5 py-1.5"
          >
            {skill}
          </p>
        ))}
      </div>
    </Section>
  );
}
