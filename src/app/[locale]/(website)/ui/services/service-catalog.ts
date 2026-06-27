import { getTranslations } from "next-intl/server";

export const serviceIds = ["patient", "doctor", "lab", "company"] as const;

export type ServiceId = (typeof serviceIds)[number];

export type ServiceMetricKey =
  | "labServices"
  | "digitalServices"
  | "carePillars"
  | "doctorReasons"
  | "partnerServices"
  | "featureBlocks";

export type ServiceDetailTextItem = {
  title: string;
  desc: string;
};

export type ServiceDetailSection =
  | {
      id: string;
      title?: string;
      description?: string;
      variant: "list";
      items: string[];
    }
  | {
      id: string;
      title?: string;
      description?: string;
      variant: "detail-grid";
      items: ServiceDetailTextItem[];
    };

export type ServiceMetric = {
  key: ServiceMetricKey;
  value: number;
};

export type ServiceCatalogItem = {
  id: ServiceId;
  title: string;
  summary: string;
  intro: string[];
  icon: string;
  image: string;
  previewItems: string[];
  metrics: ServiceMetric[];
  sections: ServiceDetailSection[];
};

type ServicePatientTranslation = {
  title: string;
  desc: string;
  labTitle: string;
  labItems: string[];
  elecTitle: string;
  elecDesc: string;
  elecItems: string[];
};

type ServiceDoctorTranslation = {
  title: string;
  desc1: string;
  desc2: string;
  axes: string[];
  whyTitle: string;
  whyItems: ServiceDetailTextItem[];
};

type ServiceLabTranslation = {
  title: string;
  desc: string;
  servicesTitle: string;
  servicesItems: string[];
  elecTitle: string;
  elecItems: ServiceDetailTextItem[];
};

type ServiceCompanyTranslation = {
  title: string;
  desc1: string;
  desc2: string;
  blocks: ServiceDetailTextItem[];
  elecTitle: string;
  elecDesc: string;
  elecItems: string[];
};

const SERVICE_VISUALS: Record<ServiceId, { icon: string; image: string }> = {
  patient: {
    icon: "personal_injury",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
  },
  doctor: {
    icon: "stethoscope",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200",
  },
  lab: {
    icon: "science",
    image: "/images/quality/quality-control-building.jpg",
  },
  company: {
    icon: "business",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
  },
};

function compactStrings(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value));
}

export function isServiceId(value: string): value is ServiceId {
  return serviceIds.includes(value as ServiceId);
}

export async function getServicesCatalog(locale: string): Promise<ServiceCatalogItem[]> {
  const t = await getTranslations({
    locale,
    namespace: "servicesPage.detailedCategories",
  });

  const patient = t.raw("patient") as ServicePatientTranslation;
  const doctor = t.raw("doctor") as ServiceDoctorTranslation;
  const lab = t.raw("lab") as ServiceLabTranslation;
  const company = t.raw("company") as ServiceCompanyTranslation;

  return [
    {
      id: "patient",
      title: patient.title,
      summary: patient.desc,
      intro: [patient.desc],
      icon: SERVICE_VISUALS.patient.icon,
      image: SERVICE_VISUALS.patient.image,
      previewItems: compactStrings([
        patient.labItems[0],
        patient.labItems[1],
        patient.elecItems[0],
      ]),
      metrics: [
        { key: "labServices", value: patient.labItems.length },
        { key: "digitalServices", value: patient.elecItems.length },
      ],
      sections: [
        {
          id: "lab-services",
          title: patient.labTitle,
          variant: "list",
          items: patient.labItems,
        },
        {
          id: "digital-services",
          title: patient.elecTitle,
          description: patient.elecDesc,
          variant: "list",
          items: patient.elecItems,
        },
      ],
    },
    {
      id: "doctor",
      title: doctor.title,
      summary: doctor.desc1,
      intro: [doctor.desc1, doctor.desc2],
      icon: SERVICE_VISUALS.doctor.icon,
      image: SERVICE_VISUALS.doctor.image,
      previewItems: doctor.axes.slice(0, 3),
      metrics: [
        { key: "carePillars", value: doctor.axes.length },
        { key: "doctorReasons", value: doctor.whyItems.length },
      ],
      sections: [
        {
          id: "care-pillars",
          variant: "list",
          items: doctor.axes,
        },
        {
          id: "why-us",
          title: doctor.whyTitle,
          variant: "detail-grid",
          items: doctor.whyItems,
        },
      ],
    },
    {
      id: "lab",
      title: lab.title,
      summary: lab.desc,
      intro: [lab.desc],
      icon: SERVICE_VISUALS.lab.icon,
      image: SERVICE_VISUALS.lab.image,
      previewItems: compactStrings([
        lab.servicesItems[0],
        lab.servicesItems[1],
        lab.elecItems[0]?.title,
      ]),
      metrics: [
        { key: "partnerServices", value: lab.servicesItems.length },
        { key: "digitalServices", value: lab.elecItems.length },
      ],
      sections: [
        {
          id: "partner-services",
          title: lab.servicesTitle,
          variant: "list",
          items: lab.servicesItems,
        },
        {
          id: "digital-services",
          title: lab.elecTitle,
          variant: "detail-grid",
          items: lab.elecItems,
        },
      ],
    },
    {
      id: "company",
      title: company.title,
      summary: company.desc1,
      intro: [company.desc1, company.desc2],
      icon: SERVICE_VISUALS.company.icon,
      image: SERVICE_VISUALS.company.image,
      previewItems: compactStrings([
        company.blocks[0]?.title,
        company.blocks[1]?.title,
        company.elecItems[0],
      ]),
      metrics: [
        { key: "featureBlocks", value: company.blocks.length },
        { key: "digitalServices", value: company.elecItems.length },
      ],
      sections: [
        {
          id: "company-features",
          variant: "detail-grid",
          items: company.blocks,
        },
        {
          id: "digital-services",
          title: company.elecTitle,
          description: company.elecDesc,
          variant: "list",
          items: company.elecItems,
        },
      ],
    },
  ];
}

export async function getServiceById(
  locale: string,
  id: string,
): Promise<ServiceCatalogItem | null> {
  if (!isServiceId(id)) {
    return null;
  }

  const services = await getServicesCatalog(locale);
  return services.find((service) => service.id === id) ?? null;
}
