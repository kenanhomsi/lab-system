import type { MedicalTest } from "@/types/test";

export const MOCK_MEDICAL_TESTS: MedicalTest[] = [
  {
    id: "test-cbc-001",
    slug: "cbc-complete-blood-count",
    nameEn: "CBC (Complete Blood Count)",
    nameAr: "تعداد الدم الكامل",
    category: "Hematology",
    categoryAr: "أمراض الدم",
    description:
      "Measures red blood cells, white blood cells, platelets, hemoglobin, and hematocrit to evaluate overall blood health and detect anemia, infection, or blood disorders.",
    descriptionAr:
      "يقيس كريات الدم الحمراء والبيضاء والصفائح الدموية والهيموجلوبين والهيماتوكريت لتقييم صحة الدم العامة والكشف عن فقر الدم أو العدوى أو اضطرابات الدم.",
    normalRanges:
      "Adults (typical): Hb 13.5–17.5 g/dL (M), 12.0–15.5 g/dL (F); WBC 4.5–11.0 ×10³/µL; PLT 150–450 ×10³/µL — المرجعية تختلف حسب العمر والمختبر.",
    preparation:
      "Usually no fasting required. Inform the lab if you are on blood thinners. Hydrate normally unless your doctor advises otherwise.",
    preparationAr:
      "عادة لا يلزم صيام. أخبر المختبر إذا كنت تتناول مميعات دم. اشرب سوائل بشكل طبيعي ما لم ينصحك طبيبك بخلاف ذلك.",
    relatedTestIds: ["test-crp-004", "test-fbs-002"],
    price: 85,
    requiredSample: "Venous blood (EDTA tube)",
    requiredSampleAr: "دم وريدي (أنبوب EDTA)",
    whatIsIt:
      "A panel of tests on a single blood sample that counts and characterizes your blood cells.",
    whatIsItAr: "مجموعة فحوصات على عينة دم واحدة تعدّ وتصف خصائص كريات الدم.",
    whenOrdered:
      "Routine checkups, fatigue, suspected anemia or infection, before surgery, or monitoring chemotherapy.",
    whenOrderedAr:
      "فحوصات دورية، إرهاق، اشتباه فقر دم أو عدوى، قبل العمليات، أو متابعة العلاج الكيميائي.",
    highMeaning:
      "Elevated WBC may suggest infection or inflammation; high RBC/Hb may relate to polycythemia; high platelets may need clinical correlation.",
    highMeaningAr:
      "ارتفاع كريات الدم البيضاء قد يشير لعدوى أو التهاب؛ ارتفاع الكريات الحمراء/الهيموجلوبين قد يرتبط بكثرة الحمر؛ ارتفاع الصفائح يحتاج تقييم سريري.",
    lowMeaning:
      "Low Hb/RBC suggests anemia; low WBC increases infection risk; low platelets may affect clotting.",
    lowMeaningAr:
      "انخفاض الهيموجلوبين/الكريات الحمراء يشير لفقر دم؛ انخفاض الكريات البيضاء يزيد خطر العدوى؛ انخفاض الصفائح قد يؤثر على التجلط.",
    seoTitle: "تعداد الدم الكامل CBC | المختبر",
    seoDescription: "حجز فحص تعداد الدم الكامل مع نصائح التحضير والمدى المرجعي.",
  },
  {
    id: "test-fbs-002",
    slug: "fbs-fasting-blood-sugar",
    nameEn: "FBS (Fasting Blood Sugar)",
    nameAr: "سكر الدم الصيامي",
    category: "Biochemistry",
    categoryAr: "الكيمياء الحيوية",
    description:
      "Measures glucose in the blood after an overnight fast to screen for diabetes, prediabetes, or monitor glycemic control.",
    descriptionAr:
      "يقيس الجلوكوز في الدم بعد صيام ليلي للكشف عن السكري أو ما قبل السكري أو متابعة التحكم بالسكر.",
    normalRanges:
      "Fasting plasma glucose: <100 mg/dL normal; 100–125 mg/dL IFG; ≥126 mg/dL suggests diabetes (confirm per guidelines) — الصيام 8–12 ساعة.",
    preparation:
      "Fast 8–12 hours: water only unless your doctor allows medications. Morning draw preferred.",
    preparationAr:
      "صيام 8–12 ساعة: الماء مسموح ما لم يمنع الطبيب. يُفضّل سحب العينة صباحاً.",
    relatedTestIds: ["test-hba1c-006", "test-cbc-001"],
    price: 35,
    requiredSample: "Venous blood (fluoride or serum per lab protocol)",
    requiredSampleAr: "دم وريدي (فلورايد أو مصل حسب بروتوكول المختبر)",
    whatIsIt: "A blood test for glucose level after fasting.",
    whatIsItAr: "فحص دم لمستوى الجلوكوز بعد الصيام.",
    whenOrdered: "Diabetes screening, symptoms of hyperglycemia, or monitoring treatment.",
    whenOrderedAr: "فحص السكري، أعراض فرط سكر الدم، أو متابعة العلاج.",
    highMeaning: "May indicate diabetes or prediabetes; correlate with HbA1c and symptoms.",
    highMeaningAr: "قد يدل على سكري أو ما قبل السكري؛ يُربط مع الخضاب السكري والأعراض.",
    lowMeaning: "Hypoglycemia possible; symptoms, timing of last meal, and medications matter.",
    lowMeaningAr: "احتمال نقص سكر الدم؛ الأعراض ووقت آخر وجبة والأدوية مهمة.",
    seoTitle: "سكر الدم الصيامي FBS | المختبر",
    seoDescription: "فحص سكر الدم الصيامي للكشف المبكر عن السكري.",
  },
  {
    id: "test-tsh-003",
    slug: "tsh-thyroid-stimulating-hormone",
    nameEn: "TSH (Thyroid Stimulating Hormone)",
    nameAr: "هرمون الغدة الدرقية",
    category: "Hormones",
    categoryAr: "الهرمونات",
    description:
      "Primary screening test for thyroid function; TSH from the pituitary regulates the thyroid gland.",
    descriptionAr:
      "فحص أولي لوظائف الغدة الدرقية؛ يفرز الهرمون المحفّز من النخامي وينظم نشاط الغدة الدرقية.",
    normalRanges:
      "Typical adult TSH ~0.4–4.0 mIU/L (lab-specific); pregnancy and age alter ranges — راجع تقرير المختبر.",
    preparation:
      "Usually no fasting. Take thyroid medication only as directed by your physician regarding timing of the draw.",
    preparationAr:
      "عادة دون صيام. تناول أدوية الغدة الدرقية حسب توجيه الطبيب بخصوص موعد سحب العينة.",
    relatedTestIds: [],
    price: 95,
    requiredSample: "Venous blood (serum)",
    requiredSampleAr: "دم وريدي (مصل)",
    whatIsIt: "Blood test measuring pituitary TSH to assess thyroid stimulation.",
    whatIsItAr: "فحص دم لقياس TSH النخامي لتقييم تحفيز الغدة الدرقية.",
    whenOrdered: "Fatigue, weight change, goiter, or monitoring levothyroxine therapy.",
    whenOrderedAr: "إرهاق، تغير وزن، تضخم درقي، أو متابعة علاج ليفوثيروكسين.",
    highMeaning: "Often suggests primary hypothyroidism when elevated; interpret with free T4 if ordered.",
    highMeaningAr: "غالباً يشير لقصور درقي أولي عند الارتفاع؛ يُفسَّر مع T4 الحر إن وُجد.",
    lowMeaning: "May indicate hyperthyroidism or overtreatment; clinical context required.",
    lowMeaningAr: "قد يدل على فرط نشاط درقي أو مبالغة في العلاج؛ يحتاج سياقاً سريرياً.",
    seoTitle: "فحص TSH الغدة الدرقية | المختبر",
    seoDescription: "فحص هرمون الغدة الدرقية المحفّز مع شرح النتائج.",
  },
  {
    id: "test-crp-004",
    slug: "crp-c-reactive-protein",
    nameEn: "CRP (C-Reactive Protein)",
    nameAr: "بروتين سي التفاعلي",
    category: "Immunology",
    categoryAr: "المناعة",
    description:
      "Marker of systemic inflammation; useful in evaluating infection, inflammatory conditions, and sometimes cardiovascular risk (hs-CRP).",
    descriptionAr:
      "دليل على التهاب جهازي؛ مفيد في تقييم العدوى والأمراض الالتهابية وأحياناً خطر القلب (hs-CRP).",
    normalRanges:
      "Conventional CRP: <10 mg/L often considered low; hs-CRP cardiovascular risk tiers differ — تفسير حسب نوع الفحص والمختبر.",
    preparation: "No fasting typically required.",
    preparationAr: "عادة لا يتطلب صياماً.",
    relatedTestIds: ["test-cbc-001"],
    price: 75,
    requiredSample: "Venous blood (serum)",
    requiredSampleAr: "دم وريدي (مصل)",
    whatIsIt: "Measures a liver-produced protein that rises with inflammation.",
    whatIsItAr: "يقيس بروتيناً تنتجه الكبد ويرتفع مع الالتهاب.",
    whenOrdered: "Suspected infection, inflammatory disease flare, or postoperative monitoring.",
    whenOrderedAr: "اشتباه عدوى، نوبة مرض التهابي، أو متابعة بعد العمليات.",
    highMeaning: "Nonspecific elevation; infection, autoimmune activity, or tissue injury possible.",
    highMeaningAr: "الارتفاع غير نوعي؛ قد يكون عدوى أو نشاط مناعي ذاتي أو إصابة نسيجية.",
    lowMeaning: "Low values usually reassuring but do not exclude all pathology.",
    lowMeaningAr: "القيم المنخفضة مطمئنة عادة لكنها لا تستبعد كل الأمراض.",
    seoTitle: "CRP بروتين سي التفاعلي | المختبر",
    seoDescription: "فحص CRP لتقييم الالتهاب والعدوى.",
  },
  {
    id: "test-urine-005",
    slug: "urine-analysis",
    nameEn: "Urine Analysis",
    nameAr: "تحليل البول",
    category: "Urinalysis",
    categoryAr: "تحليل البول",
    description:
      "Physical, chemical, and microscopic examination of urine to detect UTI, kidney disease, diabetes, and other conditions.",
    descriptionAr:
      "فحص فيزيائي وكيميائي ومجهري للبول للكشف عن التهاب المسالك، أمراض الكلى، السكري، وغيرها.",
    normalRanges:
      "Negative nitrites/leukocytes; pH ~4.5–8; specific gravity ~1.005–1.030; no significant protein/glucose/blood — حسب المختبر.",
    preparation:
      "Midstream clean-catch sample preferred; first morning urine optional; avoid contamination.",
    preparationAr:
      "يُفضّل عينة منتصف التبول بعد التنظيف؛ يمكن بول الصباح؛ تجنّب التلوث.",
    relatedTestIds: ["test-fbs-002"],
    price: 45,
    requiredSample: "Random or first-morning urine (sterile cup)",
    requiredSampleAr: "بول عشوائي أو صباحي (كوب معقم)",
    whatIsIt: "Laboratory analysis of a urine specimen for cells, chemistry, and concentration.",
    whatIsItAr: "تحليل مخبري لعينة بول للكريات والكيمياء والتركيز.",
    whenOrdered: "UTI symptoms, routine antenatal care, kidney evaluation, or diabetes screening adjunct.",
    whenOrderedAr: "أعراض التهاب مسالك، رعاية الحمل، تقييم الكلى، أو مساعد في فحص السكري.",
    highMeaning: "Positive leukocytes/nitrites suggest UTI; protein may indicate renal pathology; glucose suggests hyperglycemia.",
    highMeaningAr: "كريات بيضاء/نيتريت موجب يشير لالتهاب مسالك؛ بروتين قد يدل على أمراض كلى؛ جلوكوز يقترح فرط سكر.",
    lowMeaning: "Not typically interpreted as “low”; some constituents absent is expected in health.",
    lowMeaningAr: "لا يُفسَّر عادةً بـ«منخفض»؛ غياب بعض المكونات متوقع في الصحة.",
    seoTitle: "تحليل البول الشامل | المختبر",
    seoDescription: "تحليل بول شامل مع تعليمات جمع العينة.",
  },
  {
    id: "test-hba1c-006",
    slug: "hba1c-glycated-hemoglobin",
    nameEn: "HbA1c",
    nameAr: "الخضاب السكري",
    category: "Biochemistry",
    categoryAr: "الكيمياء الحيوية",
    description:
      "Reflects average blood glucose over ~2–3 months; key for diabetes diagnosis and long-term control monitoring.",
    descriptionAr:
      "يعكس متوسط سكر الدم على مدى نحو 2–3 أشهر؛ أساسي لتشخيص السكري ومتابعة التحكم طويل الأمد.",
    normalRanges:
      "ADA: <5.7% normal; 5.7–6.4% prediabetes; ≥6.5% diagnostic for diabetes (with confirmation rules) — معايير تشخيص حسب الجمعيات.",
    preparation: "No fasting required.",
    preparationAr: "لا يتطلب صياماً.",
    relatedTestIds: ["test-fbs-002"],
    price: 110,
    requiredSample: "Venous blood (EDTA)",
    requiredSampleAr: "دم وريدي (EDTA)",
    whatIsIt: "Measures percentage of hemoglobin glycated by glucose in red blood cells.",
    whatIsItAr: "يقيس نسبة الهيموجلوبين المرتبط بالجلوكوز في كريات الدم الحمراء.",
    whenOrdered: "Diabetes screening/diagnosis and quarterly/semiannual monitoring on therapy.",
    whenOrderedAr: "فحص أو تشخيص السكري ومتابعة كل 3–6 أشهر أثناء العلاج.",
    highMeaning: "Poorer average glycemic control; higher vascular complication risk over time.",
    highMeaningAr: "تحكم متوسط أسوأ بمرور الوقت؛ خطر مضاعفات أوعية أعلى.",
    lowMeaning: "Very low values may reflect rapid RBC turnover, certain anemias, or treatment effect—interpret clinically.",
    lowMeaningAr: "قيم منخفضة جداً قد تعكس دوراناً سريعاً لكريات حمر أو فقر دم أو تأثير علاج—تفسير سريري.",
    seoTitle: "فحص HbA1c الخضاب السكري | المختبر",
    seoDescription: "فحص الخضاب السكري لمتابعة متوسط السكر لشهور.",
  },
];

