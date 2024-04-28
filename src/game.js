import { sleep } from './util.js'
import { hanoiMegoldasa } from './hanoi.js'

// az összes torony kiválasztása
const tornyok = document.querySelectorAll('.torony');

// beállítja a toronyContent-et az egyes tornyokon lévő korongokat reprezentáló tömbökként
let tornyokTombje = [[], [], []];

// beállítja hány darab korong legyen kezdésnek
let ertek = document.getElementById('korongSelect').value;
let size = parseInt(ertek);

let korongok;

// a sebesség és sleep beállítása
const sleepTime = 300;
let speed = 100;

// korongok színei
const korong_szinek = ['#000080', '#008000', '#cc0000', '#e6e600', '#ff0066', '#444', '#00FFFF'];

// a korongok szélessége %-ban
const startWidth = 100;

const ujraGomb = document.getElementById('ujraGomb');
const korongSelect = document.getElementById('korongSelect');
const speedRange = document.getElementById('speedRange');
const solveGomb = document.getElementById('solveGomb');


let aktualTorony;
let eredetiTorony;

// a korongok létrehozása és elhelyezése az első rúdon
const toronyEpito = (tornyok) => {

  let cim = ["Kiindulás", "CÉL", "segéd"];
  let szamlalo = 0;

  tornyok.forEach(torony => {
    const rud = document.createElement('div');
    rud.className = 'rud';
    const alap = document.createElement('div');
    alap.className = 'alap';
    alap.innerText = cim[szamlalo];
    torony.innerHTML = '';
    torony.appendChild(rud);
    torony.appendChild(alap);
    szamlalo++;
  })
}

// kezdi a játékot
start();

function start() {
  // a tornyokTömbjét reseteljük
  tornyokTombje = [[], [], []];

  // meghívjuk a toronyÉpítő függvényt a rudakkal és alapokkal
  toronyEpito(tornyok);

  // a korongok létrehozása és elhelyezése az első rúdon
  for (let i = 0; i < size; i++) {
    let torony = document.createElement('div');
    torony.classList.add('korong');
    torony.draggable = true;
    torony.style.backgroundColor = korong_szinek[i];
    //torony.style.width = (startWidth - 20 * i) + 'px'; <-- nem responsive, helyette:
    torony.style.width = (startWidth - (12 * i)) + "%";
    torony.innerText = (size - i) + "";

    tornyokTombje[0].push(torony)
  }

  // hozzáadja a korongot az első toronyhoz a DOM-ban
  tornyokTombje[0].forEach(t => {
    tornyok[0].innerHTML = t.outerHTML + tornyok[0].innerHTML
  })

  // a tornyok eventListener-jéhez adja hozzá a dragenter és dragover eseményt
  for (let i = 0; i < tornyok.length; i++) {
    tornyok[i].classList.add('t' + i);
    tornyok[i].addEventListener('dragenter', dragenter);
    tornyok[i].addEventListener('dragover', dragover);
  }

  korongok = document.querySelectorAll('.korong');

  korongok.forEach(korong => {
    korong.addEventListener('dragstart', dragstart);
    korong.addEventListener('dragend', dragend);
  })
}

// a dragenter eseménykezelője
function dragenter() {
  if (!eredetiTorony) {
    eredetiTorony = this;
  }
}

// a dragover eseménykezelője
function dragover() {
  aktualTorony = this;
}

function dragstart() {
  this.classList.add('mozgatva');
}

// dragend eseménykezelő
function dragend() {
  let eredetiToronyIndex = eredetiTorony.classList[1][1];
  let aktualToronyIndex = aktualTorony.classList[1][1];
  this.classList.remove('mozgatva');

  korongMozgato(eredetiToronyIndex, aktualToronyIndex, this);

  eredetiTorony = undefined;
  eredetiToronyIndex = undefined;
}

