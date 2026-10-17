export type CategoryId =
  | "aqeedah"
  | "fiqh"
  | "seerah"
  | "tafsir"
  | "student"
  | "gifts";

export interface Category {
  id: CategoryId;
  ar: string;
  fr: string;
  en: string;
  desc: { ar: string; fr: string; en: string };
}

export const CATEGORIES: Category[] = [
  {
    id: "aqeedah",
    ar: "العقيدة",
    fr: "Aqida",
    en: "Aqeedah",
    desc: {
      ar: "كتب التوحيد والعقيدة الصحيحة بمنهج السلف",
      fr: "Tawhid et croyance authentique",
      en: "Tawhid and sound creed",
    },
  },
  {
    id: "fiqh",
    ar: "الفقه",
    fr: "Fiqh",
    en: "Fiqh",
    desc: {
      ar: "أحكام العبادات والمعاملات بأسلوب ميسر",
      fr: "Jurisprudence des actes d'adoration",
      en: "Jurisprudence made accessible",
    },
  },
  {
    id: "seerah",
    ar: "السيرة النبوية",
    fr: "Biographie prophétique",
    en: "Prophetic biography",
    desc: {
      ar: "سيرة النبي صلى الله عليه وسلم والتاريخ الإسلامي",
      fr: "La vie du Prophète et l'histoire islamique",
      en: "The Prophet's life and Islamic history",
    },
  },
  {
    id: "tafsir",
    ar: "التفسير",
    fr: "Exégèse",
    en: "Quranic exegesis",
    desc: {
      ar: "فهم كتاب الله بتفاسير موثوقة",
      fr: "Comprendre le Coran",
      en: "Understanding the Quran",
    },
  },
  {
    id: "student",
    ar: "زاد طالب العلم",
    fr: "Étudiant en science",
    en: "Student of knowledge",
    desc: {
      ar: "كتب التخرج والتزكية وطالب العلم",
      fr: "Livres de formation et de purification",
      en: "Training and self-purification books",
    },
  },
  {
    id: "gifts",
    ar: "القفازات وبوكسات الهدايا",
    fr: "Gants & coffrets",
    en: "Gloves & gift boxes",
    desc: {
      ar: "قفازات ساترة أنيقة وهدايا العلم بتغليف وردي فاخر",
      fr: "Gants pudiques et cadeaux du savoir, emballage rose",
      en: "Modest gloves and knowledge gifts, pink wrapping",
    },
  },
];

export interface Book {
  slug: string;
  title: string;
  author: string;
  publisher: string;
  reviewer?: string;
  volumes: number;
  pages: number;
  binding: { ar: string; fr: string; en: string };
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: CategoryId;
  badge?: "bestseller" | "new" | "series";
  stock: number;
  sold: number;
  hue: number;
  desc: { ar: string; fr: string; en: string };
  index: string[];
  series?: string;
  image?: string;
  images?: string[];
  pdf?: string;
}

