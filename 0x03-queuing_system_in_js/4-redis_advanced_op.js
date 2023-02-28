import { createClient, print } from 'redis';

/**
 * Connect to the Redis server
*/

const client = createClient();

client.on('error', (err) => {
  const msg = err.message || String(err);
  console.log(`Redis client not connected to the server: ${msg}`);
});

const main = () => {
  const object = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };
  Object.keys(object).forEach((key) => {
    client.hset('HolbertonSchools', key, object[key], print);
  });
  client.hgetall('HolbertonSchools', (_err, res) => console.log(res));
};

client.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});
