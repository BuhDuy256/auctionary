export interface Category {
  slug: string,
  name: string,
  children: {
    slug: string,
    name: string,
  }[];
}