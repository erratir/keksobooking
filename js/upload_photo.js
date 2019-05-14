/* global window, document: false */

/**
 * Модуль позволяет загружать аватарку и фотографии объявления
 */

/**
 * SRS: Доработайте форму подачи объявления так, чтобы в неё можно было загружать вашу аватарку и фотографии объявления.
 * Аватарка пользователя должна загружаться через поле загрузки файлов в блоке .ad-form__field
 * и показываться в блоке .ad-form-header__preview.
 * Фотографии жилья должны загружаться через поле загрузки файлов в блоке .ad-form__upload
 * и показываться в блоках .ad-form__photo. По желанию, вы можете сделать так,
 * чтобы фотографии жилья можно было сортировать с помощью перетаскивания (drag n drop API).
 */

(function () {

  /**
   * Загрузка автара
   */
  let uploadAvatar = document.querySelector(`.ad-form-header__input`);
  let previewAvatar = document.querySelector(`.ad-form-header__preview img`);

  uploadAvatar.addEventListener(`change`, function (evt) {
    evt.preventDefault();
    if (uploadAvatar.files.length > 0) {
      let file = uploadAvatar.files[0];
      if (!file.type.match(/image.*/)) {
        // cb(new Error(`FILE_NOT_IMAGE`));
        return;
      }
      previewAvatar.src = window.URL.createObjectURL(file);
    }
  });

  /**
   * Загрузка фотографий объявления todo 1)доработать css блока отображения фото 2)сделать загрузку нескольких фото
   */
  let uploadPhoto = document.querySelector(`.ad-form__upload input[type="file"]`);
  let previewPhoto = document.querySelector(`.ad-form__photo`);

  uploadPhoto.addEventListener(`change`, function (evt) {
    evt.preventDefault();
    if (uploadPhoto.files.length > 0) {
      let file = uploadPhoto.files[0];
      if (!file.type.match(/image.*/)) {
        // cb(new Error(`FILE_NOT_IMAGE`));
        return;
      }

      let img = document.createElement(`img`);
      img.src = window.URL.createObjectURL(file);
      previewPhoto.appendChild(img);

    }
  });
})();
