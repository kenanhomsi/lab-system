type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  pageSize: number;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  pageSize: 20,
});

export { store as stateStore };
export type { Params as stateParams };
