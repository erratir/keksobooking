let dataAd = {
  COUNT: 8,
  AVATAR_NUM_MIN_MAX: [1, 8],
  ADDRESS_LOCATION_X_MIN_MAX: [130, 630], // todo функциюю определяющую координаты видимой области, или картинки - карты
  ADDRESS_LOCATION_Y_MIN_MAX: [130, 630],
  OFFER_TITLE: [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`],
  OFFER_PRICE_MIN_MAX: [1000, 1000000],
  OFFER_TYPE: [`palace`, `flat`, `house`, `bungalo`],
  OFFER_ROOMS_MIN_MAX: [1, 5],
  OFFER_GUESTS_MIN_MAX: [2, 10],
  OFFER_CHECKIN: [`12:00,`, `13:00`, `14:00`],
  OFFER_CHECKOUT: [`12:00,`, `13:00`, `14:00`], // todo уточнить
  OFFER_FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  OFFER_DESCRIPTION: ``,
  OFFER_FOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`],
  LOCATION_X_MIN_MAX: [130, 630], // todo ФУНКЦИЮ -> Значение ограничено размерами блока, в котором перетаскивается метка.
  LOCATION_Y_MIN_MAX: [130, 630]
};

/**
 * Функция-конструктор объекта Ad
 */
function Ad() {
  this.author = {avatar: `img/avatars/user0${getRandomInRange(1, 8)}.png`};
  this.offer = {
    title: getRandomElement(dataAd.OFFER_TITLE),
    adress: `${getRandomInRange(dataAd.LOCATION_X_MIN_MAX[0], dataAd.LOCATION_X_MIN_MAX[1])}, ${getRandomInRange(dataAd.LOCATION_Y_MIN_MAX[0], dataAd.LOCATION_Y_MIN_MAX[1])}`,
    price: getRandomInRange(dataAd.OFFER_PRICE_MIN_MAX[0], dataAd.OFFER_PRICE_MIN_MAX[1]),
    type: getRandomElement(dataAd.OFFER_TYPE),
    rooms: getRandomInRange(dataAd.OFFER_ROOMS_MIN_MAX[0], dataAd.OFFER_ROOMS_MIN_MAX[1]),
    guest: getRandomInRange(dataAd.OFFER_GUESTS_MIN_MAX[0], dataAd.OFFER_GUESTS_MIN_MAX[1]),
    checkin: getRandomElement(dataAd.OFFER_CHECKIN),
    checkout: getRandomElement(dataAd.OFFER_CHECKOUT),
    features: shuffleArray(dataAd.OFFER_FEATURES, getRandomInRange(1, dataAd.OFFER_FEATURES.length)),
    // где:
    // getRandomInRange(1, dataAd.OFFER_FEATURES.length) -> случайное кол-во опций "WiFi, TV, .."
    // shuffleArray(dataAd.OFFER_FEATURES) -> перемешать массив и создать новый
    description: dataAd.OFFER_DESCRIPTION,
    photos: shuffleArray(dataAd.OFFER_FOTOS, false),
  };
}

let ad = new Ad();


/**
 * Функция возвращает массив со случайно перемешанными элементами
 * Если передать в функцию newLength, то после сортировки исходный массив будет обрезан до newLength
 * https://habr.com/ru/post/358094/
 * @param {array} arr
 * @param {number | boolean} newLength
 * @return {array}
 */
function shuffleArray(arr, newLength) {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  if (newLength) {
    arr = arr.slice(0, newLength + 1);
  }
  return arr;
}

/**
 * Функция возвращает случайное целое число между min и max, включая min, max как возможные значения
 * https://learn.javascript.ru/task/random-int-min-max
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function getRandomInRange(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

/**
 * Функция, возвращает случайный элемемент массива
 * https://learn.javascript.ru/array
 * @param {array} array
 * @return {*}
 */
function getRandomElement(array) {
  let randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
