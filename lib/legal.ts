import type { Locale } from "./i18n";

export interface LegalSection {
  h: string;
  p: string;
}

export const PRIVACY: Record<Locale, LegalSection[]> = {
  ar: [
    {
      h: "من نحن",
      p: "متجر ستر شوب (نسخة 0.1.0) متجر إلكتروني نسائي جزائري للكتب الشرعية والقفازات، يعمل بالدفع عند الاستلام وتوصيل جميع الولايات عبر شركات شحن جزائرية.",
    },
    {
      h: "البيانات التي نجمعها",
      p: "عند إتمام الطلب نجمع فقط: الاسم، رقم الهاتف (وهو اختياري)، الولاية، البلدية، ونوع التوصيل. يمكن إضافة رقم هاتف ثانٍ ونص إهداء اختياري. لا نجمع أي بيانات بطاقات بنكية لأن الدفع نقداً عند الاستلام.",
    },
    {
      h: "الغرض من الجمع",
      p: "تُستخدم البيانات حصراً لتأكيد الطلب هاتفياً، تجهيزه، شحنه، وتحديث حالة التتبع. لا نستخدم البيانات لأي غرض تسويقي دون موافقتك.",
    },
    {
      h: "مشاركة البيانات",
      p: "نشارك الاسم والهاتف والعنوان فقط مع شركة التوصيل التي اخترتها (Yalidine أو ZR Express أو غيرها) لتنفيذ الشحن. لا نبيع البيانات ولا نشاركها مع معلنين أو أطراف ثالثة أخرى.",
    },
    {
      h: "مدة الاحتفاظ",
      p: "تُحفظ بيانات الطلبات على جهازك (متصفحك) افتراضياً. عند تفعيل قاعدة البيانات في الخادم، تُحفظ بيانات الطلب حسب الحاجة التشغيلية ويمكن حذفها عند الطلب.",
    },
    {
      h: "ملفات الارتباط والتحليلات",
      p: "ملفات ارتباط ضرورية (جلسة الموقع) تعمل دائماً لأداء المتجر. أما تحليلات Meta وTikTok فمعطلة افتراضياً ولا تعمل إلا بعد موافقتك الصريحة عبر شريط الموافقة.",
    },
    {
      h: "حقوقك",
      p: "لك الحق في طلب حذف بياناتك في أي وقت. يمكنك حذف بياناتك المحلية بنفسك من زر «احذف بياناتي» في أسفل هذه الصفحة، وللبيانات المخزنة في الخادم اتصل بنا وسنستجيب خلال 30 يوماً.",
    },
    {
      h: "أمن البيانات",
      p: "نطبق حماية تقنية على واجهات الإدارة (تسجيل دخول مع تحقق بخطوتين، حد للمحاولات، رؤوس أمان). لا تُخزن كلمات مرور الزبائن إطلاقاً لعدم وجود حسابات.",
    },
    {
      h: "قانون مطبق",
      p: "هذه السياسة مبنية على أحكام القانون الجزائري رقم 18-07 المتعلق بحماية المعطيات ذات الطابع الشخصي. استعمالكم للموقع يعني موافقتكم على هذه السياسة.",
    },
    {
      h: "الاتصال بنا",
      p: "لأي استفسار أو طلب حذف بيانات: استعملوا أرقام الهاتف الرسمية المعروضة في الفوتر أو راسلوا الحساب الرسمي على إنستغرام.",
    },
  ],
  fr: [
    {
      h: "Qui sommes-nous",
      p: "Sitr Shop (v0.1.0) est une boutique féminine algérienne en ligne : livres islamiques & gants, paiement à la livraison, livraison dans les 58 wilayas via des transporteurs algériens.",
    },
    {
      h: "Données collectées",
      p: "À la commande, nous collectons uniquement : nom, téléphone (optionnel), wilaya, commune et mode de livraison. Un second téléphone et un mot d'offrande sont optionnels. Aucune donnée bancaire n'est collectée (paiement en espèces à la livraison).",
    },
    {
      h: "Finalité",
      p: "Les données servent exclusivement à confirmer la commande par téléphone, la préparer, l'expédier et suivre son statut. Aucune prospection sans consentement.",
    },
    {
      h: "Partage",
      p: "Nom, téléphone et adresse partagés uniquement avec le transporteur choisi (Yalidine, ZR Express, etc.) pour la livraison. Aucune vente ni partage avec des annonceurs.",
    },
    {
      h: "Conservation",
      p: "Les commandes restent stockées dans votre navigateur par défaut. Si la base de données serveur est activée, les données sont conservées le temps nécessaire et supprimées sur demande.",
    },
    {
      h: "Cookies et analytique",
      p: "Cookies essentiels (session) toujours actifs. Meta et TikTok Analytics sont désactivés par défaut et ne s'activent qu'après votre consentement explicite via le bandeau.",
    },
    {
      h: "Vos droits",
      p: "Vous pouvez demander la suppression de vos données à tout moment. Utilisez le bouton « Supprimer mes données » ci-dessous pour les données locales, ou contactez-nous pour les données serveur (réponse sous 30 jours).",
    },
    {
      h: "Sécurité",
      p: "Protection des interfaces d'administration : connexion avec vérification en deux étapes, limitation des tentatives, en-têtes de sécurité. Aucun mot de passe client n'est stocké (pas de comptes clients).",
    },
    {
      h: "Droit applicable",
      p: "Politique fondée sur la loi algérienne n° 18-07 relative à la protection des données à caractère personnel. L'utilisation du site vaut acceptation.",
    },
    {
      h: "Contact",
      p: "Pour toute question ou demande de suppression : utilisez les numéros officiels du pied de page ou le compte Instagram officiel.",
    },
  ],
  en: [
    {
      h: "Who we are",
      p: "Sitr Shop (v0.1.0) is an Algerian women-only online store for Islamic books & gloves: cash on delivery, delivery across all 58 wilayas via Algerian carriers.",
    },
    {
      h: "Data we collect",
      p: "At checkout we collect only: name, phone (optional), wilaya, commune and delivery type. A second phone and a gift note are optional. No payment-card data is collected (cash on delivery).",
    },
    {
      h: "Purpose",
      p: "Data is used solely to confirm your order by phone, prepare it, ship it, and update tracking status. No marketing use without your consent.",
    },
    {
      h: "Sharing",
      p: "Name, phone and address are shared only with the carrier you chose (Yalidine, ZR Express, etc.) for delivery. We never sell data or share it with advertisers.",
    },
    {
      h: "Retention",
      p: "Orders are stored in your browser by default. If the server database is enabled, order data is kept as needed and deleted on request.",
    },
    {
      h: "Cookies & analytics",
      p: "Essential cookies (session) are always on. Meta and TikTok analytics are off by default and activate only after explicit consent via the banner.",
    },
    {
      h: "Your rights",
      p: "You may request deletion of your data at any time. Use the “Delete my local data” button below for on-device data, or contact us for server data (response within 30 days).",
    },
    {
      h: "Security",
      p: "Admin interfaces are protected: two-factor login, attempt limits, security headers. No customer passwords are stored (no customer accounts).",
    },
    {
      h: "Applicable law",
      p: "This policy follows Algerian Law No. 18-07 on the protection of personal data. Using the site means accepting it.",
    },
    {
      h: "Contact",
      p: "For any question or deletion request: use the official phone numbers in the footer or the official Instagram account.",
    },
  ],
};
