export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  language?: 'en' | 'et';
  audioBase64?: string;
}

export interface LaureenData {
  name: string;
  assistantName: string;
  portraitUrl: string;
  cvPdfUrl: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  profile: {
    en: string;
    et: string;
  };
  achievements: {
    title: string;
    category: string;
    year?: string;
    details: string;
    badge?: string;
  }[];
  education: {
    institution: string;
    program: string;
    period: string;
    highlight: string;
  }[];
  skills: string[];
  businessInvesting: {
    title: string;
    details: string;
  }[];
  references: {
    name: string;
    role: string;
    organization: string;
    email: string;
    phone: string;
  }[];
}

export const LAUREEN_PROFILE: LaureenData = {
  name: 'Laureen Simberg',
  assistantName: 'Leenu',
  portraitUrl: '/assets/aistudio/laureen_portrait.png',
  cvPdfUrl: '/assets/aistudio/Laureen_Simberg_CV_d34b8d13.pdf',
  title: 'Estonian Biathlete & EBS Impactful Entrepreneurship Student',
  location: 'Tallinn, Estonia',
  email: 'laureen.simberg@gmail.com',
  phone: '+372 56884875',
  profile: {
    en: 'Highly motivated Estonian biathlete and member of the Estonian Junior National Team with proven international competition experience and a strong passion for investing and venture building. Currently pursuing a Bachelor’s degree in Impactful Entrepreneurship at Estonian Business School (EBS).',
    et: 'Kõrgelt motiveeritud Eesti laskesuusataja ja Eesti juunioride koondise liige, kellel on rahvusvaheline võistluskogemus ning tugev fookus investeerimisel ja ettevõtlusel. Õpib Estonian Business Schoolis (EBS) mõjusa ettevõtluse (Impactful Entrepreneurship) bakalaureuseõppes.',
  },
  achievements: [
    {
      title: 'Youth Olympic Games (YOG)',
      category: 'International',
      year: '2024',
      details: 'Finished 12th place on the world stage representing Team Estonia in Gangwon.',
      badge: '12th Place YOG',
    },
    {
      title: 'Biathlon Junior World Championships',
      category: 'World Championships',
      year: '2023–2024',
      details: 'Competitor representing the Republic of Estonia against the global elite.',
      badge: 'World Competitor',
    },
    {
      title: 'European Youth Olympic Festival (EYOF)',
      category: 'Olympic Event',
      year: '2023',
      details: 'Selected as part of the official Estonian Olympic delegation.',
      badge: 'Team Estonia',
    },
    {
      title: 'IBU Biathlon Junior Cup',
      category: 'World Cup Circuit',
      year: '2023–2024',
      details: 'Regular competitor on the premier international junior biathlon circuit.',
      badge: 'IBU Junior Cup',
    },
    {
      title: 'Baltic Championships Winner',
      category: 'Regional Champion',
      year: 'Multi-year',
      details: '3× Baltic Championships winner and overall champion.',
      badge: '3× Baltic Champion',
    },
    {
      title: 'Estonian National Championships',
      category: 'National',
      year: 'Multi-year',
      details: 'Multiple-time medalist across individual sprint, pursuit, and relay categories.',
      badge: 'Multi Medalist',
    },
  ],
  education: [
    {
      institution: 'Estonian Business School (EBS)',
      program: 'Bachelor in Impactful Entrepreneurship',
      period: '2024 – Present',
      highlight: 'Developing forward-thinking venture creation, strategic management, and sustainable business models alongside an elite sports career.',
    },
    {
      institution: 'Otepää Audentese Sports Gymnasium',
      program: 'High-Performance Athlete Program',
      period: '2023 – 2026',
      highlight: 'Rigorous dual-path high-performance winter sports training combined with academic excellence.',
    },
    {
      institution: 'Tallinna Lilleküla Gymnasium',
      program: 'Mathematics and Music Track',
      period: '2014 – 2023',
      highlight: 'Solid analytical foundation with specialized emphasis on quantitative reasoning and music.',
    },
  ],
  skills: [
    'Elite discipline and work ethic',
    'Time management & dual-career execution',
    'Analytical thinking & marksmanship precision',
    'Teamwork in relay & national squad settings',
    'Resilience under intense competition pressure',
    'Financial market analysis & equity valuation',
    'Venture creation & impact entrepreneurship',
  ],
  businessInvesting: [
    {
      title: 'Estonian Business School (EBS) — Impactful Entrepreneurship',
      details: 'Undergraduate student at EBS in Tallinn, mastering venture creation, financial strategy, and scalable sustainable business models.',
    },
    {
      title: 'Active Personal Stock Investor',
      details: 'Managing an active personal equity portfolio with a disciplined focus on long-term compound growth and fundamental analysis.',
    },
    {
      title: 'Investment Camp Estonia (Investeerimisfestival / Laager)',
      details: 'Participated in Estonia’s premier investment forum learning from top Baltic fund managers and founders.',
    },
    {
      title: 'Investor Toomas E-Course Graduate',
      details: 'Successfully completed the renowned financial training curriculum founded by Äripäev’s Investor Toomas.',
    },
  ],
  references: [
    {
      name: 'Anne Matt',
      role: 'Class Teacher',
      organization: 'Audentes Sports Gymnasium',
      email: 'anne.matt@audentes.ee',
      phone: '+372 5300 5650',
    },
    {
      name: 'Gähtlin Leppanen',
      role: 'Sports Psychologist',
      organization: 'Team Estonia / University of Tartu',
      email: 'gahtlin.leppanen@ut.ee',
      phone: '+372 5665 2939',
    },
  ],
};
