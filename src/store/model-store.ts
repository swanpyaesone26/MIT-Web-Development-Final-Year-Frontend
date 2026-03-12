import { create } from "zustand";

interface Option {
  title?: string;
  subtitle?: string;
  content: string | React.ReactNode;
  actions?: string | React.ReactNode;
  className?: string;
  noOverflow?: boolean;
  beforeClose?: () => boolean | Promise<boolean>;
}

interface ModalState {
  open: boolean;
  option: Option | undefined;
  closeModal: () => void;
  openModal: (option: Option) => void;
  setBeforeClose: (fn?: Option["beforeClose"]) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  option: undefined,
  openModal: (option: Option) => set({ option, open: true }),
  closeModal: () => {
    set({ open: false });
    setTimeout(() => set({ option: undefined }), 300);
  },
  setBeforeClose: (fn?: Option["beforeClose"]) =>
    set((state) => ({
      option: state.option
        ? { ...state.option, beforeClose: fn }
        : state.option,
    })),
}));