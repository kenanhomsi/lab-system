export interface Complaint {
  id: string;
  userId?: string;
  name: string;
  title: string;
  text: string;
  attachmentUrl?: string;
  status: "Pending" | "InReview" | "Resolved" | "Rejected";
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  userId?: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface ContactSettings {
  phone1: string;
  phone2: string;
  email: string;
  website: string;
  facebook?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
}
