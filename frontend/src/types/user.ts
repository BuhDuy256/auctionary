export interface User {
  id: string;
  email: string;
  name: string;
  // Thêm bất cứ trường nào mà API /auth/me trả về
  // vi_du: role: 'admin' | 'user';
}
