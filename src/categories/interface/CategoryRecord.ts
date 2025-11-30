export type CategoryRecord = {
  id: number;
  name: string;
  slug: string;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  products?: any[];
};
