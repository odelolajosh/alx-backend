import kue from "kue";
import { expect } from "chai";
import createPushNotificationsJobs from "./8-job";

describe('createPushNotificationsJobs', function() {
	const QUEUE = kue.createQueue();

	before(function() {
		QUEUE.testMode.enter(true);
	});

	after(function() {
		QUEUE.testMode.exit();
	});

	it('displays an error message if jobs is not an array', function() {
		expect(
			createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, QUEUE)
			).to.throw("Jobs is not an array");
	});

	it('creates two new jobs to the queue', function() {
		expect(QUEUE.testMode.jobs.length).to.be.equal(0);

		const jobs = [
			{ phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
			{ phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' }
		];

		createPushNotificationsJobs(jobs, QUEUE);

		expect(QUEUE.testMode.jobs.length).to.equal(2);
		expect(QUEUE.testMode.jobs.every((job) => {
			return job.type === 'push_notification_code_3';
		})).to.be.true;
		expect(QUEUE.testMode.jobs[0].data).to.deep.equal(jobs[0]);
		expect(QUEUE.testMode.jobs[1].data).to.deep.equal(jobs[1]);
	});
});
