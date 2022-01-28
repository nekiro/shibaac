export const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3000' : 'https://x';
export const sessionPassword = 'complex_password_at_least_32_characters_long';
export const dbCredentials = {
  host: '127.0.0.1',
  port: 3306,
  database: 'test_db',
  user: 'root',
  password: '',
};
export const protocolStatus = {
  host: '127.0.0.1',
  port: 7171,
};
