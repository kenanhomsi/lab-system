type Params = {
  initDone: boolean;
};

const store = (): Params => ({
  initDone: false,
});

export { store as initStore };
