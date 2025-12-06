import { ProductProps } from 'src/products/domain/interfaces';

//forma de una categoria
export interface CategoryProps {
  id: number;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  products?: ProductProps[];
}
