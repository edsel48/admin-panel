import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useStoreModal = create(
  persist<useStoreModalStore>(
    (set) => ({
      isOpen: false,
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-cashier-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
