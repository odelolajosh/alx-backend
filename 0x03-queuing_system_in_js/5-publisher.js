import { createClient } from 'redis';

const publisher = createClient();

const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('holberton school channel', message);
  }, time);
};

publisher.on('error', (err) => {
  const msg = err.message || String(err);
  console.log(`Redis client not connected to the server: ${msg}`);
});

publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
