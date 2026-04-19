type Params = {
  login: () => void;
  handleGoogleSignIn: () => void;
};

const store = (): Params => ({
  login: () => {},
  handleGoogleSignIn: () => {},
});
export { store as utilsStore };
