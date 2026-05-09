export interface Patient {
  id?: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  phone: string;
  createdAt?: string;
}
