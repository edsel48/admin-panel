import {
  CashierColumn,
  ProductColumn,
} from '@/app/(dashboard)/cashier/components/columns';
import { Product, Size, SizesOnProduct } from '@prisma/client';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

        let duplicate = currentCart.find((e) => {
          e.name == product.name && e.size == size.size.name;
        });

        if (duplicate) {
          currentCart.map((e, i) => {
            if (i == currentCart.indexOf(duplicate)) {
              return {
                name: e.name,
                size: e.size,
                qty: e.qty + 1,
                price: e.price,
                subtotal: (e.qty + 1) * e.price,
              };
            }
          });
        } else {
          currentCart.push({
            name: product.name,
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
