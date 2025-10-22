import type { User } from '$domain/user';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'password',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: 'password',
    role: 'user'
  }
];

export function findUser(username: string, password: string): User | null {
  const found = mockUsers.find
  (
    (u) => u.username === username && u.password === password
  );
  return found ? { ...found, token: `token-${Date.now()}` } : null;
}
