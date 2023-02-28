import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  const msg = err.message || String(err);
  console.log(`Redis client not connected to the server: ${msg}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('message', (channel, message) => {
  if (message === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
  if (channel === 'holberton school channel') {
    console.log(message);
  }
});

client.subscribe('holberton school channel');
