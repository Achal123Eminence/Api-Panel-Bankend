import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
});

client.on('connect', () => {
  console.log('Connected to redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

await client.connect();

export default client;