export const BOOKS: Book[] = [
  {
    slug: "daa-wa-dawa",
    title: "الداء والدواء",
    image: "/books/dawa-qayyim.jpg",
    images: ["/books/dawa-alt1.jpg", "/books/dawa-alt2.jpg", "/books/dawa-haytham.jpg"],
    author: "ابن قيم الجوزية",
    publisher: "دار ابن الجوزي",
    reviewer: "تحقيق: لجنة مختصة",
    volumes: 1,
    pages: 400,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 1200,
    oldPrice: 1450,
    rating: 4.9,
    reviews: 2314,
    category: "student",
    badge: "bestseller",
    stock: 34,
    sold: 5210,
    hue: 152,
    desc: {
      ar: "من أنفع كتب ابن القيم في علاج أمراض القلوب والذنوب، يجيب عن سؤال العاصي الباحث عن الدواء، ويشرح أثر المعاصي وعلاجها بالدعاء والتوبة. ينصح به لكل مسلم وطالب علم.",
      fr: "Le célèbre remède d'Ibn Al-Qayyim contre les maladies du cœur : causes des péchés et guérison par l'invocation et le repentir.",
      en: "Ibn Al-Qayyim's famous cure for the diseases of the heart: causes of sins and healing through supplication and repentance.",
    },
    index: [
      "مقدمة المؤلف في الدعاء والقدر",
      "المعاصي تورث الذل وتمحق البركة",
      "الدعاء من أنفع الأدوية",
      "آثار الذنوب على القلب والرزق",
      "التوبة النصوح وشروطها",
      "عشق الصور وعلاجه",
    ],
  },
  {
    slug: "raheeq-makhtoum",
    title: "الرحيق المختوم",
    author: "صفي الرحمن المباركفوري",
    publisher: "دار الوفاء",
    volumes: 1,
    pages: 520,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 1350,
    rating: 4.9,
    reviews: 1987,
    category: "seerah",
    badge: "bestseller",
    stock: 28,
    sold: 4870,
    hue: 42,
    desc: {
      ar: "أشهر كتاب معاصر في السيرة النبوية، فاز بالجائزة الأولى في مسابقة رابطة العالم الإسلامي. عرض متسلسل موثوق من المولد إلى الوفاة بأسلوب أدبي راق.",
      fr: "La célèbre biographie primée du Prophète, du berceau à la disparition, dans un style littéraire raffiné.",
      en: "The award-winning biography of the Prophet, from birth to passing, in refined literary style.",
    },
    index: [
      "العرب قبل الإسلام",
      "المولد والنشأة",
      "البعثة والدعوة السرية",
      "الهجرة إلى المدينة",
      "الغزوات الكبرى",
      "حجة الوداع والوفاة",
    ],
  },
  {
    slug: "riyad-salihin",
    title: "رياض الصالحين",
    image: "/books/riyad1.jpg",
    author: "يحيى بن شرف النووي",
    publisher: "دار ابن كثير",
    reviewer: "تحقيق: شعيب الأرناؤوط",
    volumes: 1,
    pages: 720,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 1500,
    oldPrice: 1750,
    rating: 4.8,
    reviews: 1754,
    category: "student",
    badge: "bestseller",
    stock: 41,
    sold: 4320,
    hue: 160,
    desc: {
      ar: "زاد كل مسلم في اليوم والليلة: آيات وأحاديث في الإخلاص والصبر والشكر وحسن الخلق. كتاب لا يخلو منه بيت، بتحقيق متقن وتخريج للأحاديث.",
      fr: "Le compagnon quotidien du musulman : versets et hadiths sur la sincérité, la patience et le bon comportement.",
      en: "Every Muslim's daily companion: verses and hadiths on sincerity, patience and good manners.",
    },
    index: [
      "كتاب الإخلاص والنية",
      "كتاب الصبر والشكر",
      "كتاب آداب الطعام واللباس",
      "كتاب الأذكار والدعوات",
      "كتاب الاستغفار والتوبة",
      "كتاب الفضائل والمناقب",
    ],
  },
  {
    slug: "zad-maad",
    title: "زاد المعاد في هدي خير العباد",
    image: "/books/zad1.jpg",
    author: "ابن قيم الجوزية",
    publisher: "دار عطاءات العلم",
    volumes: 6,
    pages: 3400,
    binding: { ar: "مجلد فاخر 6 أجزاء", fr: "6 volumes reliés", en: "6-volume set" },
    price: 6800,
    rating: 4.9,
    reviews: 864,
    category: "seerah",
    badge: "series",
    stock: 12,
    sold: 980,
    hue: 28,
    desc: {
      ar: "موسوعة ابن القيم في هدي النبي صلى الله عليه وسلم في العبادات والمعاملات والطب النبوي، بطبعة محققة فاخرة في ستة مجلدات.",
      fr: "L'encyclopédie d'Ibn Al-Qayyim sur la guidée du Prophète, édition vérifiée en 6 volumes.",
      en: "Ibn Al-Qayyim's encyclopedia on the Prophet's guidance, verified edition in 6 volumes.",
    },
    index: [
      "هديه في الوضوء والصلاة",
      "هديه في الصيام والحج",
      "هديه في البيع والنكاح",
      "الطب النبوي",
      "هديه في الجهاد والمعاهدات",
      "الفروسية والسبق",
    ],
    series: "مؤلفات ابن القيم",
  },
  {
    slug: "bidaya-nihaya",
    title: "البداية والنهاية",
    image: "/books/bidaya1.jpg",
    author: "إسماعيل بن كثير",
    publisher: "دار ابن الجوزي",
    volumes: 7,
    pages: 5200,
    binding: { ar: "مجلد فاخر 7 أجزاء", fr: "7 volumes reliés", en: "7-volume set" },
    price: 7900,
    oldPrice: 8900,
    rating: 4.8,
    reviews: 693,
    category: "seerah",
    badge: "series",
    stock: 9,
    sold: 760,
    hue: 200,
    desc: {
      ar: "أعظم كتب التاريخ الإسلامي: من بدء الخلق وقصص الأنبياء إلى السيرة ثم تاريخ الأمة حتى عصر المؤلف. طبعة محققة كاملة في سبعة مجلدات.",
      fr: "La plus grande chronique islamique : de la Création aux prophètes puis à l'histoire de la nation, en 7 volumes.",
      en: "The greatest Islamic chronicle: from Creation through the prophets to the nation's history, in 7 volumes.",
    },
    index: [
      "بدء الخلق وقصص الأنبياء",
      "السيرة النبوية المفصلة",
      "الخلافة الراشدة",
      "الدولة الأموية والعباسية",
      "الفتن والملاحم",
      "أشراط الساعة",
    ],
    series: "الموسوعات التاريخية",
  },
  {
    slug: "arbain-nawawiya",
    title: "الأربعون النووية",
    author: "يحيى بن شرف النووي",
    publisher: "دار المنهاج",
    volumes: 1,
    pages: 180,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 450,
    rating: 4.9,
    reviews: 3120,
    category: "student",
    stock: 120,
    sold: 8940,
    hue: 95,
    desc: {
      ar: "أربعون حديثاً جامعة لقواعد الدين، أول ما يحفظه طالب العلم. طبعة أنيقة بتشكيل كامل وشرح مختصر للكلمات.",
      fr: "Les 40 hadiths essentiels, entièrement vocalisés, premiers textes appris par l'étudiant.",
      en: "The 40 essential hadiths, fully vocalized — every student's first memorization.",
    },
    index: [
      "الأعمال بالنيات",
      "مراتب الدين",
      "أركان الإسلام والإيمان",
      "جوامع الكلم",
      "الوصايا النبوية",
    ],
  },
  {
    slug: "tafsir-saadi",
    title: "تيسير الكريم الرحمن (تفسير السعدي)",
    author: "عبد الرحمن بن ناصر السعدي",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 1150,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 2400,
    rating: 4.9,
    reviews: 1544,
    category: "tafsir",
    badge: "bestseller",
    stock: 22,
    sold: 2870,
    hue: 175,
    desc: {
      ar: "أيسر التفاسير وأحبها للقلوب: يفسر القرآن بأسلوب واضح يركز على الهداية والعمل. طبعة محققة في مجلد واحد شامل.",
      fr: "Le commentaire le plus accessible : un style clair centré sur la guidée et la mise en pratique.",
      en: "The most accessible commentary: clear style focused on guidance and practice.",
    },
    index: [
      "مقدمة في أصول التفسير",
      "تفسير الفاتحة والبقرة",
      "تفسير آل عمران والنساء",
      "تفسير المفصل",
      "فوائد مستنبطة من الآيات",
    ],
  },
  {
    slug: "boulough-maram",
    title: "بلوغ المرام من أدلة الأحكام",
    author: "ابن حجر العسقلاني",
    publisher: "دار السلام",
    volumes: 1,
    pages: 460,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 1100,
    rating: 4.7,
    reviews: 689,
    category: "fiqh",
    stock: 30,
    sold: 1740,
    hue: 220,
    desc: {
      ar: "أحاديث الأحكام التي يعتمد عليها الفقهاء، مرتبة على أبواب الفقه مع بيان درجة كل حديث. أساس طالب الفقه.",
      fr: "Les hadiths juridiques classés par chapitres, avec le degré d'authenticité de chacun.",
      en: "Legal hadiths arranged by chapters, each with its authenticity grading.",
    },
    index: [
      "كتاب الطهارة",
      "كتاب الصلاة",
      "كتاب الزكاة والصيام",
      "كتاب البيوع والنكاح",
      "كتاب الجنايات والحدود",
    ],
  },
  {
    slug: "fiqh-sunna",
    title: "فقه السنة",
    author: "سيد سابق",
    publisher: "دار الفتح",
    volumes: 3,
    pages: 1800,
    binding: { ar: "مجلد 3 أجزاء", fr: "3 volumes reliés", en: "3-volume set" },
    price: 3200,
    oldPrice: 3600,
    rating: 4.6,
    reviews: 512,
    category: "fiqh",
    stock: 15,
    sold: 1230,
    hue: 130,
    desc: {
      ar: "عرض ميسر للفقه على المذاهب مع الأدلة، من الطهارة إلى المواريث. مناسب للمبتدئ والمتوسط بثلاثة مجلدات.",
      fr: "Présentation accessible du fiqh avec preuves, de la purification aux successions, en 3 volumes.",
      en: "Accessible fiqh with evidence, from purification to inheritance, in 3 volumes.",
    },
    index: [
      "الطهارة والصلاة",
      "الزكاة والصيام والحج",
      "النكاح والطلاق",
      "البيوع والمعاملات",
      "المواريث والوصايا",
    ],
    series: "الفقه الميسر",
  },
  {
    slug: "kitab-tawhid",
    title: "كتاب التوحيد",
    image: "/books/tawhid1.jpg",
    author: "محمد بن عبد الوهاب",
    publisher: "دار المنهاج",
    volumes: 1,
    pages: 220,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 650,
    rating: 4.8,
    reviews: 1432,
    category: "aqeedah",
    stock: 56,
    sold: 5210,
    hue: 60,
    desc: {
      ar: "الكتاب الذي جدد الدعوة إلى التوحيد: أبواب في فضل التوحيد وخطر الشرك بأدلة من الكتاب والسنة. مع شرح مختصر.",
      fr: "Le livre du renouveau du Tawhid : mérite de l'unicité et danger de l'association, avec commentaire.",
      en: "The book of Tawhid revival: merit of monotheism and danger of shirk, with brief commentary.",
    },
    index: [
      "فضل التوحيد",
      "الخوف من الشرك",
      "الدعاء والاستغاثة",
      "التوسل والشفاعة",
      "السحر والكهانة",
    ],
  },
  {
    slug: "aqida-wassitiya",
    title: "العقيدة الواسطية بشرح العثيمين",
    image: "/books/wasitiya1.png",
    author: "ابن تيمية / محمد العثيمين",
    publisher: "دار الثريا",
    volumes: 1,
    pages: 380,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 950,
    rating: 4.9,
    reviews: 978,
    category: "aqeedah",
    badge: "new",
    stock: 26,
    sold: 1120,
    hue: 265,
    desc: {
      ar: "متن ابن تيمية المختصر في عقيدة أهل السنة بشرح الشيخ العثيمين الميسر. طبعة جديدة محققة بعناية.",
      fr: "Le traité d'Ibn Taymiyya commenté par Cheikh Al-Outhaymin, nouvelle édition vérifiée.",
      en: "Ibn Taymiyyah's treatise explained by Sheikh Al-Uthaymin, new verified edition.",
    },
    index: [
      "الإيمان بالله وأسمائه",
      "الإيمان بالملائكة والكتب",
      "الإيمان بالقدر",
      "الصحابة والإمامة",
      "كرامات الأولياء",
    ],
  },
  {
    slug: "madarij-salikin",
    title: "مدارج السالكين",
    image: "/books/madarij1.jpeg",
    author: "ابن قيم الجوزية",
    publisher: "دار عطاءات العلم",
    volumes: 3,
    pages: 1900,
    binding: { ar: "مجلد 3 أجزاء", fr: "3 volumes reliés", en: "3-volume set" },
    price: 3900,
    rating: 4.9,
    reviews: 745,
    category: "student",
    stock: 11,
    sold: 890,
    hue: 300,
    desc: {
      ar: "شرح ابن القيم لمنازل السائرين إلى الله: مائة مقام من اليقظة إلى التوحيد. سفر التزكية الأعظم في ثلاثة مجلدات محققة.",
      fr: "Le chef-d'œuvre d'Ibn Al-Qayyim sur les stations vers Allah, en 3 volumes vérifiés.",
      en: "Ibn Al-Qayyim's masterpiece on the stations to Allah, in 3 verified volumes.",
    },
    index: [
      "منزلة اليقظة والمحاسبة",
      "منزلة التوبة والإنابة",
      "منزلة الصبر والشكر",
      "منزلة المحبة والشوق",
      "منزلة التوحيد والمعرفة",
    ],
    series: "مؤلفات ابن القيم",
  },
  {
    slug: "hisn-muslim",
    title: "حصن المسلم",
    author: "سعيد القحطاني",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 260,
    binding: { ar: "جيب", fr: "Format poche", en: "Pocket size" },
    price: 350,
    rating: 4.9,
    reviews: 4210,
    category: "gifts",
    badge: "bestseller",
    stock: 200,
    sold: 12400,
    hue: 190,
    desc: {
      ar: "أذكار اليوم والليلة من الكتاب والسنة بحجم الجيب. أجمل هدية وأخف زاد، بطبعة ملونة أنيقة.",
      fr: "Les invocations quotidiennes en format poche, édition couleur élégante — le cadeau idéal.",
      en: "Daily supplications in pocket size, elegant color edition — the perfect gift.",
    },
    index: [
      "أذكار الصباح والمساء",
      "أذكار النوم والاستيقاظ",
      "الدعاء في الصلاة",
      "أدعية الهم والحزن",
      "الرقية الشرعية",
    ],
  },
  {
    slug: "mokhtasar-fiqhi",
    title: "الملخص الفقهي",
    author: "صالح بن فوزان الفوزان",
    publisher: "دار العاصمة",
    volumes: 2,
    pages: 1050,
    binding: { ar: "مجلد جزءان", fr: "2 volumes reliés", en: "2-volume set" },
    price: 2100,
    rating: 4.8,
    reviews: 634,
    category: "fiqh",
    badge: "new",
    stock: 19,
    sold: 980,
    hue: 110,
    desc: {
      ar: "خلاصة الفقه على المذهب الحنبلي بأسلوب عصري مختصر، من أفضل ما يقتنيه العامي وطالب العلم. طبعة جديدة.",
      fr: "L'essentiel du fiqh dans un style moderne et concis, en 2 volumes.",
      en: "The essence of fiqh in a modern concise style, in 2 volumes.",
    },
    index: [
      "أحكام الطهارة والصلاة",
      "الجنائز والزكاة",
      "الصيام والحج",
      "المعاملات المالية",
      "الأحوال الشخصية",
    ],
    series: "الفقه الميسر",
  },
  {
    slug: "tafsir-tabari",
    title: "جامع البيان عن تأويل آي القرآن (تفسير الطبري)",
    author: "ابن جرير الطبري",
    publisher: "مؤسسة الرسالة",
    volumes: 12,
    pages: 6500,
    binding: { ar: "مجلد فاخر 12 جزءا", fr: "12 volumes reliés", en: "12-volume set" },
    price: 14500,
    oldPrice: 16000,
    rating: 4.9,
    reviews: 187,
    category: "tafsir",
    badge: "series",
    stock: 6,
    sold: 164,
    hue: 170,
    image: "/books/tabari1.jpeg",
    images: ["/books/tabari2.jpeg"],
    desc: {
      ar: "أم التفاسير وأقدمها: تفسير الطبري بالمأثور مع الأسانيد، مرجع كل مفسر بعده. طبعة محققة كاملة في اثني عشر مجلدا.",
      fr: "La mère des exégèses : le Tafsir d'Al-Tabari avec chaînes de transmission, édition complète en 12 volumes.",
      en: "The mother of exegeses: Al-Tabari's Tafsir with chains of transmission, complete in 12 volumes.",
    },
    index: [
      "مقدمة المؤلف ومنهجه",
      "تفسير الفاتحة وطوال السور",
      "أسباب النزول والقراءات",
      "الناسخ والمنسوخ",
      "تفسير المفصل وقصار السور",
    ],
    series: "الموسوعات",
  },
  {
    slug: "rawdat-uqala",
    title: "روضة العقلاء ونزهة الفضلاء",
    author: "ابن حبان البستي",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 420,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 1300,
    rating: 4.8,
    reviews: 236,
    category: "student",
    stock: 24,
    sold: 890,
    hue: 140,
    image: "/books/rawda1.jpeg",
    images: ["/books/rawda2.jpeg"],
    desc: {
      ar: "من أجمل كتب الأدب والحكمة: خمسون بابا في العقل والأدب والصمت والكرم، بأسلوب ابن حبان البديع. زاد المربي وطالب العلم.",
      fr: "Un joyau de sagesse : 50 chapitres sur l'intellect, la politesse et le silence, par Ibn Hibban.",
      en: "A gem of wisdom: 50 chapters on intellect, manners and silence by Ibn Hibban.",
    },
    index: [
      "فضل العقل ولزومه",
      "الحث على الصمت وحفظ اللسان",
      "الكرم والجود",
      "صحبة الأخيار",
      "الصبر والرضا",
    ],
  },
  {
    slug: "sifat-safwa",
    title: "صفة الصفوة",
    author: "ابن الجوزي",
    publisher: "دار مكة",
    volumes: 2,
    pages: 1100,
    binding: { ar: "مجلد جزءان", fr: "2 volumes reliés", en: "2-volume set" },
    price: 2600,
    rating: 4.9,
    reviews: 342,
    category: "seerah",
    stock: 14,
    sold: 620,
    hue: 20,
    image: "/books/safwa1.jpeg",
    images: ["/books/safwa2.jpeg", "/books/safwa3.jpeg"],
    desc: {
      ar: "تراجم الصفوة من هذه الأمة: الصحابة والتابعون والزهاد والعلماء بأسلوب ابن الجوزي المؤثر. طبعة دار مكة في مجلدين.",
      fr: "Biographies des élus de la nation : Compagnons, Successeurs et savants, par Ibn Al-Jawzi, en 2 volumes.",
      en: "Biographies of the nation's elite: Companions, Successors and scholars by Ibn Al-Jawzi, in 2 volumes.",
    },
    index: [
      "سير الصحابة الكرام",
      "التابعون وأعلامهم",
      "الزهاد والعباد",
      "الفقهاء والمحدثون",
      "النساء الصالحات",
    ],
    series: "التراجم والسير",
  },
  {
    slug: "qiyam-layl",
    title: "قيام الليل",
    author: "ابن الجوزي",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 240,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 750,
    rating: 4.7,
    reviews: 198,
    category: "student",
    stock: 30,
    sold: 540,
    hue: 190,
    image: "/books/qiyam1.jpeg",
    images: ["/books/qiyam2.jpeg"],
    desc: {
      ar: "رسالة ابن الجوزي في فضل قيام الليل وآدابه وأحوال السلف فيه، تشحذ الهمم لشرف المؤمن. طبعة أنيقة.",
      fr: "L'épître d'Ibn Al-Jawzi sur la prière nocturne : mérites, règles et exemples des pieux.",
      en: "Ibn Al-Jawzi's epistle on night prayer: merits, etiquette and the Salaf's example.",
    },
    index: [
      "فضل قيام الليل",
      "آداب القيام وكيفيته",
      "أحوال السلف في الليل",
      "الأسباب المعينة عليه",
      "الوتر والدعاء فيه",
    ],
  },
  {
    slug: "sifat-salat-nabi",
    title: "صفة صلاة النبي ﷺ من التكبير إلى التسليم",
    author: "محمد ناصر الدين الألباني",
    publisher: "دار السلام",
    volumes: 1,
    pages: 280,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 850,
    rating: 4.9,
    reviews: 1876,
    category: "fiqh",
    badge: "bestseller",
    stock: 45,
    sold: 3210,
    hue: 100,
    image: "/books/salat1.jpg",
    desc: {
      ar: "الكتاب الأشهر في صفة الصلاة الصحيحة بالأدلة: كأنك تراها من التكبير إلى التسليم. لا غنى عنه لكل مصل.",
      fr: "La description authentique de la prière, preuves à l'appui, par Al-Albani. Indispensable.",
      en: "The authentic description of prayer with evidence by Al-Albani. Essential for every worshipper.",
    },
    index: [
      "استقبال الكعبة والنية",
      "الركوع والسجود الصحيح",
      "التشهد والتسليم",
      "صلاة الجماعة والجمعة",
      "الأخطاء الشائعة في الصلاة",
    ],
  },
  {
    slug: "qasas-anbiya",
    title: "قصص الأنبياء",
    author: "ابن كثير",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 520,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 1400,
    rating: 4.8,
    reviews: 764,
    category: "seerah",
    stock: 26,
    sold: 1430,
    hue: 35,
    image: "/books/qasas1.jpg",
    desc: {
      ar: "قصص الأنبياء من آدم إلى محمد عليهم السلام برواية ابن كثير الموثوقة، بأسلوب قصصي ممتع للكبار والصغار.",
      fr: "Les récits des prophètes, d'Adam à Muhammad, racontés par Ibn Kathir. Pour petits et grands.",
      en: "Stories of the prophets from Adam to Muhammad by Ibn Kathir. For young and old.",
    },
    index: [
      "آدم ونوح عليهما السلام",
      "إبراهيم وموسى عليهما السلام",
      "داود وسليمان وعيسى",
      "قصص من بني إسرائيل",
      "خاتم الأنبياء محمد ﷺ",
    ],
    series: "التراجم والسير",
  },
  {
    slug: "irshad-iatiqad",
    title: "الإرشاد إلى صحيح الاعتقاد",
    author: "صالح بن فوزان الفوزان",
    publisher: "دار العاصمة",
    volumes: 1,
    pages: 320,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 1050,
    rating: 4.8,
    reviews: 423,
    category: "aqeedah",
    stock: 32,
    sold: 980,
    hue: 55,
    image: "/books/irshad1.jpg",
    images: ["/books/irshad2.jpg"],
    desc: {
      ar: "عرض مرتب لمسائل الاعتقاد الصحيح والرد على أهل الشرك والإلحاد بأسلوب الشيخ الفوزان الواضح. مناسب للتدريس.",
      fr: "Exposé ordonné de la croyance authentique et réfutation de l'associationnisme, par Al-Fawzan.",
      en: "An ordered exposition of sound creed and refutation of shirk by Al-Fawzan.",
    },
    index: [
      "توحيد الربوبية والألوهية",
      "الرد على الشرك وأهله",
      "الإيمان باليوم الآخر",
      "البدع وموقف السلف منها",
      "الولاء والبراء",
    ],
  },
  {
    slug: "sharh-arbaeen",
    title: "شرح الأربعين النووية",
    author: "محمد بن صالح العثيمين",
    publisher: "دار الثريا",
    volumes: 1,
    pages: 520,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 1350,
    rating: 4.9,
    reviews: 1104,
    category: "student",
    badge: "bestseller",
    stock: 24,
    sold: 1870,
    hue: 90,
    image: "/books/arbaeen-sharh1.jpg",
    desc: {
      ar: "أمتع شروح الأربعين النووية وأوضحها: الشيخ العثيمين يفكك الأحاديث الجوامع بفوائد تربوية وعقدية. أساس حلقات العلم.",
      fr: "Le meilleur commentaire des 40 hadiths : clarté et pédagogie de Cheikh Al-Outhaymin.",
      en: "The finest commentary on the 40 hadiths: Al-Uthaymin's clarity and pedagogy.",
    },
    index: [
      "حديث الأعمال بالنيات",
      "أحاديث الإيمان والإحسان",
      "جوامع الوصايا النبوية",
      "النهي عن البدع",
      "الزهد والورع",
    ],
  },
  {
    slug: "sira-ibn-hisham",
    title: "السيرة النبوية لابن هشام (مشكولة)",
    author: "ابن هشام",
    publisher: "دار ابن كثير",
    volumes: 2,
    pages: 900,
    binding: { ar: "مجلد جزءان", fr: "2 volumes reliés", en: "2-volume set" },
    price: 2400,
    rating: 4.8,
    reviews: 356,
    category: "seerah",
    stock: 16,
    sold: 540,
    hue: 210,
    image: "/books/sira-hisham1.jpeg",
    images: ["/books/sira-hisham2.jpeg"],
    desc: {
      ar: "أقدم السير وأصلها: سيرة ابن هشام تهذيب سيرة ابن إسحاق، بطبعة مشكولة تيسر القراءة. في مجلدين.",
      fr: "La plus ancienne biographie : la Sira d'Ibn Hicham, édition vocalisée en 2 volumes.",
      en: "The oldest biography: Ibn Hisham's Seerah, vocalized edition in 2 volumes.",
    },
    index: [
      "نسب النبي ﷺ ومولده",
      "البعثة والهجرة",
      "الغزوات والسرايا",
      "الوفود والرسائل",
      "الوفاة والخلافة",
    ],
    series: "التراجم والسير",
  },
  {
    slug: "usul-tafsir",
    title: "شرح أصول في التفسير",
    author: "محمد بن صالح العثيمين",
    publisher: "دار الثريا",
    volumes: 1,
    pages: 300,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 1100,
    rating: 4.8,
    reviews: 287,
    category: "student",
    stock: 22,
    sold: 640,
    hue: 175,
    image: "/books/usul-tafsir1.jpg",
    desc: {
      ar: "مفتاح علم التفسير: قواعد فهم القرآن واختلاف المفسرين وأسباب النزول بشرح العثيمين الممتع. أول كتاب قبل أي تفسير.",
      fr: "La clé de l'exégèse : règles de compréhension du Coran commentées par Al-Outhaymin.",
      en: "The key to exegesis: rules for understanding the Quran explained by Al-Uthaymin.",
    },
    index: [
      "فضل التفسير وشروط المفسر",
      "القرآن المكي والمدني",
      "أسباب النزول",
      "اختلاف المفسرين",
      "الإسرائيليات وموقفها",
    ],
  },
  {
    slug: "adab-dunya",
    title: "أدب الدنيا والدين",
    author: "الماوردي",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 380,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 1150,
    rating: 4.7,
    reviews: 245,
    category: "student",
    stock: 20,
    sold: 480,
    hue: 125,
    image: "/books/adab1.jpg",
    desc: {
      ar: "كلاسيكية الماوردي في أدب العقل والدين والدنيا: خمسة أبواب تجمع الحكمة والسياسة والأخلاق. من أمتع كتب التراث.",
      fr: "Le classique d'Al-Mawardi : raison, religion et vie mondaine en cinq livres de sagesse.",
      en: "Al-Mawardi's classic: intellect, religion and worldly life in five books of wisdom.",
    },
    index: [
      "فضل العقل وأدبه",
      "أدب العلم والتعلم",
      "أدب الدين والعبادة",
      "أدب الدنيا والمعاش",
      "أدب النفس والأخلاق",
    ],
  },
  {
    slug: "zinat-maraa",
    title: "زينة المرأة المسلمة",
    author: "عبد الرزاق بن عبد المحسن البدر",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 220,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 900,
    rating: 4.9,
    reviews: 512,
    category: "gifts",
    badge: "new",
    stock: 28,
    sold: 720,
    hue: 315,
    image: "/books/zina1.jpg",
    desc: {
      ar: "أجمل هدية للمرأة المسلمة: الزينة المشروعة والحجاب والأخلاق بأسلوب الشيخ البدر الرقيق. طبعة أنيقة.",
      fr: "Le plus beau cadeau : parure légiférée, hijab et bonnes mœurs, par Abd Ar-Razzaq Al-Badr.",
      en: "A beautiful gift: lawful adornment, hijab and manners by Abd Ar-Razzaq Al-Badr.",
    },
    index: [
      "الزينة المشروعة وضوابطها",
      "الحجاب وأدلة وجوبه",
      "أخلاق المرأة المسلمة",
      "المرأة وبيتها",
      "نماذج من الصالحات",
    ],
  },
  {
    slug: "qawl-mufeed",
    title: "القول المفيد على كتاب التوحيد",
    author: "محمد بن صالح العثيمين",
    publisher: "دار العاصمة",
    volumes: 2,
    pages: 1150,
    binding: { ar: "مجلد جزءان", fr: "2 volumes reliés", en: "2-volume set" },
    price: 2300,
    rating: 4.9,
    reviews: 689,
    category: "aqeedah",
    stock: 18,
    sold: 760,
    hue: 65,
    image: "/books/qawl1.jpg",
    desc: {
      ar: "أوسع شروح كتاب التوحيد وأدقها: العثيمين يشرح كل باب بتحرير علمي بديع. عدة طالب العقيدة في مجلدين.",
      fr: "Le commentaire le plus approfondi du Livre de l'Unicité, par Al-Outhaymin, en 2 volumes.",
      en: "The most thorough commentary on the Book of Monotheism by Al-Uthaymin, in 2 volumes.",
    },
    index: [
      "أبواب فضل التوحيد",
      "أبواب الشرك الأكبر والأصغر",
      "أبواب الأسماء والصفات",
      "أبواب السحر والتمائم",
      "خاتمة الشرح وفوائده",
    ],
  },
  {
    slug: "sharh-tahawiya",
    title: "شرح العقيدة الطحاوية",
    author: "ابن أبي العز الحنفي",
    publisher: "دار السلام",
    volumes: 1,
    pages: 640,
    binding: { ar: "ورقي فاخر", fr: "Relié premium", en: "Premium hardcover" },
    price: 1750,
    rating: 4.9,
    reviews: 823,
    category: "aqeedah",
    stock: 21,
    sold: 910,
    hue: 250,
    image: "/books/tahawiya1.png",
    desc: {
      ar: "أشهر متون العقيدة شرحا: متن الطحاوي بشرح ابن أبي العز الجامع لأدلة السلف وردود المخالفين. لا يستغني عنه طالب.",
      fr: "Le plus célèbre traité de croyance commenté par Ibn Abi Al-Izz. Incontournable.",
      en: "The most famous creed treatise explained by Ibn Abi Al-Izz. Essential.",
    },
    index: [
      "توحيد الربوبية والألوهية",
      "الإيمان بالنبوة والكتب",
      "القدر والقضاء",
      "الصحابة والخلافة",
      "أشراط الساعة",
    ],
  },
  {
    slug: "mutun-talib",
    title: "متون طالب العلم (4 مستويات)",
    author: "عبد المحسن بن محمد القاسم",
    publisher: "دار المنهاج",
    volumes: 4,
    pages: 1200,
    binding: { ar: "مجلد 4 أجزاء", fr: "4 volumes", en: "4-volume set" },
    price: 2600,
    rating: 4.9,
    reviews: 445,
    category: "student",
    badge: "new",
    stock: 17,
    sold: 530,
    hue: 10,
    image: "/books/mutun1.jpg",
    desc: {
      ar: "المنهج العلمي المتدرج: متون محققة مشكولة في أربعة مستويات من التأسيس إلى التخصص، بعناية الشيخ القاسم. خطة طالب العلم الجاهزة.",
      fr: "Le cursus gradué : textes vocalisés en 4 niveaux, du fondement à la spécialisation.",
      en: "The graded curriculum: vocalized texts in 4 levels, from foundation to specialization.",
    },
    index: [
      "المستوى الأول: التأسيس",
      "المستوى الثاني: البناء",
      "المستوى الثالث: التوسع",
      "المستوى الرابع: التخصص",
      "منهجية الحفظ والمراجعة",
    ],
    series: "المناهج العلمية",
  },
  {
    slug: "uzla",
    title: "العزلة",
    author: "الخطابي",
    publisher: "دار ابن الجوزي",
    volumes: 1,
    pages: 200,
    binding: { ar: "غلاف مقوى", fr: "Couverture rigide", en: "Hard cover" },
    price: 650,
    rating: 4.6,
    reviews: 134,
    category: "student",
    stock: 25,
    sold: 390,
    hue: 200,
    image: "/books/uzla1.jpg",
    desc: {
      ar: "رسالة الخطابي في فضل العزلة عن أهل السوء وضوابط مخالطة الناس، بأدلة وأخبار السلف. لأيام الفتن والانشغال.",
      fr: "L'épître d'Al-Khattabi sur la retraite salutaire et les règles de la fréquentation.",
      en: "Al-Khattabi's epistle on beneficial seclusion and rules of company.",
    },
    index: [
      "فضل العزلة وأدلتها",
      "أقسام الناس في المخالطة",
      "آفات الخلطة",
      "عزلة القلب والبدن",
      "أخبار المعتزلين من السلف",
    ],
  },
  {
    slug: "miraj-qabul",
    title: "معارج القبول شرح سلم الوصول",
    author: "حافظ الحكمي",
    publisher: "دار ابن الجوزي",
    volumes: 3,
    pages: 1600,
    binding: { ar: "مجلد 3 أجزاء", fr: "3 volumes reliés", en: "3-volume set" },
    price: 3400,
    rating: 4.8,
    reviews: 312,
    category: "aqeedah",
    stock: 10,
    sold: 380,
    hue: 280,
    image: "/books/miraj1.png",
    desc: {
      ar: "شرح الحكمي لمنظومته سلم الوصول في العقيدة: موسوعة سلفية منظومة ومنثورة في ثلاثة مجلدات محققة.",
      fr: "Le commentaire d'Al-Hakami de son poème sur la croyance, en 3 volumes vérifiés.",
      en: "Al-Hakami's commentary on his creed poem, in 3 verified volumes.",
    },
    index: [
      "مقدمات التوحيد",
      "الأسماء والصفات",
      "الإيمان والقدر",
      "الرد على الفرق",
      "السيرة والشمائل",
    ],
    series: "الموسوعات",
  },
  {
    slug: "nuzhat-muttaqin",
    title: "نزهة المتقين شرح رياض الصالحين",
    author: "مصطفى الخن ومصطفى البغا",
    publisher: "دار ابن كثير",
    volumes: 2,
    pages: 1400,
    binding: { ar: "مجلد جزءان", fr: "2 volumes reliés", en: "2-volume set" },
    price: 2900,
    rating: 4.8,
    reviews: 467,
    category: "student",
    stock: 13,
    sold: 590,
    hue: 150,
    image: "/books/nuzha1.jpeg",
    images: ["/books/nuzha2.jpeg"],
    desc: {
      ar: "أوفى شروح رياض الصالحين المعاصرة: تخريج وفقه ولغة بأسلوب ميسر في مجلدين فاخرين. رفيق حلقات الرياض.",
      fr: "Le commentaire contemporain le plus complet de Riyad As-Salihin, en 2 volumes.",
      en: "The most complete contemporary commentary on Riyad As-Salihin, in 2 volumes.",
    },
    index: [
      "شرح أحاديث الإخلاص",
      "فقه الأذكار والأدعية",
      "غريب الحديث ولغته",
      "فوائد تربوية مستنبطة",
      "تخريج الأحاديث ودرجاتها",
    ],
    series: "الشروح",
  },
  {
    slug: "gloves-black-80den",
    title: "قفازات نسائية ساترة — أسود 80 DEN",
    author: "ستر شوب",
    publisher: "Sitr Shop",
    volumes: 1,
    pages: 2,
    binding: { ar: "قفازات", fr: "Gants", en: "Gloves" },
    price: 750,
    rating: 4.9,
    reviews: 640,
    category: "gifts",
    badge: "bestseller",
    stock: 150,
    sold: 3200,
    hue: 340,
    desc: {
      ar: "قفازات نسائية ساترة بجودة عالية 80 DEN، مريحة وخفيفة ومناسبة للعباية، متوفرة بالأسود مع تغليف وردي أنيق. الأكثر طلباً عند أخواتنا.",
      fr: "Gants féminins opaques 80 DEN, confortables et légers, emballage rose soigné. Les plus demandés.",
      en: "Opaque women's gloves 80 DEN, comfy and light, pink gift wrapping. Best sellers.",
    },
    index: [
      "خامة عالية الجودة 80 DEN",
      "مريحة وخفيفة وساترة",
      "مقاس موحد مطاطي",
      "تغليف هدية وردي",
    ],
  },
  {
    slug: "gloves-beige-set",
    title: "طقم قفازات — بيج وأبيض وأسود (3 ألوان)",
    author: "ستر شوب",
    publisher: "Sitr Shop",
    volumes: 1,
    pages: 6,
    binding: { ar: "طقم 3 قطع", fr: "Lot de 3", en: "Set of 3" },
    price: 1900,
    oldPrice: 2250,
    rating: 4.8,
    reviews: 312,
    category: "gifts",
    badge: "new",
    stock: 80,
    sold: 1150,
    hue: 330,
    desc: {
      ar: "طقم 3 قفازات بألوان تناسب عبايتك: أسود وبيج وأبيض، خامة ناعمة لا تتشقق، مع شريط ساتان وتغليف هدية.",
      fr: "Lot de 3 gants assortis à ta abaya : noir, beige et blanc, matière douce, ruban satin et emballage cadeau.",
      en: "Set of 3 gloves to match your abaya: black, beige and white, soft fabric, satin ribbon and gift wrap.",
    },
    index: [
      "3 ألوان: أسود + بيج + أبيض",
      "خامة ناعمة ومطاطية",
      "تناسب كل العبايات",
      "تغليف هدية مجاني",
    ],
  },
];

