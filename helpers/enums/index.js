module.exports.serverEvent = {
  serverOnline: 'server online',
  serviceOnline: 'service online',
  mongo: {
    connected: 'mongo connected',
    error: 'mongo error'
  }
};

module.exports.messageTypes = {
  simpleMessage: 'simpleMessage',
  withKeyboard: 'withKeyboard',
  location: 'location'
};

module.exports.callbackQueryType = {
  status: {
    responder: {
      set: 'set responder status',
      choose: 'choose responder status'
    },
    card: {
      choose: 'choose card status',
      showOnMap: 'card show on map'
    }
  }
};

module.exports.telegramMessageTypes = {
  message: 'message',
  callback_query: 'callback_query'
};

module.exports.telegramMessageHandlers = {
  message: {
    getUserChatId: pack => pack.message.from.id,
    getText: pack => pack.message.text
  },
  callback_query: {
    getUserChatId: pack => pack.callback_query.from.id,
    getQuery: pack => pack.callback_query.data
  }
};

module.exports.responderStatus = {
  ready: 'Ready',
  busy: 'Busy',
  offduty: 'Offduty'
};

module.exports.cardStatus = {
  accepted: { name: 'Прийнято ✅', value: 'Accepted' },
  arrived: { name: 'На місці', value: 'Arrived' },
  finished: { name: 'Завершено', value: 'Finished' },
  rejected: { name: 'Відхилено 🚫', value: 'Rejected' }
};

module.exports.callCardStatus = {
  delivered: { name: 'Доставлено', value: 'Delivered' },
  sent: { name: 'Відправлено', value: 'Sent' }
};

// module.exports.setCardStatusText = 'Обрати статус виклику';
// module.exports.chooseRigthStatus = 'Оберіть, будь ласка, один із пропонованих варіантів статусу';

// module.exports.buttonTextAllRight = 'Так, все вірно';
// module.exports.buttonTextReenter = 'Ні, хочу ввести повторно';

module.exports.buttonTexts = {
  setCardStatusText: 'Обрати статус виклику',
  chooseRigthStatus:
    'Оберіть, будь ласка, один із пропонованих варіантів статусу',
  allRight: 'Так, все вірно',
  iWantReenter: 'Ні, хочу ввести повторно',
  needEdit: 'Ні, потрібне редагування',
  skipEnter: 'Пропустити',
  next: 'Наступні',
  prev: 'Попередні',
  man: 'Чоловіча',
  woman: 'Жіноча',
  Continue: 'Продовжити'
};

module.exports.diagnosis = [
  { code: '19-1b1c-00', text: 'Біль в грудях' },
  { code: '3-1b1c-00', text: 'Проблеми з диханням' },
  { code: '5-1b1c-00', text: 'Травматичні ушкодження' },
  { code: '12-1b1c-00', text: 'Гостре отруєння' },
  { code: '15-1b1c-00', text: 'ДТП' },
  { code: '17-1b1c-00', text: 'Алергічна реакція' },
  { code: '22-1b1c-00', text: 'Інфекційні захворювання' },
  { code: '24-1b1c-00', text: 'Непритомність/порушення свідомості' },
  { code: '31-1b1c-00', text: 'Інше' }
];

module.exports.chatBotAPI = {
  respondersStatusUrl: (responderId, status) => {
    return {
      method: 'PUT',
      uri: `${process.env.CHAT_BOT_URL}/api/responder/${responderId}/`,
      body: {
        Responder: { status }
      }
    };
  },
  callStatusUrl: (responderId, callStatus, callCardId, status) => {
    return {
      method: 'PUT',
      uri: `${process.env.CHAT_BOT_URL}/api/responder/${responderId}/`,
      body: {
        Responder: {
          status,
          call_card_id: callCardId,
          call_status: callStatus,
          event_datetime: new Date().toISOString().slice(0, -1)
        }
      }
    };
  },
  sendReportURL: (responderId, callCardId, time, session) => {
    const name = ['family_name', 'first_name', 'middle_name'];
    return {
      method: 'PUT',
      uri: `${process.env.CHAT_BOT_URL}/api/responder/${responderId}/`,
      body: {
        Report: {
          responder_id: responderId,
          call_card_id: callCardId,
          event_datetime: time,
          patient: {
            first_name: session.patientName,
            // ...session.patientName /*ctx.session.patientName*/
            //   .split(' ')
            //   .filter(e => e != '')
            //   .reduce((acc, cur, i) => {
            //     acc[name[i]] = cur;
            //     return acc;
            //   }, {}),
            age: session.patientAge,
            sex: session.patientGender
          },
          diagnosis: session.patientDiagnosis,
          help_provided: session.patientHelp.join(',').slice(0, -1),
          help_comment: session.patientHelpComment,
          er_result: session.patientResult,
          complain: '#'
        }
      }
    };
  }
};

module.exports.getChatIdFromBody = function(req) {
  id = Number(req.body.chatId);
  return id;
};
module.exports.getResponderIdFromBody = function(req) {
  responderId = req.body.responderId;
  return responderId;
};
