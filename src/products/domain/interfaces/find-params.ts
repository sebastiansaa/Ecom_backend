import { ProductSort } from '../dto/find-all-query.dto';

export type FindAllParams = {
  take?: number; // límite de resultados
  skip?: number; // offset para paginación (default 0)
  q?: string; // búsqueda por título o descripción (case-insensitive)
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  sort?: ProductSort;
};
//- Este tipo define los parámetros de búsqueda/paginación que tu repositorio o "servicio" aceptará.