export interface Bundle {
  slug: string;
  title: { ar: string; fr: string; en: string };
  desc: { ar: string; fr: string; en: string };
  books: string[];
  price: number;
  hue: number;
  gift: boolean;
}

export const BUNDLES: Bundle[] = [
  {
    slug: "debutant",
    title: {
      ar: "حقيبة الطالب المبتدئ",
      fr: "Pack étudiant débutant",
      en: "Beginner student pack",
    },
    desc: {
      ar: "انطلاقتك المثالية: التوحيد والأذكار والأربعون وعلاج القلوب في حقيبة واحدة",
      fr: "Votre départ idéal : Tawhid, invocations, 40 hadiths et remède des cœurs",
      en: "Your ideal start: Tawhid, supplications, 40 hadiths and heart's cure",
    },
    books: ["kitab-tawhid", "hisn-muslim", "arbain-nawawiya", "daa-wa-dawa"],
    price: 2250,
    hue: 152,
    gift: false,
  },
  {
    slug: "qayyim",
    title: {
      ar: "بوكس كتب ابن القيم",
      fr: "Coffret Ibn Al-Qayyim",
      en: "Ibn Al-Qayyim box",
    },
    desc: {
      ar: "ثلاثية التزكية الكبرى: الداء والدواء وزاد المعاد ومدارج السالكين",
      fr: "La grande trilogie : remède des cœurs, provision et stations",
      en: "The great trilogy: heart's cure, provision and stations",
    },
    books: ["daa-wa-dawa", "zad-maad", "madarij-salikin"],
    price: 10900,
    hue: 28,
    gift: false,
  },
  {
    slug: "seerah-pack",
    title: {
      ar: "سلسلة السيرة النبوية",
      fr: "Série Sira",
      en: "Seerah series",
    },
    desc: {
      ar: "من المختصر المحبب إلى الموسوعة الكبرى: الرحيق المختوم مع البداية والنهاية",
      fr: "Du résumé aimé à la grande encyclopédie",
      en: "From the beloved summary to the great encyclopedia",
    },
    books: ["raheeq-makhtoum", "bidaya-nihaya"],
    price: 8600,
    hue: 200,
    gift: false,
  },
  {
    slug: "dream-box",
    title: {
      ar: "بوكس الأحلام (هدية)",
      fr: "Dream Box (cadeau)",
      en: "Dream Box (gift)",
    },
    desc: {
      ar: "أجمل هدية لمن تحب: رياض الصالحين وحصن المسلم مع تغليف هدية وبطاقة إهداء مجانية",
      fr: "Le plus beau cadeau : Riyad Salihin et Hisn Muslim, emballage et carte offerts",
      en: "The finest gift: Riyad Salihin and Hisn Muslim with free wrap and card",
    },
    books: ["riyad-salihin", "hisn-muslim"],
    price: 1750,
    hue: 320,
    gift: true,
  },
];

