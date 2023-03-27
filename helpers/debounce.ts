export const debounce = (fn, delay: number) => {
  let timeoutID = null;
  return (params) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn(params);
    }, delay);
  };
};
