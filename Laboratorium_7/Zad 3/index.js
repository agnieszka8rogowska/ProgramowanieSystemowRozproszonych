const neo4j = require('neo4j-driver')
const { UnsubscriptionError } = require('rxjs')
const uri = 'neo4j://localhost:7687'
const user = 'neo4j'
const password = 'root'
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()
const prompt = require('prompt-sync')();

async function dodaj(){
  const id = prompt('Podaj id towaru: ');
  const nazwa = prompt('Podaj nazwę towaru: ');
  const ilosc = prompt('Podaj ilość towaru: ');
  const wartosc = prompt('Podaj wartość towaru: ');
  const miasto = "Kielce";
  const kierowca = prompt('Podaj id kierowcy: ');
  const cel = prompt('Podaj cel: '); 
  try {
    const result = await session.run(
    'CREATE (a:Towar {id: $id, nazwa: $nazwa, ilosc: $ilosc, wartosc: $wartosc, miasto: $miasto}) RETURN a',
      { 
        id: id,
        nazwa: nazwa,
        ilosc: ilosc,
        wartosc: wartosc,
        miasto: miasto
      }
    )
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    console.log("Dodano: id:", node.properties.id,', nazwa:', node.properties.nazwa,', ilość:', node.properties.ilosc,', wartość:', node.properties.wartosc,', miasto:', node.properties.miasto ) //można node.properties.nazwa_pola
    const result1 = await session.run(
      'MATCH (a:Towar),(b:Kierowca) WHERE a.id = $towar AND b.id = $kierowca CREATE (a)-[r:SA_WIEZIONE_PRZEZ]->(b) RETURN type(r)',{
          towar: id,
          kierowca: kierowca
       }
      )
      const result2 = await session.run(
        'MATCH (a:Towar),(b:Cel) WHERE a.id = $towar AND b.nazwa = $cel CREATE (a)-[r:SA_WIEZIONE_DO]->(b) RETURN type(r)',{
          towar: id,
          cel: cel
         }
        )
  } finally {
  await session.close()
  }
  await driver.close()
}

async function usun(){
    const id = prompt('Podaj id towaru do usunięcia: ');
    const result = await session.run(

        'MATCH (n:Towar { id: $id }) DETACH DELETE n',
        { 
            id: id
        }
      )
    console.log("Usunięto")
    await driver.close()
}

async function wyswietlWszystkie(){
  try{
    const count = await session.run('MATCH (towar:Towar) RETURN count(towar) as count',{ })
    const counted = count.records[0]
    const liczba = counted.get('count')
    const result = await session.run('MATCH (towar:Towar) RETURN towar.id, towar.nazwa, towar.ilosc, towar.wartosc, towar.miasto',{ })
    console.log("ID | NAZWA | ILOŚĆ | WARTOŚĆ")
    for(i = 0; i<liczba; i++){
      const singleRecord = result.records[i]
      console.log(singleRecord.get('towar.id'), singleRecord.get('towar.nazwa'), singleRecord.get('towar.ilosc'), singleRecord.get('towar.wartosc'))
    }
  } finally {
  await session.close()
  }
  await driver.close()
}

async function aktualizuj(){
  const id = prompt('Podaj id towaru do aktualizacji: ');
  const nazwa = prompt('Podaj nazwę towaru: ');
  const ilosc = prompt('Podaj ilość towaru: ');
  const wartosc = prompt('Podaj wartość towaru: ');

  const kierowca = prompt('Podaj id kierowcy: ');
  const cel = prompt('Podaj cel: '); 
  try {
    const result = await session.run(
    'MATCH (n { nazwa: $nazwa }) SET n.wartosc = $wartosc, n.ilosc = $ilosc RETURN n.nazwa',
      { 

        nazwa: nazwa,
        ilosc: ilosc,
        wartosc: wartosc

      }
    )
    const result1 = await session.run('MATCH (n { nazwa: $nazwa })-[r:SA_WIEZIONE_PRZEZ]->() DELETE r',{nazwa: nazwa})
    const result2 = await session.run('MATCH (n { nazwa: $nazwa })-[r:SA_WIEZIONE_DO]->() DELETE r',{nazwa: nazwa})
   const result3 = await session.run(
      'MATCH (a:Towar),(b:Kierowca) WHERE a.id = $towar AND b.id = $kierowca CREATE (a)-[r:SA_WIEZIONE_PRZEZ]->(b) RETURN type(r)',{
          towar: id,
          kierowca: kierowca
       }
      )
      const result4 = await session.run(
        'MATCH (a:Towar),(b:Cel) WHERE a.id = $towar AND b.nazwa = $cel CREATE (a)-[r:SA_WIEZIONE_DO]->(b) RETURN type(r)',{
          towar: id,
          cel: cel
         }
        )
  } finally {
  await session.close()
  }
  await driver.close()
}

