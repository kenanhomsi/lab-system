export interface MedicalTest {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  normalRanges: string;
  preparation: string;
  preparationAr: string;
  relatedTestIds: string[];
  price: number;
  requiredSample: string;
  requiredSampleAr: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  whatIsIt?: string;
  whatIsItAr?: string;
  whenOrdered?: string;
  whenOrderedAr?: string;
  highMeaning?: string;
  highMeaningAr?: string;
  lowMeaning?: string;
  lowMeaningAr?: string;
}
