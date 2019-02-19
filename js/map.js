/* global document: false */
let KEY_CODE = {
  ENTER: 13,
  ESC: 27
};

let dataAd = {
  COUNT: 8,
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

// создадим словарь для перевода | излишне, можно сразу этот объект добавить в dataAd вместо OFFER_TYPE, но так по ТЗ
let APPARTMENT_TYPES = {
  flat: `Квартира`,
  bungalo: `Бунгало`,
  house: `Дом`,
  palace: `Дворец`
};

let mapClass = document.querySelector(`.map`);
let pin = document.querySelector(`#pin`);
let mapPins = document.querySelector(`.map__pins`);
let popupCard = document.querySelector(`#card`);
let mainPin = document.querySelector(`.map__pin--main`);

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
  pinClone.querySelector(`.map__pin`).setAttribute(`id`, `${i}`);
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
function getElementPosition(element) {
  return element.getBoundingClientRect();
}

/**
 * Функция генерирует случаюную позициию метки на карте по оси X
 * размеры метки 50*70px, значит острый конец указывает на +25px по X, +70px по Y
 * @return {number}
 */
function setRandomPinPositionX() {
  let mapWidth = getElementPosition(mapClass).width; // получим текущую ширину карты
  let maxX = mapWidth - dataAd.PIN_WIDTH; // вычтим ширину пина, т.к. справа пин не должен вылезти за карту (отсчет от верхнего левого угла)
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
function openPopupCard(i) {
  let fragment = document.createDocumentFragment();
  let cloneMapCard = popupCard.content.cloneNode(true);
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

  // добавляем обработчики на закрытие окна popup
  mapClass.querySelector(`.popup__close`).addEventListener(`click`, closePopupCard); // клик по крестику попапа
  document.addEventListener(`keydown`, popupEscPressHandler); // Esc
}

/**
 * Функция закрывает всплывающее окно с карточкой объявления, если оно открыто
 * И удаляет обработчик на Esc
 */
let closePopupCard = function () {
  if (mapClass.querySelector(`.popup`)) {
    mapClass.querySelector(`.popup`).remove();
    document.removeEventListener(`keydown`, popupEscPressHandler);
  }
};


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
setFormFocus(false);

/**
 *  Первое перетаскивание главной метки переводит страницу в активный режим.
 *  Любое перетаскивание состоит из трёх фаз: захвата элемента, его перемещения и отпускания элемента.
 *  На данном этапе нам достаточно описать реакцию на третью фазу: отпускание элемента.
 *  Для этого нужно добавить обработчик события mouseup на элемент .map__pin--main.
 *  Обработчик события mouseup должен вызывать функцию, которая будет отменять изменения DOM-элементов,
 *  описанные в пункте «Неактивное состояние» ТЗ. ->  setFormFocus(true)
 */
mainPin.addEventListener(`mouseup`, function () {
  setMapFocus(true);
  setFormFocus(true);
  setAddress();
  renderPin();
});
let mainPinEnterPressHandler = function (evt) {
  if (evt.keyCode === KEY_CODE.ENTER) {
    setMapFocus(true);
    setFormFocus(true);
    setAddress();
    renderPin();
  }
};
mainPin.addEventListener(`keydown`, mainPinEnterPressHandler);

/**
 *  Функция заполнение поля формы  "Адрес"
 *  _______________________________ ТЗ: _______________________________
 *    Кроме активации формы, перемещение метки приводит к заполнению поля адреса.
 *  В значении поля записаны координаты, на которые метка указывает своим острым концом.
 *  Поэтому в обработчике события mouseup на элементе метки, кроме вызова метода,
 *  переводящего страницу в активное состояние, должен находиться вызов метода,
 *  который устанавливает значения поля ввода  адреса.
 *  Ещё один момент заключается в том, что поле адреса должно быть заполнено всегда,
 *  в том числе сразу после открытия страницы.
 *    Насчёт определения координат метки в этом случае нет никаких инструкций, ведь в неактивном режиме страницы
 *  метка круглая, поэтому мы можем взять за исходное значение поля адреса середину метки.
 *  А при «перетаскивании» значение поля изменится на то, на которое будет указывать острый конец метки.
 *  Для определения смещения координаты относительно левого верхнего угла метки можно использовать любой способ,
 *  в том числе, вычисление размеров метки. Кроме этого, можно хранить размеры метки как константу.
 *  _____________________________________________________________________
 *  Нас интересуют коррдинаты метки в координатах карты (`.map`), поэтому:
 *  По Х: Чтобы отсчет был в координатах карты -> Х метки МИНУС X карты
 *  По y: Чтобы отсчет был в координатах карты -> Y метки МИНУС Y карты
 *  При скролинге Y и карты и метки меняется, но относительные координаты будут верные
 *  -----
 *  Т.к. в css после активации карты в свойстве .map__pin--main::after рисуется псевдоэлемент border-top-width: 22px,
 *  который является хвостиком метки, то чтобы получить точку на которую указывает хвостик,
 *  к конечной  координате Y надо прибавить border-top-width. И вычесть 6px, т.к. псевдоэлемент .map__pin--main::after
 *  сдвигается по оси Y c помощью CSS transform: translate(tx, ty)
 *  Обратится к псевдоэлементу в JS можно только через добавление\удаление классов, поэтому пока возьмем числовое значение 22-6 = 18px;
 *  todo: вынести 18 в константу или найти способ обращаться к псевдоэлементу
 */
function setAddress() {
  let mainPinPosition = getElementPosition(mainPin); // Позиция главной метки в координатах окна браузера
  let mainPinX = mainPinPosition.x; // получим текущую координату Х для главной метки
  let mapX = getElementPosition(mapClass).x; // получим текущую координату Х для карты
  mainPinX = mainPinX - mapX; // координата Х главной метки в координатах карты
  let mapY = getElementPosition(mapClass).y; // получим текущую координату Y для карты
  let mainPinY = mainPinPosition.y - mapY;
  // На данный момент у нас координаты левого верхнего угла метки. Нам нужны координаты, куда указывает острый конец
  mainPinX += mainPinPosition.width / 2;
  mainPinY += mainPinPosition.height + 18;
  // запишем координаты метки в поле формы #address
  document.querySelector(`#address`).value = `x = ${Math.round(mainPinX)}, y = ${Math.round(mainPinY)}`;
}

/**
 * _______________________________ ТЗ: ______________________________
 * Просмотр подробной информации о похожих объявлениях.
 * После перевода страницы в активный режим, нужно отрисовать на карте похожие объявления.
 * Позже, в разделе про сеть, перевод в активный режим будет запускать загрузку объявлений,
 * но пока что можно показать объявления сразу.
 * Нажатие на метку похожего объявления на карте, приводит к показу карточки с подробной информацией об этом объявлении.
 * Получается, что для меток должны быть созданы обработчики событий, которые вызывают показ карточки с соответствующими данными.
 * Использовать ли делегирование.
 * При решении этой задачи помните о том, что при клике на метку, нужно будет передавать
 * в метод отрисовки карточки объект с данными, описывающими объявление.
 * Если использовать для этой задачи делегирование, то нахождение этого объекта будет нетривиальным,
 * потому что у вас будет использоваться один обработчик, у которого есть информация только о том, на каком DOM-элементе
 * произошёл клик. Таким образом, если вы используете делегирование для решения этой задачи,
 * вам нужно будет каким-то образом связать DOM-объекты с JS-объектами, которые их описывают.
 * _____________________________________________________________________
 * Добавим каждой метке ID, для этого дополним ф-ю createPinClone(i):
 * pinClone.querySelector(`.map__pin`).setAttribute(`id`, `${i}`);
 * И используем делегирование, добавиви обработчик на родительский див, и проверяем в обработчике ID у элемента
 */

/**
 * Обработчик - клик - на любой из меткок объявлений - открытие popupCard
 * Каждый <button class="map__pin"> содержит в себе <img>. И клик может быть как по <button>, так и по <img>.
 * Поэтому проверяем есть ли у элемента (ИЛИ его родителя) атрибут id
 */
mapPins.addEventListener(`click`, function (evt) {
  let id;
  if (evt.target.id) {
    id = evt.target.id;
  } else if (evt.target.parentElement.id) {
    id = evt.target.parentElement.id;
  } else {
    return;
  }
  // console.log(`кликнули по метке объявления c id = ${id}`);
  // Удалить предыдущий popup и показать новый
  closePopupCard();
  openPopupCard(id);
});

/**
 * Обработчик - Esc - при открытом окне popupCard - закрыть
 * Вызывается в функции открытия окна - openPopupCard(i)
 * @param {Event} evt
 */
let popupEscPressHandler = function (evt) {
  if (evt.keyCode === KEY_CODE.ESC) {
    closePopupCard();
  }
};