export interface Testimonial {
  name: { ar: string; fr: string; en: string };
  wilaya: string;
  text: { ar: string; fr: string; en: string };
  rating: number;
}

export interface Wilaya {
  code: number;
  ar: string;
  fr: string;
}

export const WILAYAS: Wilaya[] = [
  { code: 1, ar: "أدرار", fr: "Adrar" },
  { code: 2, ar: "الشلف", fr: "Chlef" },
  { code: 3, ar: "الأغواط", fr: "Laghouat" },
  { code: 4, ar: "أم البواقي", fr: "Oum El Bouaghi" },
  { code: 5, ar: "باتنة", fr: "Batna" },
  { code: 6, ar: "بجاية", fr: "Béjaïa" },
  { code: 7, ar: "بسكرة", fr: "Biskra" },
  { code: 8, ar: "بشار", fr: "Béchar" },
  { code: 9, ar: "البليدة", fr: "Blida" },
  { code: 10, ar: "البويرة", fr: "Bouira" },
  { code: 11, ar: "تمنراست", fr: "Tamanrasset" },
  { code: 12, ar: "تبسة", fr: "Tébessa" },
  { code: 13, ar: "تلمسان", fr: "Tlemcen" },
  { code: 14, ar: "تيارت", fr: "Tiaret" },
  { code: 15, ar: "تيزي وزو", fr: "Tizi Ouzou" },
  { code: 16, ar: "الجزائر", fr: "Alger" },
  { code: 17, ar: "الجلفة", fr: "Djelfa" },
  { code: 18, ar: "جيجل", fr: "Jijel" },
  { code: 19, ar: "سطيف", fr: "Sétif" },
  { code: 20, ar: "سعيدة", fr: "Saïda" },
  { code: 21, ar: "سكيكدة", fr: "Skikda" },
  { code: 22, ar: "سيدي بلعباس", fr: "Sidi Bel Abbès" },
  { code: 23, ar: "عنابة", fr: "Annaba" },
  { code: 24, ar: "قالمة", fr: "Guelma" },
  { code: 25, ar: "قسنطينة", fr: "Constantine" },
  { code: 26, ar: "المدية", fr: "Médéa" },
  { code: 27, ar: "مستغانم", fr: "Mostaganem" },
  { code: 28, ar: "المسيلة", fr: "M'Sila" },
  { code: 29, ar: "معسكر", fr: "Mascara" },
  { code: 30, ar: "ورقلة", fr: "Ouargla" },
  { code: 31, ar: "وهران", fr: "Oran" },
  { code: 32, ar: "البيض", fr: "El Bayadh" },
  { code: 33, ar: "إليزي", fr: "Illizi" },
  { code: 34, ar: "برج بوعريريج", fr: "B.B.Arréridj" },
  { code: 35, ar: "بومرداس", fr: "Boumerdès" },
  { code: 36, ar: "الطارف", fr: "El Tarf" },
  { code: 37, ar: "تندوف", fr: "Tindouf" },
  { code: 38, ar: "تيسمسيلت", fr: "Tissemsilt" },
  { code: 39, ar: "الوادي", fr: "El Oued" },
  { code: 40, ar: "خنشلة", fr: "Khenchela" },
  { code: 41, ar: "سوق أهراس", fr: "Souk Ahras" },
  { code: 42, ar: "تيبازة", fr: "Tipaza" },
  { code: 43, ar: "ميلة", fr: "Mila" },
  { code: 44, ar: "عين الدفلى", fr: "Aïn Defla" },
  { code: 45, ar: "النعامة", fr: "Naâma" },
  { code: 46, ar: "عين تموشنت", fr: "Aïn Témouchent" },
  { code: 47, ar: "غرداية", fr: "Ghardaïa" },
  { code: 48, ar: "غليزان", fr: "Relizane" },
  { code: 49, ar: "تيميمون", fr: "Timimoun" },
  { code: 50, ar: "برج باجي مختار", fr: "B.B.Mokhtar" },
  { code: 51, ar: "أولاد جلال", fr: "Ouled Djellal" },
  { code: 52, ar: "بني عباس", fr: "Béni Abbès" },
  { code: 53, ar: "عين صالح", fr: "In Salah" },
  { code: 54, ar: "عين قزام", fr: "In Guezzam" },
  { code: 55, ar: "تقرت", fr: "Touggourt" },
  { code: 56, ar: "جانت", fr: "Djanet" },
  { code: 57, ar: "المغير", fr: "El M'Ghair" },
  { code: 58, ar: "المنيعة", fr: "El Meniaa" },
];

