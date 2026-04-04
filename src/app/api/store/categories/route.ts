import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (isUpstreamReady) {
    try {
      const res = await fetch(`${backendUrl}/store/categories`, { cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json({ error: "Upstream request failed" }, { status: res.status });
      }
      return NextResponse.json(await res.json());
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  return NextResponse.json({
    categories: [
      {
        id: "collection-tubes",
        name: "Collection Tubes",
        nameAr: "أنابيب السحب",
        children: [
          { id: "edta-tubes", name: "EDTA Tubes", nameAr: "أنابيب EDTA" },
          { id: "serum-tubes", name: "Serum Tubes", nameAr: "أنابيب المصل" },
        ],
      },
      {
        id: "ppe",
        name: "PPE & Safety",
        nameAr: "معدات الوقاية",
        children: [
          { id: "gloves", name: "Gloves", nameAr: "قفازات" },
          { id: "masks", name: "Masks", nameAr: "كمامات" },
        ],
      },
      {
        id: "consumables",
        name: "Consumables",
        nameAr: "مستهلكات",
        children: [
          { id: "swabs", name: "Swabs & Wipes", nameAr: "مسحات ومناديل" },
          { id: "tourniquets", name: "Tourniquets", nameAr: "أربطة ضاغطة" },
        ],
      },
      {
        id: "needles",
        name: "Needles & Syringes",
        nameAr: "إبر ومحاقن",
        children: [
          { id: "butterfly", name: "Butterfly Needles", nameAr: "إبر فراشة" },
          { id: "syringes", name: "Syringes", nameAr: "محاقن" },
        ],
      },
      {
        id: "disposal",
        name: "Waste Disposal",
        nameAr: "التخلص من النفايات",
        children: [],
      },
      {
        id: "lab-equipment",
        name: "Lab Equipment",
        nameAr: "أجهزة مخبرية",
        children: [
          { id: "slides", name: "Slides & Coverslips", nameAr: "شرائح وأغطية" },
          { id: "pipettes", name: "Pipettes & Tips", nameAr: "ماصات ورؤوس" },
        ],
      },
    ],
  });
}
