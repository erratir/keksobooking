/* global window, document: false */

/**
 *  модуль, который отвечает за создание пина — метки
 на карте
 */

(function () {

  let mapPins = document.querySelector(`.map__pins`);
  let pin = document.querySelector(`#pin`);

  /**
   * Функция принимает номер текущего объявления, создает клон метки и возвращает
   * @param {number} i
   * @return {Node}
   */
  let createPinClone = function (i) {
    let pinClone = pin.content.cloneNode(true);
    // pinClone.querySelector(`.map__pin`).style = `left: 400px; top: 400px;`;
    pinClone.querySelector(`.map__pin`).style.left = window.data.adArray[i].location.x + `px`;
    pinClone.querySelector(`.map__pin`).style.top = window.data.adArray[i].location.y + `px`;
    pinClone.querySelector(`img`).src = window.data.adArray[i].author.avatar;
    pinClone.querySelector(`img`).alt = window.data.adArray[i].offer.title;
    pinClone.querySelector(`.map__pin`).setAttribute(`id`, `${i}`);
    return pinClone;
  };


  /**
   * Отрисовка меток объявлений на карте
   */
  let renderPin = function () {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < window.data.dataAd.COUNT; i++) {
      fragment.appendChild(createPinClone(i));
    }
    mapPins.appendChild(fragment);
  };

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
    window.card.closePopupCard();
    window.card.openPopupCard(id);
  });

  window.pin = {
    renderPin,
  };

})();
