/* global window, fetch: false */
(function () {

  let URLS = {
    GET_DATA: `https://js.dump.academy/keksobooking/data`,
    POST: `https://js.dump.academy/keksobooking`,
  };

  window.backend = {
    getData() {
      return fetch(URLS.GET_DATA, {
        method: `get`,
      }).then(function (response) {
        if (response.status !== 200) {
          return null;
        }
        return response.json();
      }).catch(function (error) {
        // TODO Обрботка ошибки
        window.console.log(`Ошибка получения данных с сервера: ${error.message}. Повторите попытку позже`);
      });
    },
    postData(URL, formData) {
      return fetch(URL, {
        method: `post`,
        body: formData,
      }).then(function (response) {
        if (response.status !== 200) {
          // TODO Всплывающее окно с ошибкой
          window.alert(`Похоже, возникла проблема отправки данных на сервер. \nStatus Code: ${response.status}`);
          // errorPopup(`Looks like there was a problem. Status Code: ${response.status}`);
          return null;
        }
        return response.json();
      }).catch(function (error) {
        // TODO Всплывающее окно с ошибкой
        window.alert(`Ошибка отправки данных на сервер: ${error.message}. Повторите попытку позже`);
      });
    },
  };
})();
