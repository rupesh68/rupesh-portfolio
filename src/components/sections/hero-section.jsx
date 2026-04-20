import { ArrowRightIcon } from 'lucide-react';
import data from '../../data/portfolio-data.json';


export default function HeroSection() {
  const { personalInfo } = data;
  return (
    <main className="flex flex-col items-center pt-32 max-md:px-4">
      <svg
        className="absolute -z-10 -mt-20 right-0"
        width="890"
        height="764"
        viewBox="0 0 890 764"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="#e2e8f0"
          d="M.5.5h63.825v63.825H.5zm0 380.85h63.825v63.825H.5zM444.824.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM.5 190.924h63.825v63.825H.5zm0 380.849h63.825v63.825H.5zm444.324-380.849h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M.5 63.975h63.825V127.8H.5zm0 380.849h63.825v63.825H.5zM444.824 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM.5 254.4h63.825v63.825H.5zm0 380.85h63.825v63.825H.5zM444.824 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M.5 127.449h63.825v63.825H.5zm0 380.85h63.825v63.825H.5zm444.324-380.85h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM.5 317.875h63.825V381.7H.5zm0 380.85h63.825v63.825H.5zm444.324-380.85h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zM190.924.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM635.248.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM190.924 190.924h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825zm444.324-380.849h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M190.924 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM635.248 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM190.924 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM635.248 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M190.924 127.449h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zm444.324-380.85h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM190.924 317.875h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zm444.324-380.85h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zM127.449.5h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M127.449 381.35h63.825v63.825h-63.825zM571.775.5H635.6v63.825h-63.825zm0 380.85H635.6v63.825h-63.825zM127.449 190.924h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825zm444.326-380.849H635.6v63.825h-63.825zm0 380.849H635.6v63.825h-63.825zM127.449 63.975h63.825V127.8h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M127.449 444.824h63.825v63.825h-63.825zM571.775 63.975H635.6V127.8h-63.825zm0 380.849H635.6v63.825h-63.825zM127.449 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM571.775 254.4H635.6v63.825h-63.825zm0 380.85H635.6v63.825h-63.825zM127.449 127.449h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M127.449 508.299h63.825v63.825h-63.825zm444.326-380.85H635.6v63.825h-63.825zm0 380.85H635.6v63.825h-63.825zM127.449 317.875h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zm444.326-380.85H635.6V381.7h-63.825zm0 380.85H635.6v63.825h-63.825zM317.873.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM762.197.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM317.873 190.924h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825zm444.324-380.849h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M317.873 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM762.197 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM317.873 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM762.197 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M317.873 127.449h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zm444.324-380.85h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM317.873 317.875h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zm444.324-380.85h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zM63.973.5h63.825v63.825H63.973zm0 380.85h63.825v63.825H63.973zM508.297.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM63.973 190.924h63.825v63.825H63.973zm0 380.849h63.825v63.825H63.973zm444.324-380.849h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M63.973 63.975h63.825V127.8H63.973zm0 380.849h63.825v63.825H63.973zM508.297 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM63.973 254.4h63.825v63.825H63.973zm0 380.85h63.825v63.825H63.973zM508.297 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M63.973 127.449h63.825v63.825H63.973zm0 380.85h63.825v63.825H63.973zm444.324-380.85h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM63.973 317.875h63.825V381.7H63.973zm0 380.85h63.825v63.825H63.973zm444.324-380.85h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zM254.4.5h63.825v63.825H254.4zm0 380.85h63.825v63.825H254.4zM698.725.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM254.4 190.924h63.825v63.825H254.4zm0 380.849h63.825v63.825H254.4zm444.325-380.849h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M254.4 63.975h63.825V127.8H254.4zm0 380.849h63.825v63.825H254.4zM698.725 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM254.4 254.4h63.825v63.825H254.4zm0 380.85h63.825v63.825H254.4zM698.725 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M254.4 127.449h63.825v63.825H254.4zm0 380.85h63.825v63.825H254.4zm444.325-380.85h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM254.4 317.875h63.825V381.7H254.4zm0 380.85h63.825v63.825H254.4zm444.325-380.85h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zM190.924.5h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M190.924 381.35h63.825v63.825h-63.825zM635.248.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM190.924 190.924h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825zm444.324-380.849h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825zM190.924 63.975h63.825V127.8h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M190.924 444.824h63.825v63.825h-63.825zM635.248 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM190.924 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM635.248 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM190.924 127.449h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M190.924 508.299h63.825v63.825h-63.825zm444.324-380.85h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM190.924 317.875h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zm444.324-380.85h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zM381.352.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM825.674.5h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM381.352 190.924h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825zm444.322-380.849h63.825v63.825h-63.825zm0 380.849h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M381.352 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM825.674 63.975h63.825V127.8h-63.825zm0 380.849h63.825v63.825h-63.825zM381.352 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM825.674 254.4h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825z"
        />
        <path
          stroke="#e2e8f0"
          d="M381.352 127.449h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zm444.322-380.85h63.825v63.825h-63.825zm0 380.85h63.825v63.825h-63.825zM381.352 317.875h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825zm444.322-380.85h63.825V381.7h-63.825zm0 380.85h63.825v63.825h-63.825z"
        />
        <path fill="url(#a)" d="M0 0h889.999v763.049H0z" />
        <defs>
          <radialGradient
            id="a"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0 381.525 -445 0 445 381.525)"
          >
            <stop offset=".293" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" />
          </radialGradient>
        </defs>
      </svg>

      <img
        src={personalInfo.profileImage}
        alt="Profile Image"
        className="size-36 rounded-full"
        width={144}
        height={144}
      />

      <h2 className="text-4xl md:text-6xl font-semibold mt-6 text-center">
        {personalInfo.name}
      </h2>
      <p className="text-2xl md:text-3xl font-mono mt-6">{personalInfo.title}</p>
      <div className="mt-6">
        <a
          href={personalInfo.resumeLink}
          target="_blank"
        >
          <button className="group bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-2.5 rounded-lg">
            Resume
            <ArrowRightIcon className="group-hover:translate-x-0.5 transition ml-1 size-5 inline-flex" />
          </button>
        </a>
        <a href={`mailto:${personalInfo.email}`}>
          <button className="border border-gray-400 hover:bg-gray-100/70 px-6 py-2.5 rounded-lg ml-4">
            Connect me
          </button>
        </a>
      </div>
      <div className="space-x-6 mt-10">
        <a
          href={personalInfo.socialLinks.linkedin}
          target="_blank"
          className="inline-flex hover:-translate-y-0.5 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={30}
            width={30}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-linkedin-icon lucide-linkedin"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href={personalInfo.socialLinks.github}
          target="_blank"
          className="inline-flex hover:-translate-y-0.5 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={30}
            width={30}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github-icon lucide-github"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>
        <a
          href={personalInfo.socialLinks.instagram}
          target="_blank"
          className="inline-flex hover:-translate-y-0.5 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={30}
            width={30}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-instagram-icon lucide-instagram"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </a>
      </div>
    </main>
  );
}
