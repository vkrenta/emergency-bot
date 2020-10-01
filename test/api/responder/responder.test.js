process.env.DATABASE_NAME = 'unit-test';
const app = require('../../../index');
const request = require('supertest');
const { serverEvent } = require('../../../helpers/enums');
const { responderModel } = require('../../../mongo/model');

describe('responder CRUD', function () {
	this.timeout(5000);
	before(done => {
		app.on(serverEvent.serviceOnline, () => done());
	});

	const secret = process.env.secret;
	const chat_id = 'testChatId';
	const responderId = 'testResponderId';
	const updatedChatId = 'updatedChatId';
	const wrongChatId = 'wrongChatId';
	const wrongResponderId = 'wrongResponderId';

	describe('POST /api/responders', function () {
		it('should has status code 200 if responder was created successfully', function (done) {
			request(app)
				.post('/api/responders')
				.send({ secret, chat_id, responderId })
				.expect(200)
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if responder with the same responderId or chat_id already exist', function (done) {
			request(app)
				.post('/api/responders')
				.send({ secret, chat_id, responderId })
				.expect(400)
				.expect({ message: 'Responder with the same responderId or chat_id already exist' })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if we doesn\'t send secret', function (done) {
			request(app)
				.post('/api/responders')
				.send({ chat_id, responderId })
				.expect(400)
				.expect({ message: 'Wrong secret in body' })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if we doesn\'t send responderId or chat_id', function (done) {
			request(app)
				.post('/api/responders')
				.send({ secret })
				.expect(400)
				.expect({ message: 'Missed chat_id or responderId' })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should check that responder was created in the database', function (done) {
			responderModel.findOne({ chatId: chat_id }).exec()
				.then(res => {
					if (res && res.chatId === chat_id && res.responderId === responderId) {
						done();
					} else {
						done(new Error('Can\'t find responder in the database'));
					}
				})
				.catch(err => done(err));
		});
	});

	describe('GET /api/responders?chat_id=', function () {
		it('should has status code 200 if responder was received successfully', function (done) {
			request(app)
				.get(`/api/responders?chat_id=${chat_id}`)
				.expect(200)
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if chat_id is wrong', function (done) {
			request(app)
				.get(`/api/responders?chat_id=${wrongChatId}`)
				.expect(400)
				.expect({ message: `Responder with id ${wrongChatId} doesn\`t exist` })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has response with one responder', function (done) {
			request(app)
				.get(`/api/responders?chat_id=${chat_id}`)
				.expect(200)
				.expect(res => {
					if (!('chatId' in res.body)) throw new Error('missing chatId');
					if (!('responderId' in res.body)) throw new Error('missing responderId');
					if (res.body.chatId !== chat_id) throw new Error('response chatId is wrong');
					if (res.body.responderId !== responderId) throw new Error('response responderId is wrong');
				})
				.then(() => done())
				.catch(err => done(err));
		});
	});

	describe('GET /api/responders', function () {
		it('should has status code 200 if responders were received successfully', function (done) {
			request(app)
				.get('/api/responders')
				.expect(200)
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has response with array of responders', function (done) {
			request(app)
				.get('/api/responders')
				.expect(200)
				.expect(res => {
					if (!res.body.length) throw new Error('result must contain responder(s)');
					if (!('chatId' in res.body[0])) throw new Error('missing chatId');
					if (!('responderId' in res.body[0])) throw new Error('missing responderId');
				})
				.then(() => done())
				.catch(err => done(err));
		});
	});

	describe('PUT /api/responders/:responderId', function () {
		it('should has status code 200 if responder was updated successfully', function (done) {
			request(app)
				.put(`/api/responders/${responderId}`)
				.send({ secret, chat_id: updatedChatId })
				.expect(200)
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if we doesn\'t send secret', function (done) {
			request(app)
				.put(`/api/responders/${responderId}`)
				.send({ chat_id: updatedChatId })
				.expect(400)
				.expect({ message: 'Wrong secret in body' })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if we doesn\'t send chat_id', function (done) {
			request(app)
				.put(`/api/responders/${responderId}`)
				.send({ secret })
				.expect(400)
				.expect({ message: 'Missed chat_id' })
				.then(() => done())
				.catch((err) => done(err));
		});

		it('should has status code 400 if responderId is wrong', function (done) {
			request(app)
				.put(`/api/responders/${wrongResponderId}`)
				.send({ secret, chat_id: updatedChatId })
				.expect(400)
				.expect({ message: `Responder with id ${wrongResponderId} doesn\`t exist` })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if responder with the same chat_id already exist', function (done) {
			new responderModel({ responderId: 'tempResponderId', chatId: 'tempChatId' }).save()

			request(app)
				.put(`/api/responders/${responderId}`)
				.send({ secret, chat_id: 'tempChatId' })
				.expect(400)
				.expect({ message: 'Responder with chat_id tempChatId already exist' })
				.then(() => {
					responderModel.findOneAndDelete({ responderId: 'tempResponderId' }).exec();
					done();
				})
				.catch(err => {
					responderModel.findOneAndDelete({ responderId: 'tempResponderId' }).exec();
					done(err);
				});
		});

		it('should check that responder was updated in the database', function (done) {
			responderModel.findOne({ chatId: updatedChatId }).exec()
				.then(res => {
					if (res && res.chatId === updatedChatId && res.responderId === responderId) {
						done();
					} else {
						done(new Error('Responder hasn\'t been updated in the database'));
					}
				})
				.catch(err => done(err));
		});
	});

	describe('DELETE /api/responders/:responderId', function () {
		it('should has status code 200 if responder was deleted successfully', function (done) {
			request(app)
				.delete(`/api/responders/${responderId}`)
				.send({ secret })
				.expect(200)
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if we doesn\'t send secret', function (done) {
			request(app)
				.delete(`/api/responders/${responderId}`)
				.send({})
				.expect(400)
				.expect({ message: 'Wrong secret in body' })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should has status code 400 if responderId is wrong', function (done) {
			request(app)
				.delete(`/api/responders/${wrongResponderId}`)
				.send({ secret })
				.expect(400)
				.expect({ message: `Responder with id ${wrongResponderId} doesn\`t exist` })
				.then(() => done())
				.catch(err => done(err));
		});

		it('should check that responder was deleted from the database', function (done) {
			responderModel.findOne({ chatId: updatedChatId }).exec()
				.then(res => {
					if (res === null) {
						done();
					} else {
						done(new Error('Responder hasn\'t been deleted from the database'));
					}
				})
				.catch(err => done(err));
		});
	});
});