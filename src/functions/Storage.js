export function SaveMovie(val) {
  let array = [];

  if (!localStorage.getItem("random-movie-id")) {
    array.unshift({ id: val, date: new Date(Date.now()) });
  } else {
    array = JSON.parse(localStorage.getItem("random-movie-id"));
    array.unshift({ id: val, date: new Date(Date.now()) });
  }
  localStorage.setItem("random-movie-id", JSON.stringify(array));
}

export function ClearStorage() {
  let clear = true;
  try {
    localStorage.clear();
  } catch {
    clear = false;
  }
  return clear;
}
