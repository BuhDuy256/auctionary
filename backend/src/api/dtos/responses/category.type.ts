export interface Category {
  id: number;
  slug: string;
  name: string;
  children: {
    id: number;
    slug: string;
    name: string;
  }[];
}
