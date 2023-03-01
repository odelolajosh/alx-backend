import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util'

let reservationEnabled = true;
const PORT = 1245, HOST = 'localhost';

const redisClient = redis.createClient();
const QUEUE = kue.createQueue();

const reserveSeat = (number) => {
	redisClient.set('available_seats', number);
}

const asyncGet = promisify(redisClient.get).bind(redisClient);

const getAvailableSeats = async () => {
	const availableSeats = await asyncGet('available_seats');
	return parseInt(availableSeats);
}

const app = express();

app.get('/available_seats', async (req, res) => {
	const numberOfAvailableSeats = await getAvailableSeats();
	res.json({ numberOfAvailableSeats });
});

app.get('/reserve_seat', async (req, res) => {
	if (!reservationEnabled) {
		return res.status(403).json({ status: 'Reservation are blocked' });
	}
	const job = QUEUE.createJob('reserve_seat');
	job.on('complete', () => {
		console.log(`Seat reservation job ${job.id} completed`);
	});
	job.on('failed', (err) => {
		console.log(`Seat reservation job ${job.id} failed: ${err}`);
	});
	job.save((err) => {
		if (err) {
			return res.json({ status: 'Reservation failed' });
		}
		return res.json({ status: 'Reservation in process' });
	});
});

app.get('/process', (req, res) => {
	QUEUE.process('reserve_seat', async (_job, done) => {
		const availableSeats = await getAvailableSeats();
		if (availableSeats > 0) {
			reserveSeat(availableSeats - 1);
			done();
		} else {
			reservationEnabled = false;
			done(new Error('Not enough seats available'));
		}
	});
	res.json({ status: 'Queue processing' });
});


reserveSeat(50);
app.listen(PORT, HOST, () => {
	console.log(`Running on http://${HOST}:${PORT}`);
});

export default app;
