export const homeData = {
  // ── Hero Carousel ──────────────────────────────────────────────────
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
        cta: "समूह से जुड़ें",
        textLight: true,
      },
      {
        bg: "linear-gradient(135deg, #fdf6e3 0%, #f5e2b8 100%)",
        graphicBg: "rgba(30,92,53,0.12)",
        emoji: "💼",
        eyebrow: "अपना व्यापार",
        heading: "घर से",
        accent: "कमाएं",
        subheading: "सिलाई, खेती, हस्तकला — हर क्षेत्र में समूह बनाएं और आगे बढ़ें।",
        cta: "अभी शुरू करें",
        textLight: false,
      },
      {
        bg: "linear-gradient(135deg, #f47920 0%, #e8a020 100%)",
        graphicBg: "rgba(255,255,255,0.2)",
        emoji: "🏡",
        eyebrow: "आपके गाँव का समूह",
        heading: "अपना समूह",
        accent: "खोजें",
        subheading: "नजदीकी दीदियों से जुड़ें, सीखें और एक-दूसरे की मदद करें।",
        cta: "समूह खोजें",
        textLight: true,
      },
    ],
  },

  // ── Feature Chips ──────────────────────────────────────────────────
  chips: [
    { icon: "📖", label: "सीखें" },
    { icon: "🤝", label: "जुड़ें" },
    { icon: "💼", label: "बढ़ें" },
    { icon: "🏅", label: "कमाएं" },
  ],

  // ── Stats Bar ──────────────────────────────────────────────────────
  stats: [
    { icon: "👩‍👩‍👧", number: "16,185", label: "महिलाएं जुड़ीं", color: "#24446b" },
    { icon: "🏘️",     number: "70",     label: "समूह उपलब्ध",   color: "#f47920" },
    { icon: "✅",      number: "14,456", label: "सक्रिय सदस्य",  color: "#1e5c35" },
    { icon: "🌱",      number: "1,735",  label: "व्यापार बढ़े",   color: "#7b3da3" },
  ],

  // ── Popular Communities ────────────────────────────────────────────
  popularCommunities: [
    {
      thumbnail: "linear-gradient(135deg, #f47920 60%, #e8a020 100%)",
      category: "सिलाई · लोकप्रिय",
      title: "सिलाई दीदी समूह",
      href: "/community",
    },
    {
      thumbnail: "linear-gradient(135deg, #1e5c35 60%, #2d7a45 100%)",
      category: "खेती · लोकप्रिय",
      title: "महिला किसान समूह",
      href: "/community",
    },
    {
      thumbnail: "linear-gradient(135deg, #24446b 60%, #3a6090 100%)",
      category: "डिजिटल · लोकप्रिय",
      title: "डिजिटल दीदी क्लब",
      href: "/community",
    },
    {
      thumbnail: "linear-gradient(135deg, #a13d3d 60%, #c75050 100%)",
      category: "हस्तकला · लोकप्रिय",
      title: "हस्तकला उद्यमी समूह",
      href: "/community",
    },
  ],

  // ── Newly Added Communities ────────────────────────────────────────
  newCommunities: [
    {
      thumbnail: "linear-gradient(135deg, #5c7a52 60%, #7aa065 100%)",
      category: "खाना · नया",
      title: "होम फूड बिजनेस दीदी",
      href: "/community",
    },
    {
      thumbnail: "linear-gradient(135deg, #e2a33d 60%, #f0c060 100%)",
      category: "डेयरी · नया",
      title: "डेयरी महिला समूह",
      href: "/community",
    },
    {
      thumbnail: "linear-gradient(135deg, #7b3da3 60%, #9d55c8 100%)",
      category: "वित्त · नया",
      title: "बचत और ऋण समूह",
      href: "/community",
    },
    {
      thumbnail: "linear-gradient(135deg, #16283f 60%, #24446b 100%)",
      category: "प्रशिक्षण · नया",
      title: "व्यापार प्रबंधन समूह",
      href: "/community",
    },
  ],

  // ── How To Join Steps ──────────────────────────────────────────────
  steps: [
    {
      icon: "🖊️",
      title: "रजिस्टर करें",
      description: "\"Sign Up\" पर क्लिक करें और पंजीकरण पूरा करें।",
    },
    {
      icon: "🔍",
      title: "लॉगिन करें",
      description: "लॉगिन करें और अपना पसंदीदा समूह खोजें।",
    },
    {
      icon: "🤝",
      title: "जुड़ें और शुरू करें",
      description: "\"Join Now\" पर क्लिक करें और समूह में प्रवेश करें।",
    },
    {
      icon: "🌱",
      title: "साथ मिलकर बढ़ें",
      description: "समूह की दीदियों के साथ मिलकर अपना व्यापार बढ़ाएं।",
    },
  ],

  // ── Community Clusters ─────────────────────────────────────────────
  clusters: [
    { emoji: "🧵", name: "सिलाई",     members: "2,840" },
    { emoji: "🌾", name: "खेती",      members: "3,210" },
    { emoji: "🎨", name: "हस्तकला",  members: "1,560" },
    { emoji: "📱", name: "डिजिटल",  members: "980" },
    { emoji: "🍱", name: "खाना",     members: "1,120" },
    { emoji: "🥛", name: "डेयरी",    members: "740" },
  ],

  // ── Testimonial ────────────────────────────────────────────────────
  testimonial: {
    quote:
      "इस मंच से जुड़ने के बाद मैंने अपनी सिलाई की दुकान शुरू की। समूह की दीदियों ने बहुत मदद की — आज मैं हर महीने ₹8,000 कमाती हूं।",
    author: "मीना देवी",
    location: "राजस्थान",
  },

  // ── FAQ ────────────────────────────────────────────────────────────
  faq: [
    {
      question: "समूह में कैसे जुड़ें?",
      answer:
        "पहले Sign Up करें, फिर अपना मनपसंद समूह खोजें और \"Join Now\" पर क्लिक करें। बस इतना ही!",
    },
    {
      question: "क्या यह बिल्कुल मुफ्त है?",
      answer:
        "हाँ! इस मंच पर जुड़ना, सीखना और समूह में भाग लेना बिल्कुल मुफ्त है।",
    },
    {
      question: "क्या मुझे स्मार्टफोन चाहिए?",
      answer:
        "एक साधारण स्मार्टफोन और इंटरनेट कनेक्शन काफी है। हमारी वेबसाइट मोबाइल पर अच्छी तरह काम करती है।",
    },
    {
      question: "मेरे गाँव का समूह कैसे ढूंढूं?",
      answer:
        "लॉगिन करने के बाद आप अपने राज्य और जिले के अनुसार समूह खोज सकती हैं।",
    },
    {
      question: "क्या मैं एक से ज्यादा समूह में जुड़ सकती हूं?",
      answer:
        "हाँ, आप अपनी रुचि के अनुसार एक से ज्यादा समूहों में जुड़ सकती हैं।",
    },
  ],

  // ── CTA Band ───────────────────────────────────────────────────────
  cta: {
    heading: "आज ही शुरू करें! 🚀",
    button: "मुफ्त में जुड़ें",
  },

  // ── Footer ─────────────────────────────────────────────────────────
  footer: {
    logo: "ग्रामीण महिला सहायक",
    tagline: "महिलाओं द्वारा, महिलाओं के लिए — एक सशक्त समुदाय।",
    links: [
      { label: "हमारे बारे में", href: "/" },
      { label: "समूह खोजें", href: "/community" },
      { label: "लॉगिन", href: "/login" },
      { label: "रजिस्टर", href: "/register" },
    ],
    support: [
      { label: "अक्सर पूछे सवाल", href: "/" },
      { label: "संपर्क करें", href: "/" },
      { label: "Privacy Policy", href: "/" },
    ],
  },
};