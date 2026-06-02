type Params = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  isSubmitting: false,
  setIsSubmitting: () => {},
  submit: async () => {},
});

export { store as stateStore };
