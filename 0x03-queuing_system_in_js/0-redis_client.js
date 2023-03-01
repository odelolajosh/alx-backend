import { createClient } from 'redis';

/**
 * Connect to the Redis server
*/

const client = createClient();

client.on('error', (err) => {
  const msg = err.message || String(err);
  console.log(`Redis client not connected to the server: ${msg}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});
