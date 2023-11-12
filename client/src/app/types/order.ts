import { Book } from './book';

export type Order = {
  _id: string;
  transactionId: string;
  userId: string;
  userEmail: string;
  products: Book[];
  totalPrice: number;
  transactionDetails: any;
  status: 'PENDING' | 'CREATED' | 'CONFIRMED' | 'DECLINED';

  createdAt: Date;
  updatedAt: Date;
};

export type OrdersPaginationMetadata = {
  totalOrders: number;
  count: number;
};

export type OrdersWithPagination = {
  metadata: OrdersPaginationMetadata;
  data: Order[];
};
