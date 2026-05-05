type FindAllSlideCardParams = {
  query?: {
    Page?: string;
    PageSize?: string;
  };
  token: string;
};

type FindAllPublicSlideCardParams = Record<string, never>;

type FindOneSlideCardParams = {
  id: string;
  token: string;
};

type CreateSlideCardParams = {
  token: string;
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

export type {
  CreateSlideCardParams,
  FindAllPublicSlideCardParams,
  FindAllSlideCardParams,
  FindOneSlideCardParams,
};
