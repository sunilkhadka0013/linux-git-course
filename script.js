(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const bar = document.getElementById("bar");
  const count = document.getElementById("count");
  let index = 0;

  function show(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, n) => {
      s.classList.toggle("active", n === index);
      s.classList.toggle("past", n < index);
    });
    bar.style.width = ((index + 1) / slides.length) * 100 + "%";
    count.textContent = `${index + 1} / ${slides.length}`;
    history.replaceState(null, "", "#" + (index + 1));
  }

  const next = () => show(index + 1);
  const prev = () => show(index - 1);

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home": show(0); break;
      case "End": show(slides.length - 1); break;
      case "f":
      case "F":
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen?.();
        break;
    }
  });

  document.getElementById("next").addEventListener("click", next);
  document.getElementById("prev").addEventListener("click", prev);

  // Swipe on touch devices
  let startX = null;
  document.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    startX = null;
  });

  // Deep link: index.html#5 opens slide 5
  window.addEventListener("hashchange", () => show((parseInt(location.hash.slice(1), 10) || 1) - 1));
  show((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();
