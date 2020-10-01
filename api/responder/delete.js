const { deleteResponder } = require('../../mongo/methods/responder');

module.exports = (req, res) => {
	deleteResponder(req.params.responderId)
		.then((data) => {
			if (data) {
				res.sendStatus(200);
			} else {
				res.status(400).send({ message: `Responder with id ${req.params.responderId} doesn\`t exist` });
			}
		})
		.catch((err) => {
			res.status(400).send(err);
		});
};