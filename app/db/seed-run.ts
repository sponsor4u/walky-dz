import { getDb } from "../api/queries/connection";
import { wilayas, storeSettings, products, categories, shippingZones, shippingProviders, communes } from "./schema";

const db = getDb();

const algerianWilayas = [
  { id: 1, code: 1, nameAr: "أدرار", nameFr: "Adrar", nameEn: "Adrar" },
  { id: 2, code: 2, nameAr: "الشلف", nameFr: "Chlef", nameEn: "Chlef" },
  { id: 3, code: 3, nameAr: "الأغواط", nameFr: "Laghouat", nameEn: "Laghouat" },
  { id: 4, code: 4, nameAr: "أم البواقي", nameFr: "Oum El Bouaghi", nameEn: "Oum El Bouaghi" },
  { id: 5, code: 5, nameAr: "باتنة", nameFr: "Batna", nameEn: "Batna" },
  { id: 6, code: 6, nameAr: "بجاية", nameFr: "Bejaia", nameEn: "Bejaia" },
  { id: 7, code: 7, nameAr: "بسكرة", nameFr: "Biskra", nameEn: "Biskra" },
  { id: 8, code: 8, nameAr: "بشار", nameFr: "Bechar", nameEn: "Bechar" },
  { id: 9, code: 9, nameAr: "البليدة", nameFr: "Blida", nameEn: "Blida" },
  { id: 10, code: 10, nameAr: "البويرة", nameFr: "Bouira", nameEn: "Bouira" },
  { id: 11, code: 11, nameAr: "تمنراست", nameFr: "Tamanrasset", nameEn: "Tamanrasset" },
  { id: 12, code: 12, nameAr: "تبسة", nameFr: "Tebessa", nameEn: "Tebessa" },
  { id: 13, code: 13, nameAr: "تلمسان", nameFr: "Tlemcen", nameEn: "Tlemcen" },
  { id: 14, code: 14, nameAr: "تيارت", nameFr: "Tiaret", nameEn: "Tiaret" },
  { id: 15, code: 15, nameAr: "تيزي وزو", nameFr: "Tizi Ouzou", nameEn: "Tizi Ouzou" },
  { id: 16, code: 16, nameAr: "الجزائر", nameFr: "Alger", nameEn: "Algiers" },
  { id: 17, code: 17, nameAr: "الجلفة", nameFr: "Djelfa", nameEn: "Djelfa" },
  { id: 18, code: 18, nameAr: "جيجل", nameFr: "Jijel", nameEn: "Jijel" },
  { id: 19, code: 19, nameAr: "سطيف", nameFr: "Setif", nameEn: "Setif" },
  { id: 20, code: 20, nameAr: "سعيدة", nameFr: "Saida", nameEn: "Saida" },
  { id: 21, code: 21, nameAr: "سكيكدة", nameFr: "Skikda", nameEn: "Skikda" },
  { id: 22, code: 22, nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbes", nameEn: "Sidi Bel Abbes" },
  { id: 23, code: 23, nameAr: "عنابة", nameFr: "Annaba", nameEn: "Annaba" },
  { id: 24, code: 24, nameAr: "قالمة", nameFr: "Guelma", nameEn: "Guelma" },
  { id: 25, code: 25, nameAr: "قسنطينة", nameFr: "Constantine", nameEn: "Constantine" },
  { id: 26, code: 26, nameAr: "المدية", nameFr: "Medea", nameEn: "Medea" },
  { id: 27, code: 27, nameAr: "مستغانم", nameFr: "Mostaganem", nameEn: "Mostaganem" },
  { id: 28, code: 28, nameAr: "المسيلة", nameFr: "M'Sila", nameEn: "M'Sila" },
  { id: 29, code: 29, nameAr: "معسكر", nameFr: "Mascara", nameEn: "Mascara" },
  { id: 30, code: 30, nameAr: "ورقلة", nameFr: "Ouargla", nameEn: "Ouargla" },
  { id: 31, code: 31, nameAr: "وهران", nameFr: "Oran", nameEn: "Oran" },
  { id: 32, code: 32, nameAr: "البيض", nameFr: "El Bayadh", nameEn: "El Bayadh" },
  { id: 33, code: 33, nameAr: "إليزي", nameFr: "Illizi", nameEn: "Illizi" },
  { id: 34, code: 34, nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arreridj", nameEn: "Bordj Bou Arreridj" },
  { id: 35, code: 35, nameAr: "بومرداس", nameFr: "Boumerdes", nameEn: "Boumerdes" },
  { id: 36, code: 36, nameAr: "الطارف", nameFr: "El Tarf", nameEn: "El Tarf" },
  { id: 37, code: 37, nameAr: "تندوف", nameFr: "Tindouf", nameEn: "Tindouf" },
  { id: 38, code: 38, nameAr: "تيسمسيلت", nameFr: "Tissemsilt", nameEn: "Tissemsilt" },
  { id: 39, code: 39, nameAr: "الوادي", nameFr: "El Oued", nameEn: "El Oued" },
  { id: 40, code: 40, nameAr: "خنشلة", nameFr: "Khenchela", nameEn: "Khenchela" },
  { id: 41, code: 41, nameAr: "سوق أهراس", nameFr: "Souk Ahras", nameEn: "Souk Ahras" },
  { id: 42, code: 42, nameAr: "تيبازة", nameFr: "Tipaza", nameEn: "Tipaza" },
  { id: 43, code: 43, nameAr: "ميلة", nameFr: "Mila", nameEn: "Mila" },
  { id: 44, code: 44, nameAr: "عين الدفلى", nameFr: "Ain Defla", nameEn: "Ain Defla" },
  { id: 45, code: 45, nameAr: "النعامة", nameFr: "Naama", nameEn: "Naama" },
  { id: 46, code: 46, nameAr: "عين تيموشنت", nameFr: "Ain Temouchent", nameEn: "Ain Temouchent" },
  { id: 47, code: 47, nameAr: "غرداية", nameFr: "Ghardaia", nameEn: "Ghardaia" },
  { id: 48, code: 48, nameAr: "غيليزان", nameFr: "Relizane", nameEn: "Relizane" },
  { id: 49, code: 49, nameAr: "تيميمون", nameFr: "Timimoun", nameEn: "Timimoun" },
  { id: 50, code: 50, nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar", nameEn: "Bordj Badji Mokhtar" },
  { id: 51, code: 51, nameAr: "أولاد جلال", nameFr: "Ouled Djellal", nameEn: "Ouled Djellal" },
  { id: 52, code: 52, nameAr: "بني عباس", nameFr: "Béni Abbès", nameEn: "Béni Abbès" },
  { id: 53, code: 53, nameAr: "عين صالح", nameFr: "In Salah", nameEn: "In Salah" },
  { id: 54, code: 54, nameAr: "عين قزام", nameFr: "In Guezzam", nameEn: "In Guezzam" },
  { id: 55, code: 55, nameAr: "توقرت", nameFr: "Touggourt", nameEn: "Touggourt" },
  { id: 56, code: 56, nameAr: "جانت", nameFr: "Djanet", nameEn: "Djanet" },
  { id: 57, code: 57, nameAr: "المغير", nameFr: "El M'Ghair", nameEn: "El M'Ghair" },
  { id: 58, code: 58, nameAr: "المنيعة", nameFr: "El Menia", nameEn: "El Menia" },
];

const sampleCategories = [
  { name: "إلكترونيات", slug: "electronics", description: "منتجات إلكترونية وأجهزة" },
  { name: "أزياء", slug: "fashion", description: "ملابس وأحذية وإكسسوارات" },
  { name: "منزل ومطبخ", slug: "home-kitchen", description: "منتجات المنزل والمطبخ" },
  { name: "صحة وجمال", slug: "health-beauty", description: "منتجات الصحة والتجميل" },
  { name: "رياضة", slug: "sports", description: "معدات رياضية وملابس" },
];

const sampleProducts = [
  {
    name: "طلاء عازل للماء PROELASTIC",
    slug: "proelastic-waterproof-coating",
    description: "طلاء عازل للماء عالي الجودة يحمي الأسطح من تسرب الماء. مناسب للأسطح الخرسانية والمعدنية.",
    shortDescription: "حماية فائقة ضد تسرب الماء",
    price: "1800.00",
    comparePrice: "2500.00",
    sku: "PRO-001",
    stockQuantity: 100,
    stockStatus: "in_stock" as const,
    hasVariants: false,
    seoTitle: "طلاء عازل للماء PROELASTIC",
    seoDescription: "اشترِ طلاء عازل للماء PROELASTIC بأفضل سعر",
    isActive: true,
    featured: true,
  },
  {
    name: "حذاء رياضي أسود فاخر",
    slug: "premium-black-sneakers",
    description: "حذاء رياضي أنيق بتصميم عصري. مريح للاستخدام اليومي.",
    shortDescription: "راحة وأناقة في كل خطوة",
    price: "4500.00",
    comparePrice: "6000.00",
    sku: "SHOE-001",
    stockQuantity: 50,
    stockStatus: "in_stock" as const,
    hasVariants: true,
    variantOptions: { colors: ["أسود", "أبيض", "رمادي"], sizes: ["40", "41", "42", "43", "44", "45"] },
    seoTitle: "حذاء رياضي أسود فاخر",
    seoDescription: "حذاء رياضي أسود فاخر بسعر مذهل",
    isActive: true,
    featured: true,
  },
  {
    name: "ساعة ذكية متعددة الوظائف",
    slug: "smart-watch-multifunction",
    description: "ساعة ذكية بشاشة لمس ملونة. تتبع النشاط الرياضي والصحة.",
    shortDescription: "تتبع صحتك ونشاطك يومياً",
    price: "3200.00",
    comparePrice: "4500.00",
    sku: "WATCH-001",
    stockQuantity: 30,
    stockStatus: "in_stock" as const,
    hasVariants: true,
    variantOptions: { colors: ["أسود", "فضي", "ذهبي"] },
    seoTitle: "ساعة ذكية متعددة الوظائف",
    seoDescription: "ساعة ذكية بمميزات رائعة",
    isActive: true,
    featured: true,
  },
];

const shippingPrices = algerianWilayas.map(w => ({
  wilayaId: w.id,
  homePrice: w.id <= 16 ? "600" : w.id <= 31 ? "700" : "900",
  deskPrice: w.id <= 16 ? "400" : w.id <= 31 ? "500" : "700",
}));

async function seed() {
  console.log("Starting seed...");

  await db.insert(storeSettings).values({
    storeName: "Walky DZ",
    primaryColor: "#2563EB",
    secondaryColor: "#1D4ED8",
    accentColor: "#F97316",
    fontFamily: "Cairo",
  });
  console.log("Store settings created");

  await db.insert(wilayas).values(algerianWilayas);
  console.log("Wilayas seeded");

  await db.insert(categories).values(sampleCategories);
  console.log("Categories seeded");

  for (let i = 0; i < sampleProducts.length; i++) {
    const p = sampleProducts[i];
    await db.insert(products).values({
      ...p,
      categoryId: (i % sampleCategories.length) + 1,
    });
  }
  console.log("Products seeded");

  await db.insert(shippingZones).values(shippingPrices);
  console.log("Shipping zones seeded");

  await db.insert(shippingProviders).values([
    { name: "Yalidine", isActive: true },
    { name: "Maystro Delivery", isActive: true },
    { name: "Zr Express", isActive: true },
  ]);
  console.log("Providers seeded");

  const majorWilayaCommunes: Record<number, string[]> = {
    16: ["الجزائر الوسطى", "باب الزوار", "الرويبة", "براقي", "الدرارية", "سيدي امحمد"],
    31: ["وهران", "عين الترك", "مسرغين", "بطيو", "السانية", "قديل"],
    25: ["قسنطينة", "خروبة", "عين السمارة", "بني حميدان", "الزيتون", "أولاد رحمون"],
    9: ["البليدة", "بوعينان", "بوفاريك", "الشفة", "العفرون", "وادي جر"],
    23: ["عنابة", "برحال", "الحجار", "العلمة", "البوني", "سيدي عمار"],
  };

  for (const [wilayaId, names] of Object.entries(majorWilayaCommunes)) {
    await db.insert(communes).values(
      names.map(name => ({ wilayaId: parseInt(wilayaId), nameAr: name, nameFr: name }))
    );
  }
  console.log("Communes seeded");

  console.log("Seed complete!");
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
