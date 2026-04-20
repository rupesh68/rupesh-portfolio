import Section from '../common/section';
import data from '../../data/portfolio-data.json';

export default function EducationSection() {
  const { education } = data;
  return (
    <Section title="Education">
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="w-full border border-gray-200 p-6 rounded-xl">
            <div className="flex flex-col md:flex-row items-start gap-3 md:items-center justify-between w-full text-gray-500">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <img
                    src={edu.image}
                    alt={edu.institution}
                    width={25}
                    height={25}
                    className="size-5.5"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-800">
                    {edu.title}
                  </h3>
                  <div>{edu.institution}</div>
                </div>
              </div>
              <div>
                {edu.start} - {edu.end}
              </div>
            </div>
            <p className="mt-6 text-gray-500">{edu.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
