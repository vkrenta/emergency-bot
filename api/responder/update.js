const { updateResponder } = require('../../mongo/methods/responder');

module.exports = (req, res) => {
	if (!req.body.chat_id) {
		res.status(400).send({ message: 'Missed chat_id' });
	} else {
		updateResponder(req.params.responderId, req.body.chat_id)
			.then((data) => {
				if (data) {
					res.sendStatus(200);
				} else {
					res.status(400).send({ message: `Responder with id ${req.params.responderId} doesn\`t exist` });
				}
			})
			.catch((err) => {
				if (err.code === 11000) {
					res.status(400).send({ message: `Responder with chat_id ${req.body.chat_id} already exist` });
				} else {
					res.status(400).send(err);
				}
			});
	}
};