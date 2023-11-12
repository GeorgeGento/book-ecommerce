import { Book } from './book';

export type Cart = {
  items: CartItem[];
};

export type CartItem = Book & {
  quantity: number;
};
