addEventListener("keydown",playKey);
addEventListener("keyup", upuszczenie);
let sciezka = [[]], record = [], time = [], sound= [];
let timeout = [], koniec = [];
let soundList = {
    a: "boom",
    s: "clap",
    d: "hihat",
    f: "kick",
    g: "openhat",
    h: "ride",
    j: "snare",
    k: "tink",
    l: "tom"
}

function loadAudio() { //wczytanie dzwiekow
    Object.values(soundList).forEach((e) => sound[e] = new Audio('./sounds/' + e + '.wav'));
}
function playKey(e) { // funkcja grania muzyki
    sound[soundList[e.key]].currentTime=0;
  sound[soundList[e.key]].play();
  document.getElementById(e.key).classList.add('key-pressed') ;
  
  for (i = 1; i <= sciezka.length; i++){ // sprawdza, czy wlaczone jest nagrywanie dla kazdej sciezki
    if (record[i]) {
        if (Object.keys(soundList).indexOf(e.key) > -1) { //jezli naciskany jest poprawny klawisz, dodaje go do sciezki z czasem nagrania
            sciezka[i].push(
                {
                    delay: Date.now() - time[i],
                    key: e.key
                })
        }
    }
}
}

function upuszczenie(e){
  if(document.getElementById(e.key)){
  document.getElementById(e.key).classList.remove('key-pressed');
}}
  

function startRecord(numer_sciezki) {
   // nagrywanie sciezki
  if (!record[numer_sciezki]) { 
      record[numer_sciezki] = true;
      time[numer_sciezki] = Date.now();
      sciezka[numer_sciezki] = [];

  }
  else { 
      record[numer_sciezki] = false;
      document.getElementById("status" + numer_sciezki).innerText = sciezka[numer_sciezki].length + " Sounds recorded in " + Math.round(sciezka[numer_sciezki][sciezka[numer_sciezki].length-1].delay/100)/10+"sec";
  }
}

function playRecord(numer_sciezki,e) { //odtwarzanie sciezki
  if (!timeout[numer_sciezki] && sciezka[numer_sciezki][0]) { 
      sciezka[numer_sciezki].forEach((e) => {
          timeout[numer_sciezki] = setTimeout(() => { playKey(e) }, e.delay);
          
      })
      
      koniec[numer_sciezki] = setTimeout(() => playRecord(numer_sciezki), sciezka[numer_sciezki][sciezka[numer_sciezki].length - 1].delay + 10)
       // gdy skonczy sie sciezka, przycisk automatycznie zmienia sie ponownie na "play"
  }
  else { 
      clearTimeout(koniec[numer_sciezki]);
      do {
          clearTimeout(timeout[numer_sciezki]);
          czyszczenie();
      }
      while (timeout[numer_sciezki]--)
      timeout[numer_sciezki] = false;
     
  }
}
function czyszczenie(){
var a= document.querySelectorAll(".key-pressed");
for (var i = 0; i < a.length; i++) {
  a[i].classList.remove('key-pressed')
}   
}
