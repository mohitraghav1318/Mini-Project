// ── Hindi ──────────────────────────────────────────────────────────────────
export const homeDataHi = {
  hero: {
    slides: [
      {
        bg: "linear-gradient(135deg, #1e5c35 0%, #2d7a45 100%)",
        graphicBg: "rgba(255,255,255,0.15)",
        emoji: "👩‍👩‍👧‍👧",
        eyebrow: "महिला सशक्तिकरण मंच",
        heading: "मिलकर",
        accent: "बढ़ें",
        subheading: "अपने गाँव की महिलाओं के साथ जुड़ें और साथ मिलकर व्यापार बढ़ाएं।",
        cta: "अभी जुड़ें",
        textLight: true,
      },
      {
        bg: "linear-gradient(135deg, #fdf6e3 0%, #f5e2b8 100%)",
        graphicBg: "rgba(30,92,53,0.12)",
        emoji: "💼",
        eyebrow: "अपना व्यापार",
        heading: "घर से",
        accent: "कमाएं",
        subheading: "सिलाई, खेती, हस्तकला — हर क्षेत्र में आगे बढ़ें।",
        cta: "शुरू करें",
        textLight: false,
      },
      {
        bg: "linear-gradient(135deg, #f47920 0%, #e8a020 100%)",
        graphicBg: "rgba(255,255,255,0.2)",
        emoji: "🏡",
        eyebrow: "नई शुरुआत",
        heading: "अपना सफर",
        accent: "शुरू करें",
        subheading: "नजदीकी दीदियों से सीखें और एक-दूसरे की मदद करें।",
        cta: "रजिस्टर करें",
        textLight: true,
      },
    ],
  },
  chips: [
    { icon: "📖", label: "सीखें" },
    { icon: "🤝", label: "जुड़ें" },
    { icon: "💼", label: "बढ़ें" },
    { icon: "🏅", label: "कमाएं" },
  ],
  steps: [
    { icon: "🖊️", title: "रजिस्टर करें", description: "Sign Up पर क्लिक करें और पंजीकरण पूरा करें।" },
    { icon: "🔍", title: "खोजें", description: "लॉगिन करें और अपनी रुचि के अनुसार सीखें।" },
    { icon: "🤝", title: "जुड़ें", description: "दीदियों के साथ मिलकर नई skills सीखें।" },
    { icon: "🌱", title: "बढ़ें", description: "अपने ज्ञान से अपना व्यापार बढ़ाएं।" },
  ],
  testimonial: {
    quote: "इस मंच से जुड़ने के बाद मैंने अपनी सिलाई की दुकान शुरू की। आज मैं हर महीने 8,000 रुपये कमाती हूं।",
    author: "मीना देवी",
    location: "राजस्थान",
  },
  faq: [
    { question: "कैसे जुड़ें?", answer: "पहले Sign Up करें, फिर अपनी रुचि के अनुसार सीखना शुरू करें।" },
    { question: "क्या यह बिल्कुल मुफ्त है?", answer: "हाँ! इस मंच पर जुड़ना और सीखना बिल्कुल मुफ्त है।" },
    { question: "क्या मुझे स्मार्टफोन चाहिए?", answer: "एक साधारण स्मार्टफोन और इंटरनेट कनेक्शन काफी है।" },
    { question: "क्या मैं एक से ज्यादा चीज़ें सीख सकती हूं?", answer: "हाँ, आप अपनी रुचि के अनुसार कई चीज़ें सीख सकती हैं।" },
  ],
  cta: { heading: "आज ही शुरू करें! 🚀", button: "मुफ्त में जुड़ें" },
  footer: {
    logo: "ग्रामीण महिला सहायक",
    tagline: "महिलाओं द्वारा, महिलाओं के लिए — एक सशक्त समुदाय।",
    links: [
      { label: "होम", href: "/" },
      { label: "लॉगिन", href: "/login" },
      { label: "रजिस्टर", href: "/register" },
      { label: "डैशबोर्ड", href: "/dashboard" },
    ],
    support: [
      { label: "अक्सर पूछे सवाल", href: "/" },
      { label: "संपर्क करें", href: "/" },
      { label: "Privacy Policy", href: "/" },
    ],
  },
  headings: {
    howToJoin: "कैसे",
    howToJoinAccent: "शुरू करें?",
    faq: "अक्सर पूछे जाने वाले",
    faqAccent: "सवाल",
  },
};

// ── English ────────────────────────────────────────────────────────────────
export const homeDataEn = {
  hero: {
    slides: [
      {
        bg: "linear-gradient(135deg, #1e5c35 0%, #2d7a45 100%)",
        graphicBg: "rgba(255,255,255,0.15)",
        emoji: "👩‍👩‍👧‍👧",
        eyebrow: "Women Empowerment Platform",
        heading: "Grow",
        accent: "Together",
        subheading: "Join women from your village and build your business together.",
        cta: "Join Now",
        textLight: true,
      },
      {
        bg: "linear-gradient(135deg, #fdf6e3 0%, #f5e2b8 100%)",
        graphicBg: "rgba(30,92,53,0.12)",
        emoji: "💼",
        eyebrow: "Your Business",
        heading: "Earn",
        accent: "From Home",
        subheading: "Tailoring, farming, handicrafts — learn skills and move ahead.",
        cta: "Get Started",
        textLight: false,
      },
      {
        bg: "linear-gradient(135deg, #f47920 0%, #e8a020 100%)",
        graphicBg: "rgba(255,255,255,0.2)",
        emoji: "🏡",
        eyebrow: "New Beginnings",
        heading: "Start Your",
        accent: "Journey",
        subheading: "Learn from Didis near you and help each other grow.",
        cta: "Register",
        textLight: true,
      },
    ],
  },
  chips: [
    { icon: "📖", label: "Learn" },
    { icon: "🤝", label: "Connect" },
    { icon: "💼", label: "Grow" },
    { icon: "🏅", label: "Earn" },
  ],
  steps: [
    { icon: "🖊️", title: "Register", description: "Click Sign Up and complete your registration." },
    { icon: "🔍", title: "Explore", description: "Log in and discover skills that interest you." },
    { icon: "🤝", title: "Connect", description: "Learn new skills together with the Didis." },
    { icon: "🌱", title: "Grow", description: "Use your knowledge to grow your own business." },
  ],
  testimonial: {
    quote: "After joining this platform I started my own tailoring shop. Today I earn Rs. 8,000 every month.",
    author: "Meena Devi",
    location: "Rajasthan",
  },
  faq: [
    { question: "How do I get started?", answer: "First Sign Up, then start learning based on your interests." },
    { question: "Is it completely free?", answer: "Yes! Joining and learning on this platform is completely free." },
    { question: "Do I need a smartphone?", answer: "A basic smartphone and internet connection is enough." },
    { question: "Can I learn more than one skill?", answer: "Yes, you can learn as many skills as you like." },
  ],
  cta: { heading: "Start Today! 🚀", button: "Join for Free" },
  footer: {
    logo: "Rural Women Helper",
    tagline: "By women, for women — a powerful community.",
    links: [
      { label: "Home", href: "/" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    support: [
      { label: "FAQs", href: "/" },
      { label: "Contact Us", href: "/" },
      { label: "Privacy Policy", href: "/" },
    ],
  },
  headings: {
    howToJoin: "How to",
    howToJoinAccent: "Get Started?",
    faq: "Frequently Asked",
    faqAccent: "Questions",
  },
};

export function getHomeData(locale) {
  return locale === "en" ? homeDataEn : homeDataHi;
}
