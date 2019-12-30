import moment from "moment";

//Formata data pra dia/mes/ano
export function FormatDate(date) {
  let newDate = moment(date);
  return newDate.format("DD/MM/YYYY");
}

//Retorna o dia ou mes ou ano atual
export function SpecificDateInfo(required) {
  let now = new Date();
  let date = "";

  if (required == "day") date = now.getDay();
  if (required == "month") date = now.getMonth();
  if (required == "year") date = now.getFullYear();

  return date;
}

//Criar array das opcoes de ano
export function SelectYear() {
  let year = [];
  for (var i = SpecificDateInfo("year"); i >= 1960; i--) {
    year.push(i);
  }

  return year;
}

//Retornar imagem ou placeholder - Url padrao
export function GetImage(poster_path, type) {
  if (poster_path != null) {
    return "http://image.tmdb.org/t/p/" + type + poster_path;
  } else {
    return require("../assets/Image/placeholder.jpg");
  }
}

//Pega a data atual no formato "yyy-mm-dd"
export function DateNow() {
  let d = new Date(Date.now());

  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
