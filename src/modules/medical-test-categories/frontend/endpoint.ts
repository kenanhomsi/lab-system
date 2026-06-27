const base = "/category-medical";

const endpoint = {
  list: base,
  all: `${base}/all`,
  byId: (id: number) => `${base}/${id}`,
};

export { endpoint };
