type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (value: boolean) => void;
  selectedRequestId: number | null;
  setSelectedRequestId: (value: number | null) => void;
  deleteTargetId: number | null;
  setDeleteTargetId: (value: number | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  isCreateModalOpen: false,
  setIsCreateModalOpen: () => {},
  isDetailModalOpen: false,
  setIsDetailModalOpen: () => {},
  selectedRequestId: null,
  setSelectedRequestId: () => {},
  deleteTargetId: null,
  setDeleteTargetId: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
