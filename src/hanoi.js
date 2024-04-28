const hanoiMegoldasa = (nKorong) => {
  const megoldasok = []

   // a korongok mozgatása az EREDETI rúdról a CÉL rúdra a SEGÉD rúd segítségével rekurzióval   
  const hanoi = (n, eredeti, cel, seged) => {
    if (n == 1) {
     // Ha csak egyetlen korongot kell áttenni a végső rúdra
      megoldasok.push({ korong: n, eredeti, cel })
      return;
    }

   // n-1 korong mozgatása az EREDET-ről a SEGÉD rúdra a CÉL rúd segítségével
    hanoi(n - 1, eredeti, seged, cel)

     // az n-edik korong mozgatása az eredetiről a cél rúdra
    megoldasok.push({ korong: n, eredeti, cel })

    // n-1 korong mozgatása a SEGÉD-ről a CÉL-ra az EREDET felhasználásával
    hanoi(n - 1, seged, cel, eredeti)
  }

   // a rekurzív eljárás elindítésa a hanoi függvény hívásával
  hanoi(nKorong, 0, 1, 2)

  return megoldasok;
}

export {
  hanoiMegoldasa
}