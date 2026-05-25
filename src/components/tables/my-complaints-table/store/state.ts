type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  isCreateModalOpen: false,
  setIsCreateModalOpen: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
