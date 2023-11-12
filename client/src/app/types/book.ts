export type Book = {
  _id: string;
  title: string;
  description: string;
  tags: string;
  imageUrl?: string;

  price: number;
  inventoryStatus: 'OUT_OF_STOCK' | 'HIGH_STOCK' | 'LOW_STOCK';
  stock: number;
  author: string;
  publisher?: string;

  createdAt: Date;
  updatedAt: Date;
};

export type BooksPaginationMetadata = {
  totalBooks: number;
  count: number;
};

export type BooksWithPagination = {
  metadata: BooksPaginationMetadata;
  data: Book[];
};
