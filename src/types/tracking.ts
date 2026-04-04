export type TrackingStep = "received" | "sampled" | "analyzing" | "ready";

export interface OrderTracking {
  appointmentId: string;
  currentStep: TrackingStep;
  steps: {
    step: TrackingStep;
    labelAr: string;
    labelEn: string;
    completedAt?: string;
  }[];
}

export interface AdBanner {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "gif";
  linkUrl: string;
  isActive: boolean;
}