export function filterMockTests(search: string | null, category: string | null): MedicalTest[] {
  let list = [...MOCK_MEDICAL_TESTS];
  if (category?.trim()) {
    const c = category.trim().toLowerCase();
    list = list.filter(
      (t) =>
        t.category.toLowerCase() === c ||
        t.categoryAr.includes(category.trim()) ||
        t.slug.toLowerCase() === c,
    );
  }
  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (t) =>
        t.nameEn.toLowerCase().includes(q) ||
        t.nameAr.includes(search.trim()) ||
        t.category.toLowerCase().includes(q) ||
        t.categoryAr.includes(search.trim()) ||
        t.slug.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.descriptionAr.includes(search.trim()),
    );
  }
  return list;
}

export function getMockTestById(id: string): MedicalTest | undefined {
  return MOCK_MEDICAL_TESTS.find((t) => t.id === id || t.slug === id);
}

export interface MockOffer {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  discountPercent: number;
  originalPrice: number;
  discountedPrice: number;
  validFrom: string;
  validTo: string;
  testsIncluded: string[];
  imageHint: string;
}

export const MOCK_OFFERS: MockOffer[] = [
  {
    id: "offer-wellness-001",
    slug: "executive-wellness-panel",
    titleEn: "Executive wellness panel",
    titleAr: "باقة الصحة التنفيذية",
    summaryEn: "CBC, FBS, lipid profile add-on, and TSH — limited time.",
    summaryAr: "تعداد دم كامل، سكر صيامي، وTSH مع إضافة دهون — لفترة محدودة.",
    descriptionEn:
      "Designed for busy professionals: core blood work plus thyroid screening. Sample collection at all branches; results within 24–48h for most components.",
    descriptionAr:
      "مصممة للمهنيين: فحوصات دم أساسية وفحص درقي. سحب عينات في جميع الفروع؛ نتائج خلال 24–48 ساعة لمعظم المكونات.",
    discountPercent: 25,
    originalPrice: 420,
    discountedPrice: 315,
    validFrom: "2026-01-01",
    validTo: "2026-06-30",
    testsIncluded: ["test-cbc-001", "test-fbs-002", "test-tsh-003"],
    imageHint: "wellness-panel",
  },
  {
    id: "offer-diabetes-002",
    slug: "diabetes-awareness-bundle",
    titleEn: "Diabetes awareness bundle",
    titleAr: "باقة التوعية بالسكري",
    summaryEn: "FBS + HbA1c + urine analysis at a bundled rate.",
    summaryAr: "سكر صيامي + خضاب سكري + تحليل بول بسعر باقة.",
    descriptionEn:
      "Ideal for screening and follow-up. Includes counseling leaflet (Arabic) and optional nurse call for abnormal flags.",
    descriptionAr:
      "مثالية للفحص والمتابعة. تشمل نشرة إرشادية بالعربي واتصال اختياري من التمريض عند وجود مؤشرات غير طبيعية.",
    discountPercent: 20,
    originalPrice: 190,
    discountedPrice: 152,
    validFrom: "2026-03-01",
    validTo: "2026-12-31",
    testsIncluded: ["test-fbs-002", "test-hba1c-006", "test-urine-005"],
    imageHint: "diabetes-bundle",
  },
  {
    id: "offer-inflammation-003",
    slug: "inflammation-check",
    titleEn: "Inflammation check combo",
    titleAr: "باقة فحص الالتهاب",
    summaryEn: "CBC with differential focus plus CRP.",
    summaryAr: "تعداد دم مع تركيز على الالتهاب مع CRP.",
    descriptionEn:
      "When your physician suspects infection or inflammatory process, this pair offers complementary information at one visit.",
    descriptionAr:
      "عندما يشتبه الطبيب بعدوى أو عملية التهابية، توفر هذه المجموعة معلومات مكملة في زيارة واحدة.",
    discountPercent: 15,
    originalPrice: 160,
    discountedPrice: 136,
    validFrom: "2026-02-15",
    validTo: "2026-08-15",
    testsIncluded: ["test-cbc-001", "test-crp-004"],
    imageHint: "inflammation",
  },
];

