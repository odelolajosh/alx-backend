import { createClient, print } from 'redis';
import { promisify } from 'util';

/**
 * Connect to the Redis server
*/

const client = createClient();

client.on('error', (err) => {
  const msg = err.message || String(err);
  console.log(`Redis client not connected to the server: ${msg}`);
});

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print);
};

const displaySchoolValue = async (schoolName) => {
  console.log(await promisify(client.get).bind(client)(schoolName));
};

const main = async () => {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
};

client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});
