document.querySelectorAll("form[data-confirm]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    const message = form.dataset.confirm;

    if (!window.confirm(message)) {
      event.preventDefault();
    }
  });
});

document.querySelectorAll("[data-auto-submit]").forEach((field) => {
  field.addEventListener("change", () => field.form.submit());
});

document.querySelectorAll("img[data-fallback-src]").forEach((image) => {
  image.addEventListener("error", () => {
    if (image.src.endsWith(image.dataset.fallbackSrc)) return;
    image.src = image.dataset.fallbackSrc;
  });
});
