export interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
}

export interface CategoryResponse {
  data: CategoryNode[];
}
