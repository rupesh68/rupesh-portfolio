import Section from '../common/section';
import data from '../../data/portfolio-data.json';

export default function ContactSection() {
  const { personalInfo } = data;
  return (
    <Section title="Contact">
      <table className="table-auto mr-auto">
        <tbody>
          <tr>
            <td className="pr-4 py-2">Email:</td>
            <td className="py-2 text-gray-500">
              <a href={`mailto:${personalInfo.email}`} className="hover:text-indigo-600 transition">
                {personalInfo.email}
              </a>
            </td>
          </tr>
          <tr>
            <td className="pr-4 py-2">Phone:</td>
            <td className="py-2 text-gray-500">
              <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`} className="hover:text-indigo-600 transition">
                {personalInfo.phone}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}