async function wyswietlPoID(){
  const id = prompt('Podaj id towaru: ');
  try{

    const result = await session.run('MATCH (towar:Towar) WHERE towar.id = $towar RETURN towar.id, towar.nazwa, towar.ilosc, towar.wartosc, towar.miasto',{ towar: id,})
    console.log("ID | NAZWA | ILOŚĆ | WARTOŚĆ")

      const singleRecord = result.records[0]
      console.log(singleRecord.get('towar.id'), singleRecord.get('towar.nazwa'), singleRecord.get('towar.ilosc'), singleRecord.get('towar.wartosc'))

  } finally {
  await session.close()
  }
  await driver.close()
}

async function wyswietlPoKierowcy(){
  const id = prompt('Podaj id kierowcy: ');
  try{

    const result = await session.run('MATCH (kierowca:Kierowca) WHERE kierowca.id = $kierowca RETURN kierowca.id, kierowca.imie, kierowca.nazwisko, kierowca.wiek, kierowca.pensja',{ kierowca: id,})
    console.log("ID | IMIĘ | NAZWISKO | WIEK | PENSJA")

      const singleRecord = result.records[0]
      console.log(singleRecord.get('kierowca.id'), singleRecord.get('kierowca.imie'), singleRecord.get('kierowca.nazwisko'), singleRecord.get('kierowca.wiek'), singleRecord.get('kierowca.pensja'))

  } finally {
  await session.close()
  }
  await driver.close()
}

async function wyswietlPoCelu(){
  const id = prompt('Podaj id celu: ');
  try{

    const result = await session.run('MATCH (cel:Cel) WHERE cel.id = $cel RETURN cel.id, cel.nazwa, cel.miasto, cel.ulica, cel.numer',{ cel: id,})
    console.log("ID | NAZWA | MIASTO | ULICA | NUMER")

      const singleRecord = result.records[0]
      console.log(singleRecord.get('cel.id'), singleRecord.get('cel.nazwa'), singleRecord.get('cel.miasto'), singleRecord.get('cel.ulica'), singleRecord.get('cel.numer'))

  } finally {
  await session.close()
  }
  await driver.close()
}

async function wyswietlSzczegolyTowaru(){
  const id = prompt('Podaj id towaru: ');
  try{
    const result = await session.run('MATCH (towar:Towar) WHERE towar.id = $towar RETURN towar.id, towar.nazwa, towar.ilosc, towar.wartosc, towar.miasto',{ towar: id,})
    const singleRecord = result.records[0]
    console.log('TOWAR: \n   ID:', singleRecord.get('towar.id'), '\n   NAZWA: ', singleRecord.get('towar.nazwa'), '\n   ILOŚĆ: ', singleRecord.get('towar.ilosc'), '\n   WARTOŚĆ: ', singleRecord.get('towar.wartosc'))

    const result1 = await session.run('MATCH (:Towar { id: $id })-->(kierowca) RETURN kierowca.id',{ id: id })
    const singleRecord1 = result1.records[0]
    kierowcaID=singleRecord1.get(0)

    const result2 = await session.run('MATCH (k:Kierowca) WHERE k.id = $id RETURN k.id, k.imie, k.nazwisko, k.wiek, k.pensja',{ id: kierowcaID })
    const singleRecord2 = result2.records[0]
    kierowca=singleRecord2.get(0)
    console.log('KIEROWCA : \n   ID:', singleRecord2.get('k.id'),'\n   IMIĘ: ',singleRecord2.get('k.imie'), '\n   NAZWISKO: ',singleRecord2.get('k.nazwisko'), '\n   WIEK: ',singleRecord2.get('k.wiek'), '\n   PENSJA: ',singleRecord2.get('k.pensja'))
 
    const result3 = await session.run('MATCH (:Towar { id: $id })-->(cel) RETURN cel.id',{ id: id })
    const singleRecord3 = result3.records[0]
    celID=singleRecord3.get(0)

    const result4 = await session.run('MATCH (c:Cel) WHERE c.id = $id RETURN c.id, c.nazwa, c.miasto, c.ulica, c.numer',{ id: celID })
    const singleRecord4 = result4.records[0]
    cel=singleRecord4.get(0)
    console.log('CEL: \n   ID:', singleRecord4.get('c.id'),'\n   NAZWA: ',singleRecord4.get('c.nazwa'), '\n   MIASTO: ',singleRecord4.get('c.miasto'), '\n   ULICA: ',singleRecord4.get('c.ulica'), '\n   NUMER: ',singleRecord4.get('c.numer'))

  } finally {
  await session.close()
  }
  await driver.close()
}

