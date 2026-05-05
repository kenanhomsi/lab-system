export type SlideCardItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  discount: number;
  expiryDate: string;
  badge: string;
  detailPageLink: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
};

export type SlideCardsResponse = SlideCardItem[];

export type CreateSlideCardRequest = {
  title: string;
  description: string;
  price: number;
  discount: number;
  expiryDate: string;
  badge: string;
  detailPageLink: string;
  displayOrder: number;
  isActive: boolean;
  image: File;
};
