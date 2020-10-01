const { Markup } = require('telegraf');

const startKeyboard = Markup.keyboard(['Розпочати заповнення форми'])
  .oneTime()
  .resize()
  .extra();

const confirmKeyboard = Markup.keyboard([['Так, все вірно'], ['Ні, хочу ввести повторно']])
  .oneTime()
  .resize()
  .extra();

const skipKeyboard = Markup.keyboard([[`Пропустити`]])
  .oneTime()
  .resize()
  .extra();

const continueKeyboard = Markup.keyboard([[`Продовжити`]])
  .oneTime()
  .resize()
  .extra();

const getPatientGenderKeyboard = Markup.keyboard(['Чоловіча', 'Жіноча'])
  .oneTime()
  .resize()
  .extra();

function toChunks(array, chunk) {
  const result = [];
  for (i = 0, j = array.length; i < j; i += chunk) {
    result.push(array.slice(i, i + chunk));
  }
  return result;
}

// const btnValues = ['Кардіостимуляція', 'Дефібріляція', 'Компресія грудної клітини', 'Джгут', 'Імболізація', "Пов'язка"];
// const getPatientHelpKeyboard = Markup.keyboard([...toChunks(btnValues), ['Перейти до наступного кроку']])
//   .oneTime()
//   .resize()
//   .extra();
// const getPatientHelpKeyboard = Markup.inlineKeyboard([...toChunks(btnValues, 2), ['Перейти до наступного кроку']]);

const givenHelp = new Map();
givenHelp.set('cardio', 'Кардіостимуляція');
givenHelp.set('defibrillation', 'Дефібріляція');
givenHelp.set('compression', 'Компресія грудної клітини');
givenHelp.set('plait', 'Джгут');
givenHelp.set('imbolization', 'Імболізація');
givenHelp.set('bandage', 'Пов\'язка');
givenHelp.set('nextStep', 'Перейти до наступного кроку');

  const getPatientHelpKeyboard = [[
    { text: givenHelp.get('cardio'), hide: false, callback_data: 'cardio' },
    { text: givenHelp.get('defibrillation'), hide: false, callback_data: 'defibrillation' }
  ],
  [
    { text: givenHelp.get('compression'), hide: false, callback_data: 'compression' },
    { text: givenHelp.get('plait'), hide: false, callback_data: 'plait' }
  ],
  [
    { text: givenHelp.get('imbolization'), hide: false, callback_data: 'imbolization' },
    { text: givenHelp.get('bandage'), hide: false, callback_data: 'bandage' }
  ],
  [{ text: 'Перейти до наступного кроку', hide: false, callback_data: 'nextStep' }]
]


const getResultKeyboard = Markup.keyboard([
  ['Покращення', 'Без змін'],
  ['Погіршення', 'Хибний виклик'],
  ['Смерть до приїзду бригади', 'Смерть в присут. бригади'],
])
  .oneTime()
  .resize()
  .extra();

const getEditKeyboard = Markup.keyboard([
  ['Ім\'я пацієнта', 'Вік пацієнта', 'Стать пацієнта', 'Вага пацієнта' ],
  ['Причина виклику', 'Надана допомога'],
  ['Коментар до наданої допомоги', 'Результат'],
])
  .oneTime()
  .resize()
  .extra();

const getDiagnosisKeyboardPart1 = Markup.keyboard([
  ['Біль в грудях', 'Проблеми з диханням'],
  ['Травматичні ушкодження', 'Гостре отруєння'],
  ['ДТП', 'Наступні'],
])
  .oneTime()
  .resize()
  .extra();

const getDiagnosisKeyboardPart2 = Markup.keyboard([
  ['Алергічна реакція', 'Інфекційні захворювання'],
  ['Непритомність/порушення свідомості', 'Інше'],
  ['Попередні'],
])
  .oneTime()
  .resize()
  .extra();

module.exports = {
  confirmKeyboard,
  getPatientGenderKeyboard,
  startKeyboard,
  getPatientHelpKeyboard,
  getResultKeyboard,
  getEditKeyboard,
  givenHelp,
  skipKeyboard,
  continueKeyboard,
  getDiagnosisKeyboardPart1,
  getDiagnosisKeyboardPart2
};
