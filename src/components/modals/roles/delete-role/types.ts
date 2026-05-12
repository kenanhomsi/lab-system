type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  role: {
    id: string;
    name: string;
  } | null;
};

export type { FactoryProps };
