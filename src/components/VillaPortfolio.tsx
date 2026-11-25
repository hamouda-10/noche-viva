import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  Check,
  Columns2,
  Globe,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { formatUsd, REGIONS, RegionKey, Villa, VILLAS } from '../data/villas';

type Lang = 'ar' | 'en';
type SortKey = 'price-desc' | 'price-asc' | 'area-desc' | 'beds-desc';

interface InquiryReceipt {
  reference: string;
  villaName: string;
  clientName: string;
  method: string;
  viewing: string;
  priceUsd: number;
}

const COPY = {
  ar: {
    kicker: 'مجموعة نوتشي فيفا للعقارات الخاصة · محفظة عالمية حصرية',
    headline: 'أرقى وأفخم الفلل والقصور الخاصة في العالم',
    subheadline:
      'محفظة منتقاة بعناية من التحف المعمارية النادرة في دبي، بحيرة كومو، بيفرلي هيلز، ماربيا، سانت بارتس وبالي — بملكية مباشرة كاملة وأسعار شفافة بالدولار الأمريكي.',
    statsValue: 'إجمالي قيمة المحفظة',
    statsEstates: 'عقاراً أيقونياً متاحاً',
    statsDestinations: 'وجهات عالمية حصرية',
    statsOwnership: 'ملكية مباشرة موثقة',
    searchPlaceholder: 'ابحث باسم الفيلا، المدينة أو الدولة...',
    sortLabel: 'ترتيب حسب',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortAreaDesc: 'المساحة: الأكبر أولاً',
    sortBedsDesc: 'الأجنحة: الأكثر أولاً',
    savedBtn: 'المحفوظات',
    compareBtn: 'مقارنة',
    bedrooms: 'أجنحة',
    bathrooms: 'حمامات',
    builtArea: 'م² مباني',
    plotArea: 'م² أرض',
    viewDossier: 'التفاصيل وطلب الشراء',
    addCompare: 'قارن',
    inCompare: 'في المقارنة',
    noResults: 'لا توجد فلل تطابق معايير البحث الحالية.',
    resetFilters: 'إعادة تعيين الفلاتر',
    // Modal
    specsTitle: 'المواصفات الفنية والملكية',
    amenitiesTitle: 'المرافق والمزايا الاستثنائية',
    calculatorTitle: 'حاسبة التملك والتمويل الخاص (بالدولار الأمريكي)',
    downPayment: 'الدفعة الأولى',
    termYears: 'مدة التمويل',
    years: 'سنة',
    estMonthly: 'القسط الشهري التقديري (فائدة 5.2%)',
    cashNeeded: 'قيمة الدفعة الأولى نقداً',
    pricePerSqm: 'سعر المتر المربع',
    inquiryTitle: 'تقديم عرض شراء أو حجز معاينة خاصة',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف أو واتساب',
    paymentMethod: 'طريقة السداد المفضلة',
    payWire: 'تحويل بنكي دولي نقدي (USD Wire)',
    payEscrow: 'ضمان دولي عبر مكتب محاماة (Escrow)',
    payPrivateBank: 'تمويل مصرفي خاص (Private Bank)',
    viewingMode: 'نوع المعاينة المطلوبة',
    viewOnSite: 'زيارة ميدانية خاصة (استقبال طيران خاص)',
    viewVirtual: 'جولة خاصة مباشرة بدقة 4K مع المستشار',
    viewDirectOffer: 'تقديم عرض شراء مباشر دون معاينة',
    notes: 'ملاحظات أو متطلبات إضافية',
    submitInquiry: 'إرسال طلب التملك الموثّق',
    receiptTitle: 'تم تسجيل ملف الاستحواذ بنجاح',
    receiptRef: 'رقم الملف المرجعي',
    receiptDesc:
      'سيتواصل معك مدير الثروات العقارية الخاص خلال ساعتين لتنسيق أوراق الملكية أو ترتيب المعاينة.',
    newInquiry: 'إغلاق والعودة للمحفظة',
    // Shortlist & Compare
    savedDrawerTitle: 'قائمة الفلل المحفوظة',
    savedEmpty: 'لم تقم بحفظ أي فيلا بعد. اضغط على أيقونة الحفظ لإضافة العقارات هنا.',
    savedTotal: 'القيمة الإجمالية للمحفوظات',
    compareTitle: 'مقارنة تفصيلية بين الفلل المختارة',
    compareHint: 'اختر حتى 3 فلل لمقارنة المواصفات والمساحات والأسعار بالدولار.',
    remove: 'إزالة',
    // Advisory
    advisoryKicker: 'منهجية الاستحواذ العقاري العالمي',
    advisoryHeadline: 'شراء أندر العقارات العالمية بسرية مطلقة وإجراءات سلسة',
    steps: [
      {
        num: '01.',
        title: 'انتقاء عقارات حصرية وخارج السوق',
        body: 'نصل إلى قصور وفلل لا تُعرض علناً عبر شبكة ملاك ومعماريين دوليين في أوروبا والخليج والأمريكتين، مع تدقيق هندسي وقانوني كامل قبل العرض.',
      },
      {
        num: '02.',
        title: 'تنظيم الطيران الخاص والمعاينة الميدانية',
        body: 'ينسّق فريق الكونسيرج وصولك بالطيران الخاص أو اليخت مع جولة مغلقة برفقة المهندس المعماري ومستشار الضرائب المحلي لكل دولة.',
      },
      {
        num: '03.',
        title: 'حساب ضمان دولي ونقل ملكية فوري',
        body: 'تتم جميع التحويلات بالدولار الأمريكي عبر حسابات ضمان مصرفية في جنيف أو دبي أو لندن، مع تسليم صك الملكية الحرة وخدمات إدارة العقار.',
      },
    ],
    // Direct Off-Market Contact
    contactKicker: 'مكتب الاستحواذ الخاص · تواصل مباشر',
    contactHeadline: 'هل تبحث عن قصر خاص بمواصفات محددة أو جزيرة كاملة؟',
    contactDesc:
      'أخبرنا بالميزانية بالدولار والوجهة المفضلة، وسيقوم مستشارونا بإعداد ملف عقارات سرية خارج السوق خلال 24 ساعة.',
    budgetLabel: 'الميزانية التقديرية (بالدولار USD)',
    destLabel: 'الوجهة المفضلة',
    contactSubmit: 'طلب ملف العقارات السرية',
    contactSuccessTitle: 'تم استلام طلبك الخاص بنجاح',
    contactSuccessBody:
      'تم تخصيص مستشار عقاري خاص لملفك وسيصلك العرض السري قريباً عبر وسيلة التواصل المحددة.',
    offices: 'هافانا · دبي · موناكو · جنيف · بيفرلي هيلز',
    copyright: '© 2026 نوتشي فيفا للعقارات الخاصة. جميع الحقوق محفوظة.',
  },
  en: {
    kicker: 'Noche Viva Private Estates · Global Trophy Portfolio',
    headline: 'The World’s Finest Ultra-Luxury Private Villas',
    subheadline:
      'A tightly curated collection of architectural trophy residences across Dubai, Lake Como, Beverly Hills, Marbella, St. Barths, and Bali — verified direct ownership with transparent USD pricing.',
    statsValue: 'Combined Portfolio Value',
    statsEstates: 'Curated Iconic Estates',
    statsDestinations: 'Global Trophy Destinations',
    statsOwnership: 'Verified Direct Title',
    searchPlaceholder: 'Search by villa name, city, or country...',
    sortLabel: 'Sort by',
    sortPriceDesc: 'Price: High to Low',
    sortPriceAsc: 'Price: Low to High',
    sortAreaDesc: 'Living Area: Largest',
    sortBedsDesc: 'Suites: Most First',
    savedBtn: 'Shortlist',
    compareBtn: 'Compare',
    bedrooms: 'Suites',
    bathrooms: 'Baths',
    builtArea: 'm² Interior',
    plotArea: 'm² Plot',
    viewDossier: 'Inspect & Acquire',
    addCompare: 'Compare',
    inCompare: 'Comparing',
    noResults: 'No estates match your current search criteria.',
    resetFilters: 'Reset Filters',
    specsTitle: 'Architectural Specifications & Title',
    amenitiesTitle: 'Signature Amenities & Estate Features',
    calculatorTitle: 'Private Acquisition & Financing Estimator (USD)',
    downPayment: 'Down Payment',
    termYears: 'Financing Term',
    years: 'Years',
    estMonthly: 'Est. Monthly Payment (5.2% APR)',
    cashNeeded: 'Initial Cash Equity Required',
    pricePerSqm: 'Price per m²',
    inquiryTitle: 'Submit Direct Purchase Offer or Private Viewing',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone or WhatsApp',
    paymentMethod: 'Preferred Settlement Method',
    payWire: 'Direct USD International Wire',
    payEscrow: 'Geneva / London Legal Escrow',
    payPrivateBank: 'Private Wealth Bank Financing',
    viewingMode: 'Inspection Preference',
    viewOnSite: 'Private On-Site Inspection (Aviation Concierge)',
    viewVirtual: 'Live 4K Private Advisor Walkthrough',
    viewDirectOffer: 'Direct Sight-Unseen Acquisition Offer',
    notes: 'Additional Requirements or Notes',
    submitInquiry: 'Submit Verified Acquisition Request',
    receiptTitle: 'Acquisition Dossier Registered',
    receiptRef: 'Dossier Reference',
    receiptDesc:
      'Your dedicated Private Estate Director will reach out within two hours with title documentation and private viewing logistics.',
    newInquiry: 'Return to Portfolio',
    savedDrawerTitle: 'Saved Estate Shortlist',
    savedEmpty: 'No estates saved yet. Use the bookmark action on any villa to curate your shortlist.',
    savedTotal: 'Combined Shortlist Value',
    compareTitle: 'Side-by-Side Estate Comparison',
    compareHint: 'Select up to 3 villas to compare USD pricing, footprint, and signature assets.',
    remove: 'Remove',
    advisoryKicker: 'Global Acquisition Protocol',
    advisoryHeadline: 'Acquiring Rare Trophy Real Estate with Absolute Discretion',
    steps: [
      {
        num: '01.',
        title: 'Off-Market Architectural Curation',
        body: 'Direct access to private villas and historic palazzos never listed publicly, vetted for structural engineering, provenance, and clean freehold title before presentation.',
      },
      {
        num: '02.',
        title: 'Private Aviation & On-Site Inspection',
        body: 'Our concierge arranges helicopter transfers, private yacht moorings, and closed-door walkthroughs alongside lead architects and local tax counsel.',
      },
      {
        num: '03.',
        title: 'Cross-Border USD Escrow & Title Transfer',
        body: 'Seamless dollar-denominated settlement via institutional escrow accounts in Geneva, Dubai, or London, followed by turnkey estate management.',
      },
    ],
    contactKicker: 'Private Acquisition Desk · Direct Inquiry',
    contactHeadline: 'Commission a Bespoke Off-Market Villa Search',
    contactDesc:
      'Share your USD target budget and preferred destination. Our senior advisors will compile a confidential private dossier within 24 hours.',
    budgetLabel: 'Target Budget (USD)',
    destLabel: 'Preferred Destination',
    contactSubmit: 'Request Confidential Dossier',
    contactSuccessTitle: 'Private Mandate Received',
    contactSuccessBody:
      'A senior acquisition director has been assigned to your brief and will deliver your confidential dossier shortly.',
    offices: 'Havana · Dubai · Monaco · Geneva · Beverly Hills',
    copyright: '© 2026 Noche Viva Private Estates. All rights reserved.',
  },
} as const;

const ResilientVillaImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1f] via-[#131317] to-[#0b0b0c] text-[#a8a29e] p-6 text-center ${className}`}
      >
        <Globe className="w-8 h-8 mb-3 opacity-50" />
        <span className="text-sm font-medium text-[#e7e5e4]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
};

export const VillaPortfolio: React.FC = () => {
  const [lang, setLang] = useState<Lang>('ar');
  const [region, setRegion] = useState<RegionKey>('all');
  const [sortBy, setSortBy] = useState<SortKey>('price-desc');
  const [searchQuery, setSearchQuery] = useState('');

  const [savedIds, setSavedIds] = useState<string[]>(['pearl-crown-dubai']);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [activeVilla, setActiveVilla] = useState<Villa | null>(null);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Calculator state inside Estate Dossier Modal
  const [downPct, setDownPct] = useState<number>(30);
  const [years, setYears] = useState<number>(20);

  // Estate inquiry form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wire');
  const [viewingMode, setViewingMode] = useState('onsite');
  const [clientNotes, setClientNotes] = useState('');
  const [receipt, setReceipt] = useState<InquiryReceipt | null>(null);

  // Off-market bespoke inquiry form state
  const [bespokeName, setBespokeName] = useState('');
  const [bespokeContact, setBespokeContact] = useState('');
  const [bespokeBudget, setBespokeBudget] = useState('$25,000,000 – $50,000,000');
  const [bespokeDest, setBespokeDest] = useState('');
  const [bespokeSent, setBespokeSent] = useState<string | null>(null);

  const t = COPY[lang];
  const isRtl = lang === 'ar';

  const totalPortfolioUsd = useMemo(
    () => VILLAS.reduce((sum, v) => sum + v.priceUsd, 0),
    []
  );

  const filteredVillas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = VILLAS.filter((v) => {
      if (region !== 'all' && v.region !== region) return false;
      if (!q) return true;
      return (
        v.nameAr.toLowerCase().includes(q) ||
        v.nameEn.toLowerCase().includes(q) ||
        v.locationAr.toLowerCase().includes(q) ||
        v.locationEn.toLowerCase().includes(q) ||
        v.countryAr.toLowerCase().includes(q) ||
        v.countryEn.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-desc') return b.priceUsd - a.priceUsd;
      if (sortBy === 'price-asc') return a.priceUsd - b.priceUsd;
      if (sortBy === 'area-desc') return b.livingAreaSqm - a.livingAreaSqm;
      return b.bedrooms - a.bedrooms;
    });
  }, [region, sortBy, searchQuery]);

  const savedVillas = useMemo(
    () => VILLAS.filter((v) => savedIds.includes(v.id)),
    [savedIds]
  );

  const comparedVillas = useMemo(
    () => VILLAS.filter((v) => compareIds.includes(v.id)),
    [compareIds]
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const openVillaModal = (villa: Villa) => {
    setActiveVilla(villa);
    setReceipt(null);
    setDownPct(30);
    setYears(20);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVilla || !clientName.trim() || !clientEmail.trim()) return;
    const refCode = `NV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const methodLabel =
      paymentMethod === 'wire'
        ? t.payWire
        : paymentMethod === 'escrow'
        ? t.payEscrow
        : t.payPrivateBank;
    const viewingLabel =
      viewingMode === 'onsite'
        ? t.viewOnSite
        : viewingMode === 'virtual'
        ? t.viewVirtual
        : t.viewDirectOffer;

    setReceipt({
      reference: refCode,
      villaName: isRtl ? activeVilla.nameAr : activeVilla.nameEn,
      clientName: clientName.trim(),
      method: methodLabel,
      viewing: viewingLabel,
      priceUsd: activeVilla.priceUsd,
    });
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientNotes('');
  };

  const handleBespokeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bespokeName.trim() || !bespokeContact.trim()) return;
    const ref = `NV-OFF-${Math.floor(1000 + Math.random() * 9000)}`;
    setBespokeSent(ref);
    setBespokeName('');
    setBespokeContact('');
    setBespokeDest('');
  };

  // Monthly mortgage math for active villa
  const calc = useMemo(() => {
    if (!activeVilla) {
      return { cashEquity: 0, monthly: 0, pricePerSqm: 0 };
    }
    const price = activeVilla.priceUsd;
    const cashEquity = Math.round((price * downPct) / 100);
    const principal = price - cashEquity;
    const r = 0.052 / 12;
    const n = years * 12;
    const monthly =
      principal > 0
        ? Math.round((principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1))
        : 0;
    const pricePerSqm = Math.round(price / activeVilla.livingAreaSqm);
    return { cashEquity, monthly, pricePerSqm };
  }, [activeVilla, downPct, years]);

  return (
    <div
      id="villas"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative bg-[#0b0b0c] text-[#f4f2ee] border-t border-white/10"
    >
      {/* SECTION 1: EDITORIAL PORTFOLIO HEADER & METRICS */}
      <section className="max-w-[1380px] mx-auto px-6 md:px-10 pt-20 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div className="max-w-3xl">
            <p className="text-xs md:text-sm tracking-wide text-[#c8a97e] mb-4">
              {t.kicker}
            </p>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.18] text-[#f4f2ee] [text-wrap:balance] ${
                isRtl ? 'font-editorial-ar' : 'font-nav-nv tracking-tight'
              }`}
            >
              {t.headline}
            </h2>
            <p className="mt-5 text-base md:text-lg text-[#a8a49c] leading-relaxed max-w-2xl">
              {t.subheadline}
            </p>
          </div>

          {/* Language, Saved Shortlist & Compare Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#f4f2ee] bg-[#151518] border border-white/12 hover:border-[#c8a97e]/60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#c8a97e]" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#f4f2ee] bg-[#151518] border border-white/12 hover:border-[#c8a97e]/60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Columns2 className="w-4 h-4 text-[#c8a97e]" />
              <span>
                {t.compareBtn} ({compareIds.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSavedDrawer(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0b0b0c] bg-[#d4b68a] hover:bg-[#e1c69e] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>
                {t.savedBtn} ({savedIds.length})
              </span>
            </button>
          </div>
        </div>

        {/* 4-Column Quantitative Portfolio Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-9 border-b border-white/10">
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#f4f2ee] tabular-nums">
              {formatUsd(totalPortfolioUsd)}
            </div>
            <div className="mt-1.5 text-xs md:text-sm text-[#9c9890]">
              {t.statsValue}
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#f4f2ee] tabular-nums">
              {VILLAS.length}
            </div>
            <div className="mt-1.5 text-xs md:text-sm text-[#9c9890]">
              {t.statsEstates}
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#f4f2ee] tabular-nums">
              6
            </div>
            <div className="mt-1.5 text-xs md:text-sm text-[#9c9890]">
              {t.statsDestinations}
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-[#c8a97e] tabular-nums">
              100%
            </div>
            <div className="mt-1.5 text-xs md:text-sm text-[#9c9890]">
              {t.statsOwnership}
            </div>
          </div>
        </div>

        {/* Interactive Filter, Region Tabs, Search & Sort Bar */}
        <div className="pt-8 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          {/* Segmented Region Tabs */}
          <div
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#141417] border border-white/10 rounded-lg"
            role="tablist"
            aria-label="Filter estates by region"
          >
            {REGIONS.map((r) => {
              const active = region === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRegion(r.key)}
                  className={`px-3.5 py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#f4f2ee] text-[#0b0b0c]'
                      : 'text-[#a8a49c] hover:text-[#f4f2ee]'
                  }`}
                >
                  {isRtl ? r.labelAr : r.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search
                className={`w-4 h-4 text-[#8c8880] absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRtl ? 'right-3.5' : 'left-3.5'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full py-2.5 bg-[#141417] border border-white/12 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] placeholder:text-[#7c7870] focus:outline-none transition-colors ${
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
            </div>

            <div className="relative flex items-center">
              <SlidersHorizontal
                className={`w-4 h-4 text-[#8c8880] absolute pointer-events-none ${
                  isRtl ? 'right-3.5' : 'left-3.5'
                }`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                aria-label={t.sortLabel}
                className={`w-full sm:w-auto py-2.5 bg-[#141417] border border-white/12 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none cursor-pointer ${
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              >
                <option value="price-desc">{t.sortPriceDesc}</option>
                <option value="price-asc">{t.sortPriceAsc}</option>
                <option value="area-desc">{t.sortAreaDesc}</option>
                <option value="beds-desc">{t.sortBedsDesc}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CURATED LUXURY VILLAS GRID */}
      <section className="max-w-[1380px] mx-auto px-6 md:px-10 pb-24">
        {filteredVillas.length === 0 ? (
          <div className="py-20 text-center border border-white/10 rounded-lg bg-[#121215]">
            <p className="text-base text-[#a8a49c]">{t.noResults}</p>
            <button
              type="button"
              onClick={() => {
                setRegion('all');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 text-sm font-medium bg-[#f4f2ee] text-[#0b0b0c] rounded-md hover:bg-[#e3dfd7] transition-colors cursor-pointer"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVillas.map((villa) => {
              const isSaved = savedIds.includes(villa.id);
              const isCompared = compareIds.includes(villa.id);
              const name = isRtl ? villa.nameAr : villa.nameEn;
              const location = isRtl ? villa.locationAr : villa.locationEn;
              const status = isRtl ? villa.statusAr : villa.statusEn;
              const style = isRtl ? villa.styleAr : villa.styleEn;
              const signature = isRtl
                ? villa.signatureAssetAr
                : villa.signatureAssetEn;

              return (
                <article
                  key={villa.id}
                  className="group flex flex-col bg-[#121215] border border-white/10 rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/20"
                >
                  {/* 4:3 Architectural Image Frame */}
                  <div
                    onClick={() => openVillaModal(villa)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#18181c] cursor-pointer"
                  >
                    <ResilientVillaImage
                      src={villa.image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c]/75 via-transparent to-transparent pointer-events-none" />

                    {/* Top-right Bookmark Affordance */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(villa.id);
                      }}
                      aria-label={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                      className={`absolute top-4 ${
                        isRtl ? 'left-4' : 'right-4'
                      } w-10 h-10 flex items-center justify-center rounded-md border backdrop-blur-md transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#d4b68a] border-[#d4b68a] text-[#0b0b0c]'
                          : 'bg-[#0b0b0c]/65 border-white/20 text-[#f4f2ee] hover:bg-[#0b0b0c]/90'
                      }`}
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={isSaved ? 'currentColor' : 'none'}
                      />
                    </button>

                    {/* Bottom overlay price + location coordinate */}
                    <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-2">
                      <div>
                        <div className="text-xl md:text-2xl font-bold text-[#f4f2ee] tabular-nums tracking-tight">
                          {formatUsd(villa.priceUsd)}
                        </div>
                        <div className="text-[11px] text-[#d4b68a] tabular-nums">
                          {formatUsd(Math.round(villa.priceUsd / villa.livingAreaSqm))} / m²
                        </div>
                      </div>
                      <span className="text-xs text-[#e2ded7]">{status}</span>
                    </div>
                  </div>

                  {/* Card Body — Uniform Baseline & Zero Pill Clutter */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 text-xs text-[#9c9890] mb-2">
                      <span>{villa.code}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{style}</span>
                    </div>

                    <h3
                      onClick={() => openVillaModal(villa)}
                      className={`text-xl font-bold text-[#f4f2ee] group-hover:text-[#d4b68a] transition-colors cursor-pointer ${
                        isRtl ? 'font-editorial-ar text-2xl' : ''
                      }`}
                    >
                      {name}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#b2aea6]">
                      <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>

                    <p className="mt-3 text-sm text-[#9a968e] line-clamp-2 leading-relaxed">
                      {signature}
                    </p>

                    {/* Clean Typographic Specs Divider Row */}
                    <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-xs text-[#c7c3bc] tabular-nums">
                      <div>
                        <span className="text-[#f4f2ee] font-semibold">
                          {villa.bedrooms}
                        </span>{' '}
                        {t.bedrooms}
                      </div>
                      <div>
                        <span className="text-[#f4f2ee] font-semibold">
                          {villa.livingAreaSqm.toLocaleString('en-US')}
                        </span>{' '}
                        {t.builtArea}
                      </div>
                      <div>
                        <span className="text-[#f4f2ee] font-semibold">
                          {villa.plotAreaSqm.toLocaleString('en-US')}
                        </span>{' '}
                        {t.plotArea}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => openVillaModal(villa)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#f4f2ee] text-[#0b0b0c] hover:bg-[#d4b68a] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>{t.viewDossier}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCompare(villa.id)}
                        className={`px-3.5 py-2.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isCompared
                            ? 'bg-[#c8a97e]/15 border-[#c8a97e] text-[#d4b68a]'
                            : 'bg-transparent border-white/15 text-[#b2aea6] hover:text-[#f4f2ee] hover:border-white/30'
                        }`}
                      >
                        {isCompared ? t.inCompare : t.addCompare}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 3: EDITORIAL ACQUISITION PROTOCOL */}
      <section
        id="advisory"
        className="border-t border-white/10 bg-[#0f0f12] py-24"
      >
        <div className="max-w-[1380px] mx-auto px-6 md:px-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs md:text-sm text-[#c8a97e] mb-3">
              {t.advisoryKicker}
            </p>
            <h2
              className={`text-3xl md:text-4xl font-bold text-[#f4f2ee] leading-tight [text-wrap:balance] ${
                isRtl ? 'font-editorial-ar' : ''
              }`}
            >
              {t.advisoryHeadline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.steps.map((step) => (
              <div
                key={step.num}
                className="pt-6 border-t border-white/15 flex flex-col"
              >
                <span className="text-sm font-medium text-[#c8a97e] tabular-nums mb-3">
                  {step.num}
                </span>
                <h3 className="text-xl font-semibold text-[#f4f2ee] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-[#9e9a92] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRIVATE CONCIERGE & OFF-MARKET REQUEST */}
      <section id="contact" className="border-t border-white/10 py-24 bg-[#0b0b0c]">
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs md:text-sm text-[#c8a97e] mb-3">
              {t.contactKicker}
            </p>
            <h2
              className={`text-3xl md:text-4xl font-bold text-[#f4f2ee] leading-tight [text-wrap:balance] ${
                isRtl ? 'font-editorial-ar' : ''
              }`}
            >
              {t.contactHeadline}
            </h2>
            <p className="mt-5 text-base text-[#a29e96] leading-relaxed">
              {t.contactDesc}
            </p>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2 text-sm text-[#9c9890]">
              <div className="text-[#f4f2ee] font-medium">{t.offices}</div>
              <div className="tabular-nums">acquisitions@nochevivaestates.com</div>
              <div className="tabular-nums" dir="ltr">
                +41 22 518 0940 · +971 4 519 8800
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#121215] border border-white/10 rounded-lg p-6 md:p-8">
            {bespokeSent ? (
              <div className="py-8">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-[#c8a97e]/15 text-[#d4b68a] mb-5">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-[#f4f2ee]">
                  {t.contactSuccessTitle}
                </h3>
                <p className="mt-2 text-sm text-[#a8a49c] leading-relaxed">
                  {t.contactSuccessBody}
                </p>
                <div className="mt-5 text-sm text-[#d4b68a] tabular-nums">
                  {t.receiptRef}: {bespokeSent}
                </div>
                <button
                  type="button"
                  onClick={() => setBespokeSent(null)}
                  className="mt-6 px-5 py-2.5 text-sm font-medium bg-[#f4f2ee] text-[#0b0b0c] rounded-md hover:bg-[#d4b68a] transition-colors cursor-pointer"
                >
                  {t.newInquiry}
                </button>
              </div>
            ) : (
              <form onSubmit={handleBespokeSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-[#b2aea6] mb-2">
                      {t.fullName}
                    </label>
                    <input
                      type="text"
                      required
                      value={bespokeName}
                      onChange={(e) => setBespokeName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#b2aea6] mb-2">
                      {t.phone}
                    </label>
                    <input
                      type="text"
                      required
                      value={bespokeContact}
                      onChange={(e) => setBespokeContact(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-[#b2aea6] mb-2">
                      {t.budgetLabel}
                    </label>
                    <select
                      value={bespokeBudget}
                      onChange={(e) => setBespokeBudget(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                    >
                      <option value="$15,000,000 – $25,000,000">
                        $15,000,000 – $25,000,000
                      </option>
                      <option value="$25,000,000 – $50,000,000">
                        $25,000,000 – $50,000,000
                      </option>
                      <option value="$50,000,000 – $100,000,000">
                        $50,000,000 – $100,000,000
                      </option>
                      <option value="$100,000,000+">$100,000,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#b2aea6] mb-2">
                      {t.destLabel}
                    </label>
                    <input
                      type="text"
                      value={bespokeDest}
                      onChange={(e) => setBespokeDest(e.target.value)}
                      placeholder={
                        isRtl
                          ? 'دبي، الريفييرا الفرنسية، سويسرا، جزر الكاريبي...'
                          : 'Dubai, French Riviera, Lake Como, St. Barths...'
                      }
                      className="w-full px-4 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] placeholder:text-[#6f6b64] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 text-sm font-semibold bg-[#d4b68a] text-[#0b0b0c] hover:bg-[#e3c89f] rounded-md transition-colors cursor-pointer"
                >
                  {t.contactSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* QUIET OBSIDIAN FOOTER */}
      <footer className="border-t border-white/10 py-10 bg-[#080809]">
        <div className="max-w-[1380px] mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c8880]">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 44 50"
              fill="currentColor"
              className="w-5 h-6 text-[#d4b68a]"
              aria-hidden="true"
            >
              <path d="M4 50V20C4 9 12 2 22 2s18 7 18 18v30h-7V20c0-6.6-4.9-11-11-11S11 13.4 11 20v30z" />
              <circle cx="22" cy="24" r="5.5" />
              <path d="M16 50V36h12v14h-4.5v-9.5h-3V50z" />
            </svg>
            <span className="font-display-nv text-sm tracking-wider text-[#f4f2ee]">
              NOCHE VIVA
            </span>
          </div>
          <div>{t.offices}</div>
          <div>{t.copyright}</div>
        </div>
      </footer>

      {/* =========================================================
          ESTATE DOSSIER & ACQUISITION MODAL (FULL SPECS + USD CALC)
         ========================================================= */}
      {activeVilla && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVilla(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#111114] border border-white/15 rounded-xl text-[#f4f2ee]"
          >
            {/* Modal Top Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#111114]/95 backdrop-blur-md border-b border-white/10">
              <div className="min-w-0">
                <div className="text-xs text-[#c8a97e] tabular-nums">
                  {activeVilla.code} · {activeVilla.coordinates}
                </div>
                <h3
                  className={`text-xl md:text-2xl font-bold truncate ${
                    isRtl ? 'font-editorial-ar' : ''
                  }`}
                >
                  {isRtl ? activeVilla.nameAr : activeVilla.nameEn}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleSave(activeVilla.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                    savedIds.includes(activeVilla.id)
                      ? 'bg-[#d4b68a] border-[#d4b68a] text-[#0b0b0c]'
                      : 'border-white/15 text-[#f4f2ee] hover:border-white/35'
                  }`}
                >
                  <Bookmark className="w-4 h-4 inline-block" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVilla(null)}
                  aria-label="Close modal"
                  className="w-10 h-10 flex items-center justify-center rounded-md border border-white/15 text-[#f4f2ee] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-10">
              {/* Hero Photo + Price Summary Strip */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-7 aspect-[4/3] rounded-lg overflow-hidden bg-[#18181c]">
                  <ResilientVillaImage
                    src={activeVilla.image}
                    alt={isRtl ? activeVilla.nameAr : activeVilla.nameEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between bg-[#16161a] border border-white/10 rounded-lg p-6">
                  <div>
                    <div className="text-xs text-[#a8a49c]">
                      {isRtl ? activeVilla.statusAr : activeVilla.statusEn} ·{' '}
                      {isRtl ? activeVilla.styleAr : activeVilla.styleEn}
                    </div>
                    <div className="mt-2 text-3xl md:text-4xl font-bold text-[#f4f2ee] tabular-nums">
                      {formatUsd(activeVilla.priceUsd)}
                    </div>
                    <div className="mt-1 text-xs text-[#d4b68a] tabular-nums">
                      {t.pricePerSqm}: {formatUsd(calc.pricePerSqm)} / m²
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-[#c7c3bc]">
                      <MapPin className="w-4 h-4 text-[#c8a97e] shrink-0" />
                      <span>
                        {isRtl ? activeVilla.locationAr : activeVilla.locationEn}
                      </span>
                    </div>

                    <p className="mt-5 text-sm text-[#b2aea6] leading-relaxed">
                      {isRtl
                        ? activeVilla.descriptionAr
                        : activeVilla.descriptionEn}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 text-xs text-[#9c9890]">
                    <span className="text-[#d4b68a] font-medium">
                      {isRtl
                        ? activeVilla.signatureAssetAr
                        : activeVilla.signatureAssetEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specifications Table */}
              <div>
                <h4 className="text-lg font-semibold text-[#f4f2ee] mb-4">
                  {t.specsTitle}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {activeVilla.specifications.map((spec) => (
                    <div
                      key={spec.labelEn}
                      className="p-4 bg-[#16161a] border border-white/10 rounded-lg"
                    >
                      <div className="text-xs text-[#8f8b83]">
                        {isRtl ? spec.labelAr : spec.labelEn}
                      </div>
                      <div className="mt-1.5 text-sm md:text-base font-semibold text-[#f4f2ee] tabular-nums">
                        {isRtl ? spec.valueAr : spec.valueEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Amenities */}
              <div>
                <h4 className="text-lg font-semibold text-[#f4f2ee] mb-4">
                  {t.amenitiesTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {(isRtl
                    ? activeVilla.amenitiesAr
                    : activeVilla.amenitiesEn
                  ).map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-[#c7c3bc] py-1.5 border-b border-white/5"
                    >
                      <Check className="w-4 h-4 text-[#c8a97e] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive USD Financing & Acquisition Estimator */}
              <div className="p-6 bg-[#16161a] border border-white/10 rounded-lg">
                <h4 className="text-base md:text-lg font-semibold text-[#f4f2ee] mb-5">
                  {t.calculatorTitle}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs text-[#b2aea6] mb-2">
                        <span>{t.downPayment}</span>
                        <span className="text-[#f4f2ee] font-semibold tabular-nums">
                          {downPct}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        step={5}
                        value={downPct}
                        onChange={(e) => setDownPct(Number(e.target.value))}
                        className="w-full accent-[#d4b68a] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-[#b2aea6] mb-2">
                        <span>{t.termYears}</span>
                        <span className="text-[#f4f2ee] font-semibold tabular-nums">
                          {years} {t.years}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        step={5}
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full accent-[#d4b68a] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0e0e11] border border-white/10 rounded-md">
                      <div className="text-xs text-[#9c9890]">{t.cashNeeded}</div>
                      <div className="mt-1.5 text-xl font-bold text-[#f4f2ee] tabular-nums">
                        {formatUsd(calc.cashEquity)}
                      </div>
                    </div>
                    <div className="p-4 bg-[#0e0e11] border border-white/10 rounded-md">
                      <div className="text-xs text-[#9c9890]">{t.estMonthly}</div>
                      <div className="mt-1.5 text-xl font-bold text-[#d4b68a] tabular-nums">
                        {formatUsd(calc.monthly)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Purchase Offer / Private Viewing Form */}
              <div className="pt-6 border-t border-white/10">
                {receipt ? (
                  <div className="p-6 bg-[#16161a] border border-[#c8a97e]/40 rounded-lg">
                    <div className="flex items-center gap-3 text-[#d4b68a] mb-3">
                      <Check className="w-5 h-5" />
                      <h4 className="text-xl font-bold text-[#f4f2ee]">
                        {t.receiptTitle}
                      </h4>
                    </div>
                    <p className="text-sm text-[#b2aea6] mb-5">{t.receiptDesc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-[#0e0e11] p-4 rounded-md border border-white/10">
                      <div>
                        <span className="text-[#8f8b83]">{t.receiptRef}: </span>
                        <span className="font-semibold text-[#d4b68a] tabular-nums">
                          {receipt.reference}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8f8b83]">{t.fullName}: </span>
                        <span className="font-semibold">{receipt.clientName}</span>
                      </div>
                      <div>
                        <span className="text-[#8f8b83]">USD: </span>
                        <span className="font-semibold tabular-nums">
                          {formatUsd(receipt.priceUsd)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8f8b83]">{receipt.method}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveVilla(null)}
                      className="mt-5 px-6 py-2.5 text-sm font-medium bg-[#f4f2ee] text-[#0b0b0c] rounded-md hover:bg-[#d4b68a] transition-colors cursor-pointer"
                    >
                      {t.newInquiry}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-5">
                    <h4 className="text-lg font-semibold text-[#f4f2ee]">
                      {t.inquiryTitle}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-[#a8a49c] mb-1.5">
                          {t.fullName}
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#a8a49c] mb-1.5">
                          {t.email}
                        </label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#a8a49c] mb-1.5">
                          {t.phone}
                        </label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#a8a49c] mb-1.5">
                          {t.paymentMethod}
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                        >
                          <option value="wire">{t.payWire}</option>
                          <option value="escrow">{t.payEscrow}</option>
                          <option value="bank">{t.payPrivateBank}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[#a8a49c] mb-1.5">
                          {t.viewingMode}
                        </label>
                        <select
                          value={viewingMode}
                          onChange={(e) => setViewingMode(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                        >
                          <option value="onsite">{t.viewOnSite}</option>
                          <option value="virtual">{t.viewVirtual}</option>
                          <option value="direct">{t.viewDirectOffer}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#a8a49c] mb-1.5">
                        {t.notes}
                      </label>
                      <textarea
                        rows={2}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#0b0b0c] border border-white/15 focus:border-[#c8a97e] rounded-md text-sm text-[#f4f2ee] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 text-sm font-semibold bg-[#d4b68a] text-[#0b0b0c] hover:bg-[#e3c89f] rounded-md transition-colors cursor-pointer"
                    >
                      {t.submitInquiry} — {formatUsd(activeVilla.priceUsd)}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SAVED SHORTLIST DRAWER
         ========================================================= */}
      {showSavedDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
          onClick={() => setShowSavedDrawer(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-[#111114] border-s border-white/15 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h3 className="text-lg font-semibold text-[#f4f2ee]">
                {t.savedDrawerTitle} ({savedVillas.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowSavedDrawer(false)}
                aria-label="Close shortlist"
                className="w-9 h-9 flex items-center justify-center rounded-md border border-white/15 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {savedVillas.length === 0 ? (
                <p className="text-sm text-[#9c9890] leading-relaxed">
                  {t.savedEmpty}
                </p>
              ) : (
                savedVillas.map((v) => (
                  <div
                    key={v.id}
                    className="flex gap-4 p-3 bg-[#16161a] border border-white/10 rounded-lg"
                  >
                    <ResilientVillaImage
                      src={v.image}
                      alt={isRtl ? v.nameAr : v.nameEn}
                      className="w-24 h-20 object-cover rounded-md shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#f4f2ee] truncate">
                        {isRtl ? v.nameAr : v.nameEn}
                      </div>
                      <div className="text-xs text-[#9c9890] truncate">
                        {isRtl ? v.locationAr : v.locationEn}
                      </div>
                      <div className="mt-1.5 text-sm font-bold text-[#d4b68a] tabular-nums">
                        {formatUsd(v.priceUsd)}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSavedDrawer(false);
                            openVillaModal(v);
                          }}
                          className="text-[#f4f2ee] underline underline-offset-4 cursor-pointer"
                        >
                          {t.viewDossier}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSave(v.id)}
                          className="text-[#9c9890] hover:text-red-400 cursor-pointer"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {savedVillas.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#0d0d10]">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[#9c9890]">{t.savedTotal}</span>
                  <span className="text-lg font-bold text-[#f4f2ee] tabular-nums">
                    {formatUsd(
                      savedVillas.reduce((acc, v) => acc + v.priceUsd, 0)
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          SIDE-BY-SIDE COMPARISON MODAL
         ========================================================= */}
      {showCompareModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCompareModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-[#111114] border border-white/15 rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#f4f2ee]">
                  {t.compareTitle}
                </h3>
                <p className="text-xs text-[#9c9890] mt-1">{t.compareHint}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                aria-label="Close comparison"
                className="w-9 h-9 flex items-center justify-center rounded-md border border-white/15 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              {comparedVillas.length === 0 ? (
                <p className="text-sm text-[#9c9890] py-8 text-center">
                  {t.compareHint}
                </p>
              ) : (
                <table className="w-full text-sm border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-start text-xs text-[#8f8b83] font-medium">
                        #
                      </th>
                      {comparedVillas.map((v) => (
                        <th key={v.id} className="py-3 px-4 text-start align-top">
                          <div className="aspect-[4/3] w-44 rounded-md overflow-hidden mb-3 bg-[#18181c]">
                            <ResilientVillaImage
                              src={v.image}
                              alt={isRtl ? v.nameAr : v.nameEn}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="font-semibold text-[#f4f2ee]">
                            {isRtl ? v.nameAr : v.nameEn}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCompare(v.id)}
                            className="mt-1 text-xs text-[#9c9890] hover:text-red-400 cursor-pointer"
                          >
                            {t.remove}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 tabular-nums">
                    <tr>
                      <td className="py-3.5 px-4 text-[#9c9890]">USD</td>
                      {comparedVillas.map((v) => (
                        <td
                          key={v.id}
                          className="py-3.5 px-4 font-bold text-[#d4b68a]"
                        >
                          {formatUsd(v.priceUsd)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 text-[#9c9890]">
                        {t.pricePerSqm}
                      </td>
                      {comparedVillas.map((v) => (
                        <td key={v.id} className="py-3.5 px-4">
                          {formatUsd(Math.round(v.priceUsd / v.livingAreaSqm))}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 text-[#9c9890]">
                        {t.builtArea}
                      </td>
                      {comparedVillas.map((v) => (
                        <td key={v.id} className="py-3.5 px-4">
                          {v.livingAreaSqm.toLocaleString('en-US')} m²
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 text-[#9c9890]">
                        {t.plotArea}
                      </td>
                      {comparedVillas.map((v) => (
                        <td key={v.id} className="py-3.5 px-4">
                          {v.plotAreaSqm.toLocaleString('en-US')} m²
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 text-[#9c9890]">
                        {t.bedrooms} / {t.bathrooms}
                      </td>
                      {comparedVillas.map((v) => (
                        <td key={v.id} className="py-3.5 px-4">
                          {v.bedrooms} / {v.bathrooms}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 text-[#9c9890]">
                        {isRtl ? 'الموقع' : 'Location'}
                      </td>
                      {comparedVillas.map((v) => (
                        <td key={v.id} className="py-3.5 px-4 text-[#c7c3bc]">
                          {isRtl ? v.locationAr : v.locationEn}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 text-[#9c9890]">
                        {isRtl ? 'الميزة الأبرز' : 'Signature'}
                      </td>
                      {comparedVillas.map((v) => (
                        <td key={v.id} className="py-3.5 px-4 text-[#c7c3bc]">
                          {isRtl ? v.signatureAssetAr : v.signatureAssetEn}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