export function getMockOfferById(id: string): MockOffer | undefined {
  return MOCK_OFFERS.find((o) => o.id === id || o.slug === id);
}

export interface MockVacantJob {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const MOCK_VACANT_JOBS: MockVacantJob[] = [
  {
    id: 1,
    titleEn: "Senior medical laboratory technologist",
    titleAr: "فني مختبر طبي أول",
    descriptionEn:
      "Perform and validate routine and specialized analyses, maintain QC records, and support accreditation activities.",
    descriptionAr:
      "تنفيذ واعتماد التحاليل الروتينية والمتخصصة، حفظ سجلات ضبط الجودة، ودعم أنشطة الاعتماد.",
    isActive: true,
    sortOrder: 0,
    createdAt: "2026-03-20T10:00:00.000Z",
    updatedAt: "2026-03-20T10:00:00.000Z",
  },
  {
    id: 2,
    titleEn: "Phlebotomist (home visit team)",
    titleAr: "أخصائي سحب عينات (زيارات منزلية)",
    descriptionEn:
      "Safe venous collection, labeling, and transport; educate patients on preparation; maintain cold chain for samples.",
    descriptionAr:
      "سحب وريدي آمن، تسمية ونقل العينات؛ توعية المرضى بالتحضير؛ الحفاظ على سلسلة التبريد للعينات.",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-03-28T08:30:00.000Z",
    updatedAt: "2026-03-28T08:30:00.000Z",
  },
];

export const MOCK_VACANT_JOBS_RESPONSE = {
  items: MOCK_VACANT_JOBS,
  page: 1,
  pageSize: 100,
  totalCount: MOCK_VACANT_JOBS.length,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

/** @deprecated Use MOCK_VACANT_JOBS_RESPONSE */
export const MOCK_VACANCIES = MOCK_VACANT_JOBS;

export function getMockVacantJobById(id: number | string): MockVacantJob | undefined {
  const n = typeof id === "string" ? Number(id) : id;
  return MOCK_VACANT_JOBS.find((v) => v.id === n);
}

export interface ContactSettingsMock {
  phone: string;
  phoneSecondary: string;
  email: string;
  whatsapp: string;
  addressEn: string;
  addressAr: string;
  workingHoursEn: string;
  workingHoursAr: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

export const MOCK_CONTACT_SETTINGS: ContactSettingsMock = {
  phone: "+966112345678",
  phoneSecondary: "+966112345679",
  email: "info@example-lab.sa",
  whatsapp: "+966501234567",
  addressEn: "King Fahd Road, Al Olaya, Riyadh 12213, Saudi Arabia",
  addressAr: "طريق الملك فهد، العليا، الرياض 12213، المملكة العربية السعودية",
  workingHoursEn: "Sun–Thu 7:00–22:00, Fri 14:00–20:00, Sat 8:00–18:00",
  workingHoursAr: "الأحد–الخميس 7:00–22:00، الجمعة 14:00–20:00، السبت 8:00–18:00",
  social: {
    facebook: "https://facebook.com/example-lab",
    instagram: "https://instagram.com/example_lab",
    twitter: "https://twitter.com/example_lab",
    linkedin: "https://linkedin.com/company/example-lab",
    youtube: "https://youtube.com/@example-lab",
  },
};