// Korong morgatása az eredeti rúdról az aktuális rúdra
function korongMozgato(eredetiToronyIndex, aktualToronyIndex, korong) {
  if (atTeheto(eredetiToronyIndex, aktualToronyIndex, korong)) {
    tornyokTombje[aktualToronyIndex].push(tornyokTombje[eredetiToronyIndex].pop());
    eredetiTorony.removeChild(korong);
    aktualTorony.prepend(korong);
  }
}

// ellenőrzi, hogy a korong ráhelyezhető-e a rúdra
function atTeheto(eredetiToronyIndex, aktualToronyIndex, korong) {
  let top = tetejenVan(eredetiToronyIndex, korong);
  let topKorongLegkisebb = kisebbKorong(aktualToronyIndex, korong);

  return top && topKorongLegkisebb;
}

// ellenőrzi, hogy a korong a kiinduló rúd legfelső eleme-e
function tetejenVan(eredetiToronyIndex, korong) {
  let size = tornyokTombje[eredetiToronyIndex].length;

  if (size === 0) {
    let warning = document.getElementById('warning');
    warning.innerHTML = "&nbsp; &#9940; Kezdj új játékot a gombra kattintva! &#9940;";
    return;
  }
  else {
    return korong.style.width === tornyokTombje[eredetiToronyIndex][size - 1].style.width;
  }

}

// ellenőrzi, hogy a mozgatott korong kisebb-e az aktuális rúd tetején levő korongnál
function kisebbKorong(aktualToronyIndex, korong) {
  let size = tornyokTombje[aktualToronyIndex].length;

  if (!tornyokTombje[aktualToronyIndex][size - 1]) {
    return true;
  }
  else {
    let felsoMerete = korong.style.width.substring(0, korong.style.width.indexOf('%'));
    let alsoMerete = tornyokTombje[aktualToronyIndex][size - 1].style.width.substring(0, tornyokTombje[aktualToronyIndex][size - 1].style.width.indexOf('%'));

    return Number(felsoMerete) < Number(alsoMerete);
  }
}

// A legfelső korong mozgatása az eredeti rúdról a cél rúdra
function topKorongMozgatasa(eredetiToronyIndex, celToronyIndex) {
  eredetiTorony = tornyok[eredetiToronyIndex];
  aktualTorony = tornyok[celToronyIndex];
  let korong = getTopKorong(eredetiToronyIndex);
  korongMozgato(eredetiToronyIndex, celToronyIndex, korong);
}

// a legfelső korong levétele az adott rúdról
function getTopKorong(towerIndex) {
  let size = tornyokTombje[towerIndex].length;

  if (size === 0) {
    alert("Kezdj új játékot!");
    return;
  }
  else {
    let sizeDisc = tornyokTombje[towerIndex][size - 1].style.width;
    let indexDisc = -1;

    korongok.forEach((el, index) => {
      if (el.style.width === sizeDisc) {
        indexDisc = index;
      }
    })
    return korongok[indexDisc];
  }
}

// a korongokat mozgató függvény async a sleep miatt
async function pakolas(mozgatasok) {

  for (let i = 0; i < mozgatasok.length; i++) {
    const element = mozgatasok[i];
    topKorongMozgatasa(element.eredeti, element.cel);
    await sleep(5 * sleepTime - 14 * speed);
  }
}

// Game class
class Game {
  // új játékot indító metódus
  newGame = () => {
    // Leolvassa mekkora legyen a sebesség
    speedRange.addEventListener('input', event => {
      speed = event.target.value;
    })

    // gombra kattintva új játékot indít, de újra kell töltenem az oldalt és resetelni a cach-t
    ujraGomb.addEventListener('click', () => {
      window.location.reload();
      size = korongSelect.selectedIndex + 1;
      start();
    })

    // gomb kattintásra elindítja az automatikus korong mozgatást
    solveGomb.onclick = function () {
      console.log(size);
      const mozgatasok = hanoiMegoldasa(size);
      pakolas(mozgatasok);
      
    }
  }
}

export default Game