import { Product, Size, SizesOnProduct } from '@prisma/client';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ProductColumn = {
  id: string;
  name: string;
  sizes: SizesOnProduct[];
};

export type CashierColumn = {
  name: string;
  size: string;
  price: number;
  qty: number;
  subtotal: number;
};

interface CashierCart {
  carts: CashierColumn[];
  addItem: (
    product: ProductColumn,
    size: SizesOnProduct,
    qty: number,
    price: number,
    subtotal: number,
  ) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CashierCart>(
    (set, get) => ({
      carts: [],
      removeAll: () => {
        set({
          carts: [],
        });
      },
      addItem: (
        product: ProductColumn,
        size: SizesOnProduct,
        qty: number,
        price: number,
        subtotal: number,
      ) => {
        let currentCart = get().carts;

        let currentItem = currentCart.findIndex(
          // @ts-ignore
          (e) => e.name == product.name && e.size == size.size.name,
        );

        console.log(currentItem);

        if (currentItem != -1) {
          currentCart[currentItem] = {
            name: currentCart[currentItem].name,
            size: currentCart[currentItem].size,
            qty: Number(currentCart[currentItem].qty) + Number(qty),
            price: currentCart[currentItem].price,
            subtotal:
              (Number(currentCart[currentItem].qty) + Number(qty)) *
              currentCart[currentItem].price,
          };
        } else {
          currentCart.push({
            name: product.name,
            // @ts-ignore
            size: size.size.name,
            qty,
            price,
            subtotal,
          });
        }

        set({
          carts: [...currentCart],
        });
      },
    }),
    {
      name: 'cart-cashier-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
