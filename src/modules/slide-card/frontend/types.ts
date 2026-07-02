type FindAllSlideCardParams = {
  query?: {
    Page?: string;
    PageSize?: string;
  };
};

type FindAllPublicSlideCardParams = Record<string, never>;

type FindOneSlideCardParams = {
  id: string;
};

type CreateSlideCardParams = {
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

type UpdateSlideCardParams = Omit<CreateSlideCardParams, "image"> & {
  id: number;
  image?: File;
};

type DeleteSlideCardParams = {
  id: number;
};

export type {
  CreateSlideCardParams,
  DeleteSlideCardParams,
  FindAllPublicSlideCardParams,
  FindAllSlideCardParams,
  FindOneSlideCardParams,
  UpdateSlideCardParams,
};
