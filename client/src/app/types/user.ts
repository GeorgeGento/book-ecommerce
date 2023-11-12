export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verifiedEmail: boolean;
  phoneNumber: string;
  age: number;
  admin: boolean;

  createdAt: Date;
  updatedAt: Date;
};

export type UsersPaginationMetadata = {
  totalUsers: number;
  count: number;
};

export type UsersWithPagination = {
  metadata: UsersPaginationMetadata;
  data: User[];
};
