/* global document: false */
let dataAd = {
  COUNT: 20,
  AVATAR_NUM_MIN_MAX: [1, 8],
  ADDRESS_LOCATION_X_MIN_MAX: [130, 630],
  ADDRESS_LOCATION_Y_MIN_MAX: [130, 630],
  OFFER_TITLE: [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`],
  OFFER_CURRENCY: `\u20BD`, // `\u20BD` -> ₽  `\u0024` - $
  OFFER_PRICE_MIN_MAX: [1000, 1000000],
  OFFER_TYPE: [`palace`, `flat`, `house`, `bungalo`],
  OFFER_ROOMS_MIN_MAX: [1, 5],
  OFFER_GUESTS_MIN_MAX: [2, 10],
  OFFER_CHECKIN: [`12:00,`, `13:00`, `14:00`],
  OFFER_CHECKOUT: [`12:00,`, `13:00`, `14:00`],
  OFFER_FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  OFFER_DESCRIPTION: `В ТЗ пустая строка`,
  OFFER_PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`],
  // LOCATION_X_MIN_MAX: [130, 630],
  LOCATION_Y_MIN_MAX: [130, 630],
  PIN_WIDTH: 50, // ширина метки объвления (пина)
  PIN_HEIGHT: 70, // высота метки объвления (пина)
};

let mapClass = document.querySelector(`.map`);
let pin = document.querySelector(`#pin`);
let mapPins = document.querySelector(`.map__pins`);
let mapCard = document.querySelector(`#card`);
// создадим словарь для перевода | излишне, можно сразу этот объект добавить в dataAd вместо OFFER_TYPE, но так по ТЗ
let APPARTMENT_TYPES = {
  flat: `Квартира`,
  bungalo: `Бунгало`,
  house: `Дом`,
  palace: `Дворец`
};

/**
 * Функция-конструктор объекта ad
 */
function GenerateAd() {
  this.author = {avatar: `img/avatars/user0${getRandomInRange(1, 8)}.png`};
  this.location = {
    x: setRandomPinPositionX(),
    y: getRandomInRange(dataAd.ADDRESS_LOCATION_Y_MIN_MAX[0], dataAd.LOCATION_Y_MIN_MAX[1]),
  };
  this.offer = {
    title: getRandomElement(dataAd.OFFER_TITLE),
    // adress: `${getRandomInRange(dataAd.LOCATION_X_MIN_MAX[0], dataAd.LOCATION_X_MIN_MAX[1])}, ${getRandomInRange(dataAd.LOCATION_Y_MIN_MAX[0], dataAd.LOCATION_Y_MIN_MAX[1])}`,
    adress: `${this.location.x},${this.location.y}`,
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
    photos: shuffleArray(dataAd.OFFER_PHOTOS, false),
  };
}

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

/**
 * Функция переключает карту из неактивного состояния в активное и  наоборот
 * @param {boolean} focus
 */
function setMapFocus(focus) {
  if (focus) {
    mapClass.classList.remove(`map--faded`);
  } else {
    mapClass.classList.add(`map--faded`);
  }
}

/**
 * Функция принимает номер текущего объявления, создает клон метки и возвращает
 * @param {number} i
 * @return {Node}
 */
function createPinClone(i) {
  let pinClone = pin.content.cloneNode(true);
  // pinClone.querySelector(`.map__pin`).style = `left: 400px; top: 400px;`;
  pinClone.querySelector(`.map__pin`).style.left = adArray[i].location.x + `px`;
  pinClone.querySelector(`.map__pin`).style.top = adArray[i].location.y + `px`;
  pinClone.querySelector(`img`).src = adArray[i].author.avatar;
  pinClone.querySelector(`img`).alt = adArray[i].offer.title;
  return pinClone;
}

/**
 * Отрисовка меток объявлений на карте
 */
function renderPin() {
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < dataAd.COUNT; i++) {
    fragment.appendChild(createPinClone(i));
  }
  mapPins.appendChild(fragment);
}

/**
 * Функция возвращает текущие координаты и размеры HTML элемента относительно окна браузера
 * Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
 * @param {object} element
 * @return {ClientRect | DOMRect}
 */
function getMapPosition(element) {
  return element.getBoundingClientRect();
}

/**
 * Функция генерирует случаюную позициию метки на карте по оси X
 * размеры метки 50*70px, значит острый конец указывает на +25px по X, +70px по Y
 * @return {number}
 */
function setRandomPinPositionX() {
  let mapWidth = getMapPosition(mapClass).width; // получим текущую ширину карты
  let maxX = mapWidth - dataAd.PIN_WIDTH; // вычтим ширину пина, т.к. справа пин не должен вылезти за карту
  return getRandomInRange(0, maxX); // получим случайную координату по оси X в пределах карты
}