const REMOTE = new Set([
  1, 11, 33, 37, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
]);

export function deliveryFee(
  code: number,
  type: "home" | "office"
): { fee: number; days: string } {
  const base =
    type === "home"
      ? 500 + ((code * 137) % 5) * 100
      : 300 + ((code * 89) % 4) * 100;
  const fee = base + (REMOTE.has(code) ? 200 : 0);
  const days = REMOTE.has(code) ? "3 - 7" : "1 - 3";
  return { fee, days };
}

export interface Coupon {
  code: string;
  percent: number;
  min: number;
}

export const COUPONS: Coupon[] = [
  { code: "SITR10", percent: 10, min: 0 },
  { code: "TALIBA15", percent: 15, min: 5000 },
  { code: "MARHABA5", percent: 5, min: 0 },
];

export function normalizeAr(s: string): string {
  return s
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase()
    .trim();
}

export function bookMatches(book: Book, query: string): boolean {
  const q = normalizeAr(query);
  if (!q) return true;
  const hay = normalizeAr(
    `${book.title} ${book.author} ${book.publisher} ${book.series ?? ""} ${CATEGORIES.find((c) => c.id === book.category)?.ar ?? ""}`
  );
  return q.split(/\s+/).every((w) => hay.includes(w));
}

export function formatPrice(n: number): string {
  const NBSP = String.fromCharCode(160);
  return n.toLocaleString("en-US").split(",").join(NBSP);
}

export function bundleTotal(b: Bundle): number {
  return b.books.reduce(
    (s, slug) => s + (BOOKS.find((x) => x.slug === slug)?.price ?? 0),
    0
  );
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
];

export const CARRIERS = ["Yalidine", "ZR Express", "Kazi Tour", "EMS"] as const;
export type Carrier = (typeof CARRIERS)[number];

export interface OrderItem {
  slug: string;
  title: string;
  qty: number;
  price: number;
}

export interface Order {
  number: string;
  name: string;
  phone: string;
  phone2?: string;
  wilaya: number;
  commune: string;
  deliveryType: "home" | "office";
  carrier?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  gift: boolean;
  giftNote?: string;
  notes?: string;
  status: OrderStatus;
  otp: string;
  verified: boolean;
  createdAt: string;
}

export function makeOrderNumber(): string {
  const d = new Date();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SITR-${d.getFullYear().toString().slice(2)}${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${rand}`;
}

export function makeOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function orderTotal(o: Order): number {
  return o.subtotal - o.discount + o.deliveryFee + (o.gift ? 200 : 0);
}
