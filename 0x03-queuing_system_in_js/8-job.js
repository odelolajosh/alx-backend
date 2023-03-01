const createPushNotificationsJobs = (data, queue) => {
	if (!Array.isArray(data)) {
		throw new Error("Jobs is not an array")
	}
	for (const item of data) {
		const job = queue.create('push_notification_code_3', item);

		job.on('enqueue', () => {
			console.log('Notification job created:', job.id);
		});

		job.on('complete', () => {
			console.log(`Notification job ${job.id} completed`);
		});

		job.on('failed', (err) => {
			console.log(`Notification job ${job.id} failed: ${err}`);
		});

		job.on('progress', (progress) => {
			console.log(`Notification job ${job.id} ${progress}% complete`);
		});

		job.save();
	}
};

export default createPushNotificationsJobs;
