import { type NextRequest, NextResponse } from "next/server";

const MOCK_PRODUCTS = [
  {
    id: "prod-001",
    name: "EDTA Vacutainer Tubes (100 pcs)",
    nameAr: "أنابيب سحب دم EDTA (100 قطعة)",
    category: "collection-tubes",
    price: 4500,
    unit: "Box",
    unitAr: "علبة",
    discount: 10,
    inStock: true,
    image: null,
  },
  {
    id: "prod-002",
    name: "Serum Separator Tubes (100 pcs)",
    nameAr: "أنابيب فصل المصل (100 قطعة)",
    category: "collection-tubes",
    price: 5200,
    unit: "Box",
    unitAr: "علبة",
    discount: 0,
    inStock: true,
    image: null,
  },
  {
    id: "prod-003",
    name: "Latex Examination Gloves (M)",
    nameAr: "قفازات فحص لاتكس (وسط)",
    category: "ppe",
    price: 3800,
    unit: "Box (100 pcs)",
    unitAr: "علبة (100 قطعة)",
    discount: 5,
    inStock: true,
    image: null,
  },
  {
    id: "prod-004",
    name: "Nitrile Gloves Powder-Free (L)",
    nameAr: "قفازات نيتريل بدون بودرة (كبير)",
    category: "ppe",
    price: 4200,
    unit: "Box (100 pcs)",
    unitAr: "علبة (100 قطعة)",
    discount: 0,
    inStock: true,
    image: null,
  },
  {
    id: "prod-005",
    name: "Alcohol Swabs (200 pcs)",
    nameAr: "مسحات كحول (200 قطعة)",
    category: "consumables",
    price: 1500,
    unit: "Pack",
    unitAr: "عبوة",
    discount: 0,
    inStock: true,
    image: null,
  },
  {
    id: "prod-006",
    name: "Tourniquet (Reusable)",
    nameAr: "رباط ضاغط (قابل لإعادة الاستخدام)",
    category: "consumables",
    price: 800,
    unit: "Piece",
    unitAr: "قطعة",
    discount: 15,
    inStock: true,
    image: null,
  },
  {
    id: "prod-007",
    name: "Butterfly Needle 23G (50 pcs)",
    nameAr: "إبرة فراشة 23G (50 قطعة)",
    category: "needles",
    price: 3200,
    unit: "Box",
    unitAr: "علبة",
    discount: 0,
    inStock: false,
    image: null,
  },
  {
    id: "prod-008",
    name: "Sharps Disposal Container 5L",
    nameAr: "حاوية التخلص من الأدوات الحادة 5 لتر",
    category: "disposal",
    price: 2800,
    unit: "Piece",
    unitAr: "قطعة",
    discount: 0,
    inStock: true,
    image: null,
  },
  {
    id: "prod-009",
    name: "Microscope Slides (72 pcs)",
    nameAr: "شرائح مجهرية (72 قطعة)",
    category: "lab-equipment",
    price: 1200,
    unit: "Box",
    unitAr: "علبة",
    discount: 0,
    inStock: true,
    image: null,
  },
  {
    id: "prod-010",
    name: "Pipette Tips 200µL (1000 pcs)",
    nameAr: "رؤوس ماصة 200 ميكرولتر (1000 قطعة)",
    category: "lab-equipment",
    price: 6500,
    unit: "Bag",
    unitAr: "كيس",
    discount: 8,
    inStock: true,
    image: null,
  },
];

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const target = new URL(`${backendUrl}/store/products`);
      request.nextUrl.searchParams.forEach((value, key) => {
        target.searchParams.set(key, value);
      });
      const res = await fetch(target.toString(), { cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json({ error: "Upstream request failed" }, { status: res.status });
      }
      return NextResponse.json(await res.json());
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  const category = request.nextUrl.searchParams.get("category");
  const filtered = category
    ? MOCK_PRODUCTS.filter((p) => p.category === category)
    : MOCK_PRODUCTS;

  return NextResponse.json({ products: filtered });
}
