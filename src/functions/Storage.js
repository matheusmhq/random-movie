export function SalvarId(id) {
  var array = [];

  if (!localStorage.getItem("random-movie-id")) {
    array.push(id);
  } else {
    array = JSON.parse(localStorage.getItem("random-movie-id"));
    array.push(id);
  }
  localStorage.setItem("random-movie-id", JSON.stringify(array));
}

export function ClearStorage() {
  console.log("CLEAR FUNCITON");
  var clear = true;
  try {
    localStorage.clear();
  } catch {
    clear = false;
  }
  return clear;
}