/**
 * Генеририрует карточку объявления в соответствии с шаблоном
 * На основе первого по порядку элемента из сгенерированного массива
 * и шаблона .map__card создайте DOM-элемент объявления, заполните его
 * данными из объекта и вставьте полученный DOM-элемент
 * в блок .map перед блоком .map__filters-container:
 * @param {number} i
 */
function renderMapCard(i) {
  let fragment = document.createDocumentFragment();
  let cloneMapCard = mapCard.content.cloneNode(true);
  cloneMapCard.firstElementChild.src = adArray[i].author.avatar;
  cloneMapCard.querySelector(`.popup__title`).textContent = adArray[i].offer.title;
  cloneMapCard.querySelector(`.popup__text--address`).textContent = adArray[i].offer.adress;
  cloneMapCard.querySelector(`.popup__text--price`).textContent = `${adArray[i].offer.price} ${dataAd.OFFER_CURRENCY}/ночь`;
  cloneMapCard.querySelector(`.popup__type`).textContent = APPARTMENT_TYPES[adArray[i].offer.type]; // APPARTMENT_TYPES возьмет русский вариант слова
  cloneMapCard.querySelector(`.popup__text--capacity`).textContent = `${adArray[i].offer.rooms} комнат(ы) для ${adArray[i].offer.guest} гостей`; // todo - обработка окончаний - 1 комнат(ы) для 3 гостей
  cloneMapCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${adArray[i].offer.checkin}, выезд ${adArray[i].offer.checkout}`;

  /**
   * Опции | В список .popup__features выведите все доступные удобства (опции)  в объявлении
   * получим коллекцию объектов, т.е. все теги <li> в <ul class="popup__features"> | <li class="popup__feature popup__feature--wifi"></li>
   */
  let nodeList = cloneMapCard.querySelector(`.popup__features`).querySelectorAll(`.popup__feature`);
  let liClassName;
  let liClassNameEnd; // Все что в имени класса после `popup__feature popup__feature--`, например `WiFi`
  // пройдемся по всем объектам масива (коллекции <li>)
  nodeList.forEach(function (item) {
    liClassName = item.className;
    liClassNameEnd = liClassName.substr(31);
    // Если в объявлении adArray[i], в массиве features нет текущей опции (WiFi и т.д), то удалим <li>
    if (!(adArray[i].offer.features.some((elem) => elem === liClassNameEnd))) {
      item.remove();
    }
  });

  // Описание | В блок .popup__description выведите описание объекта
  cloneMapCard.querySelector(`.popup__description`).textContent = `${adArray[i].offer.description}`;

  /**
   * Фото | В блок .popup__photos выведите все фотографии из списка offer.photos.
   * Каждая из строк массива photos должна записываться как src соответствующего изображения.
   * @type {Element}
   */
  let divFotoColection = cloneMapCard.querySelector(`.popup__photos`);
  adArray[i].offer.photos.forEach(function (item, j) {
    if (j > 0) { // если фотка не одна (а в html шаблоне, только один тег <img>), добавим еще один тег <img>
      divFotoColection.appendChild(divFotoColection.querySelector(`img`).cloneNode(true));
    }
    divFotoColection.querySelector(`img`).src = item;
  });

  /**
   *   Автар | Замените src у аватарки пользователя — изображения,
   *   которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
   */
  cloneMapCard.querySelector(`.popup__avatar`).src = adArray[i].author.avatar;

  // отрисовка клона фрагмента
  fragment.appendChild(cloneMapCard);
  mapClass.appendChild(fragment);
}


/**
 * Гененрируем массив объявлений
 * @type {Array}
 */
let adArray = [];
for (let i = 0; i < dataAd.COUNT; i++) {
  adArray.push(new GenerateAd());
}

/**
 *  ------------------------------------- module4-task1
 */

/**
 *  Возвращаем пока карту в неактивный режим и комментируем рендер меток
 */
// setMapFocus(true);
// renderPin();
// renderMapCard(0); // todo карточка должна вызываться определенного объявления по клику/ для теста вызываем adArray[0]

/**
 * Функция активирует\дезактивирует поля формы добавления объявления и саму форму
 * Согласно ТЗ, поля формы должны быть неактивны в исходном состоянии.
 * В разметке проекта поля активны,  * поэтому их нужно отключить,
 * т.е. добавить через DOM-операции или самим полям или fieldset которые их содержат, атрибут disabled.
 * @param {boolean} focus
 */
let setFormFocus = function (focus) {
  let form = document.querySelector(`.ad-form`); // выберем форму
  if (focus) {
    form.classList.remove(`ad-form--disabled`);
  } else {
    form.classList.add(`ad-form--disabled`);
  }
  form = form.querySelectorAll(`fieldset`); // запишем в переменну массив HTML элементов <fieldset></fieldset>
  form.forEach(function (item) {
    item.disabled = !focus; // каждому элементу установим или удадим атрибут disabled
  });
};

// setFormFocus(true);
