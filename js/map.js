/* global window, document: false */
(function () {

  let mapClass = document.querySelector(`.map`);
  let mainPin = document.querySelector(`.map__pin--main`);

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
 *  Первое перетаскивание главной метки переводит страницу в активный режим.
 *  Любое перетаскивание состоит из трёх фаз: захвата элемента, его перемещения и отпускания элемента.
 *  На данном этапе нам достаточно описать реакцию на третью фазу: отпускание элемента.
 *  Для этого нужно добавить обработчик события mouseup на элемент .map__pin--main.
 *  Обработчик события mouseup должен вызывать функцию, которая будет отменять изменения DOM-элементов,
 *  описанные в пункте «Неактивное состояние» ТЗ. ->  window.form.setFormFocus(true)
 */
  mainPin.addEventListener(`mouseup`, function () {
    setMapFocus(true);
    window.form.setFormFocus(true);
    window.form.setAddress();
    window.pin.renderPin();
  });
  let mainPinEnterPressHandler = function (evt) {
    if (evt.key === `Enter`) {
      setMapFocus(true);
      window.form.setFormFocus(true);
      window.form.setAddress();
      window.pin.renderPin();
    }
  };
  mainPin.addEventListener(`keydown`, mainPinEnterPressHandler);

})();
