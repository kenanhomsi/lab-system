/** Approximate coordinates for Damascus branches (OpenStreetMap). Refine via geocoding if needed. */
export type ContactBranch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  mobile: string;
  shortCode: string;
  lat: number;
  lng: number;
};

export const CONTACT_BRANCHES: ContactBranch[] = [
  {
    id: "jisr",
    name: "الفرع 1: الجسر الأبيض",
    address: "سوريا - دمشق - الجسر الأبيض - شارع نسيب البكري",
    phone: "011-3340604",
    mobile: "0991828342",
    shortCode: "9547",
    lat: 33.5192,
    lng: 36.2878,
  },
  {
    id: "midan",
    name: "الفرع 2: كورنيش الميدان",
    address: "سوريا - دمشق - كورنيش الميدان",
    phone: "011-3340604",
    mobile: "0991828342",
    shortCode: "9547",
    lat: 33.5089,
    lng: 36.3042,
  },
];
