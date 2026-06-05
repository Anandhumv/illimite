export function debounce(fn, delay = 500) {
  let timerId = null;

  function debounced(...args) {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }

  debounced.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  debounced.flush = (...args) => {
    debounced.cancel();
    fn(...args);
  };

  return debounced;
}
