export interface CategoryNode {
  id: string;
  slug: string;
  name: string;
  children?: CategoryNode[];
}