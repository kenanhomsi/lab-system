export interface Offer {
  id: string;
  image: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  fullDescriptionAr: string;
  fullDescriptionEn: string;
  expiryDate: string;
  originalPrice: number;
  discountedPrice: number;
  isActive: boolean;
}
