/**
 * Portfolio context — structured data exported for AI providers.
 *
 * This is used as the system prompt / RAG context so the AI chatbot
 * knows about Naveed's skills, experience, and projects without scraping the DOM.
 *
 * Update this file whenever you update the portfolio content.
 */

export const portfolioContext = {
  name: 'Naveed Ahmed',
  role: 'Full Stack Engineer',
  experience: '7+ years',
  location: 'Abbottabad, Pakistan (open to remote)',
  email: 'NaveedAhmedbeetech@gmail.com',
  linkedin: 'https://www.linkedin.com/in/naveed-ahmed-xref/',

  skills: {
    frontend: ['Angular 16', 'RxJS', 'NgRx', 'Vue.js', 'React.js', 'TypeScript', 'SCSS'],
    backend:  ['Node.js', 'NestJS', 'Python', 'Django', 'REST APIs', 'WebSocket', 'Microservices'],
    cloud:    ['AWS KMS', 'EC2', 'CloudWatch', 'Lambda', 'S3', 'Docker', 'Datadog', 'DevCycle'],
    databases:['PostgreSQL', 'MongoDB', 'MySQL', 'Sequelize'],
  },

  career: [
    {
      company: 'Xref',
      role: 'Full Stack Engineer',
      period: 'Jan 2023 – Present',
      location: 'Remote · Sydney, Australia',
      highlights: [
        'Led AngularJS → Angular 16 migration with 40% performance improvement',
        'Implemented Winston logging reducing issue resolution time by 50%',
        'Designed secure AWS KMS API workflows for encryption compliance',
        'Implemented DevCycle feature flags for controlled A/B rollouts',
      ],
    },
    {
      company: 'Horizon Tele Tech',
      role: 'Full Stack Engineer & Team Lead',
      period: 'Aug 2021 – Dec 2022',
      location: 'Rawalpindi, Pakistan',
      highlights: [
        'Led Yii2 → Angular 9 + NestJS migration, boosting engagement by 35%',
        'Architected real-time financial management dashboard with WebSocket',
        'Implemented AWS Lambda serverless functions',
      ],
    },
    {
      company: 'Financials Unlimited',
      role: 'Frontend / Full Stack Developer',
      period: 'Oct 2020 – Nov 2021',
      location: 'Abbottabad, Pakistan',
      highlights: [
        'Integrated REST APIs into Vue.js components with 15% engagement increase',
        'Adopted mobile-first design and full-stack development',
      ],
    },
    {
      company: 'Beetechnica',
      role: 'Angular Developer',
      period: 'Jul 2018 – Jun 2020',
      location: 'Abbottabad, Pakistan',
      highlights: [
        'Migrated multipage app to SPA boosting engagement by 40%',
        'Delivered Talk2Doctors project end-to-end',
      ],
    },
  ],

  education: 'BS Computer Science — COMSATS University, Abbottabad',
};

/**
 * Build the system prompt string from portfolio data.
 * AI providers pass this as the system message.
 */
export function buildSystemPrompt() {
  const p = portfolioContext;
  return `You are a friendly AI assistant on ${p.name}'s portfolio website.
You know everything about ${p.name}'s professional background.

ROLE: ${p.role} with ${p.experience} of experience
LOCATION: ${p.location}
EDUCATION: ${p.education}

SKILLS:
- Frontend: ${p.skills.frontend.join(', ')}
- Backend: ${p.skills.backend.join(', ')}
- Cloud & DevOps: ${p.skills.cloud.join(', ')}
- Databases: ${p.skills.databases.join(', ')}

CAREER:
${p.career.map(c => `• ${c.role} at ${c.company} (${c.period}) — ${c.highlights.join('; ')}`).join('\n')}

CONTACT: ${p.email} | ${p.linkedin}

Answer questions about ${p.name}'s experience, skills, and projects.
Be helpful, concise, and professional. If asked about something outside ${p.name}'s background, politely redirect.`;
}
