export const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3000' : 'https://x';
export const protocolStatus = {
  host: '127.0.0.1',
  port: 7171,
};
