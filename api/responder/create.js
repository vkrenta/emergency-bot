const { createResponder } = require('../../mongo/methods/responder');

module.exports = (req, res) => {
	if (!req.body.chat_id || !req.body.responderId) {
		res.status(400).send({ message: 'Missed chat_id or responderId' });
	} else {
		createResponder(req.body.chat_id, req.body.responderId)
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			if (err.code === 11000) {
				res.status(400).send({ message: 'Responder with the same responderId or chat_id already exist' });
			} else {
				res.status(400).send(err);
			}
		});
	}
};