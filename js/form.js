/* global window, document: false */

/**
 *  модуль, который работает с формой объявления
 */
(function () {

  let mainPin = document.querySelector(`.map__pin--main`);
  let mapClass = document.querySelector(`.map`);
  let successPopupTemplate = document.querySelector(`#success`);
  let main = document.querySelector(`main`);

  /**
   * Функция активирует\дезактивирует поля формы добавления объявления и саму форму
   * Согласно ТЗ, поля формы должны быть неактивны в исходном состоянии.
   * В разметке проекта поля активны,  * поэтому их нужно отключить,
   * т.е. добавить через DOM-операции или самим полям или fieldset которые их содержат, атрибут disabled.
   * @param {boolean} focus
   */
  let setFormFocus = function (focus) {
    let form = document.querySelector(`.ad-form`);
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
  let setAddress = function () {
    let mainPinPosition = window.utils.getElementPosition(mainPin); // Позиция главной метки в координатах окна браузера
    let mainPinX = mainPinPosition.x; // получим текущую координату Х для главной метки
    let mapX = window.utils.getElementPosition(mapClass).x; // получим текущую координату Х для карты
    mainPinX = mainPinX - mapX; // координата Х главной метки в координатах карты
    let mapY = window.utils.getElementPosition(mapClass).y; // получим текущую координату Y для карты
    let mainPinY = mainPinPosition.y - mapY;
    // На данный момент у нас координаты левого верхнего угла метки. Нам нужны координаты, куда указывает острый конец
    mainPinX += mainPinPosition.width / 2;
    mainPinY += mainPinPosition.height + 18;
    // запишем координаты метки в поле формы #address
    document.querySelector(`#address`).value = `x = ${Math.round(mainPinX)}, y = ${Math.round(mainPinY)}`;
  };

  /**
   * Функция отображает окно `.success` в случае успешной загрузки данных формы на сервер
   */
  let showSuccessMessage = function () {
    let cloneSuccessPopupTemplate = successPopupTemplate.content.cloneNode(true);
    let succesPopup = cloneSuccessPopupTemplate.querySelector(`.success`);

    main.appendChild(cloneSuccessPopupTemplate);
    let closeSuccessMessage = function () {
      document.removeEventListener(`keydown`, handleKeyPress);
      succesPopup.removeEventListener(`click`, closeMessageOnOutClick);
      main.removeChild(succesPopup);
    };

    let closeMessageOnOutClick = function (evt) {
      evt.preventDefault();
      if (evt.target === succesPopup) {
        closeSuccessMessage();
      }
    };

    let handleKeyPress = function (evt) {
      evt.preventDefault();
      if (evt.key === `Escape`) {
        closeSuccessMessage();
      }
    };
    document.addEventListener(`keydown`, handleKeyPress);
    succesPopup.addEventListener(`click`, closeMessageOnOutClick);
  };

  window.form = {
    setFormFocus,
    setAddress,
  };
})();