async function dodajKierowce(){
  const id = prompt('Podaj id kierowcy: ');
  const imie = prompt('Podaj imię kierowcy: ');
  const nazwisko = prompt('Podaj nazwisko: ');
  const wiek = prompt('Podaj wiek: ');
  const pensja = prompt('Podaj pensję: ');
  const miasto = "Kielce";
try {
const result = await session.run(
'CREATE (a:Kierowca {id: $id, imie: $imie, nazwisko: $nazwisko, wiek: $wiek, pensja: $pensja, miasto: $miasto}) RETURN a',
  { 
      id: id,
      imie: imie,
      nazwisko: nazwisko,
      wiek: wiek,
      pensja: pensja,
      miasto: miasto
  }
)

const singleRecord = result.records[0]
const node = singleRecord.get(0)

console.log("Dodano: id:", node.properties.id,', imie:', node.properties.imie,', nazwisko:', node.properties.nazwisko,', wiek:', node.properties.wiek,', pensja:', node.properties.pensja ) //można node.properties.nazwa_pola
} finally {
await session.close()
}
await driver.close()
}

async function dodajCel(){
  const id = prompt('Podaj id celu: ');
  const nazwa = prompt('Podaj nazwę celu: ');
  const ulica = prompt('Podaj ulicę: ');
  const numer = prompt('Podaj numer: ');
  const miasto = "Kielce";
  try {
      const result = await session.run(
      'CREATE (a:Cel {id: $id, nazwa: $nazwa,miasto: $miasto, ulica: $ulica, numer: $numer}) RETURN a',
          { 
              id: id,
              nazwa: nazwa,
              miasto: miasto,
              ulica: ulica,
              numer:numer
          }
      )
      const singleRecord = result.records[0]
      const node = singleRecord.get(0)
      console.log("Dodano: id:", node.properties.id,', nazwa:', node.properties.nazwa,', miasto:', node.properties.miasto,', ulica:', node.properties.ulica,', numer:', node.properties.numer ) 
  } finally {
      await session.close()
  }
  await driver.close()
}

async function dodajRelacjeKierowcow(){
  try {
      const result = await session.run(
      'MATCH (a:Kierowca),(b:Kierowca) WHERE a.imie = $imie1 AND b.imie = $imie2 CREATE (a)-[r:ZNA]->(b) RETURN type(r)',{
          imie1: 'Jan',
          imie2: 'Janek'
       }
      )
      console.log("Dodano relacje") 
  } finally {
      await session.close()
  }
  await driver.close()
}


function Menu (){
    console.log('Firma przewozowa:');
    console.log('1. Wyswietl wszystkie towary do przewożenia');
    console.log('2. Dodaj nowy towar ');
    console.log('3. Usuń towar');
    console.log('4. Aktualizuj dane wybranego towaru ');
    console.log('5. Wyszukaj po towarze');
    console.log('6. Wyszukaj po kierowcy');
    console.log('7. Wyszukaj po celu');
    console.log('8. Wyświetl szczegóły wybranego towaru');
    console.log('9. Wyjscie');
  }

  function  action (number){
    switch (parseInt(number)) {
      case 1:
        wyswietlWszystkie()
        break;
      case 2:
        dodaj()
        break;
      case 3:
        usun()
        break;
      case 4:
        aktualizuj()
        break;
      case 5:
        wyswietlPoID()
        break;
      case 6:
        wyswietlPoKierowcy()
        break; 
      case 7:
        wyswietlPoCelu()
        break;
      case 8:
        wyswietlSzczegolyTowaru()
        break;
    }
  }

  Menu();
  const number = prompt('Wybrane: ');
  action(number)