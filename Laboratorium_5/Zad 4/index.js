const couchbase = require('couchbase')
const cluster = new couchbase.Cluster(
  'couchbase://localhost',
  { username: 'Administrator', password: 'password' }
)
const bucket = cluster.bucket('zoo')
const collection = bucket.defaultCollection()
const prompt = require('prompt-sync')();
var N1qlQuery = couchbase.N1qlQuery;

async function wyswietlWszystkie() {
  const zero = '0';
  const query = `
    SELECT id, imie, gatunek, waga, wiek, sektor, stanowisko FROM \`zoo\`
  `;

  try {
    let result = await cluster.query(query)
    console.log("Result:", result)
  } catch (error) {
    console.error('Query failed: ', error)
  }
}
const upsertDocument = async (doc) => {
const key = `${doc.id}`
const result = await collection.upsert(key, doc)
console.log('Dodano zwierze')
}
const dodaj = () => {
console.log('Dodaj zwierze')
const idzw = prompt('id: ')
const imiezw = prompt('Imie: ')
const gatunekzw = prompt('Gatunek: ')
const wagazw = prompt('Waga: ')
const wiekzw = prompt('Wiek: ')
const sektorzw = prompt('Sektor: ')
const stanowiskozw = prompt('Numer stanowiska: ')

const zwierze = {
  id: idzw,
  imie: imiezw,
  gatunek: gatunekzw,
  waga: wagazw,
  wiek: wiekzw,
  sektor: sektorzw,
  stanowisko: stanowiskozw,
}
try {
  upsertDocument(zwierze)
} catch (error) {
console.error(error)
}
}
const usun = async() => {
  const zwierzeID = prompt('Podaj ID zwierzecia: ');
  try {
      const result = await collection.remove(zwierzeID,
          {
          persist_to:0,  
          replicate_to:0,
          timeout:5000}
      );
    console.log('Usunieto zwierze o podanym id:', zwierzeID)
  } catch (error) {
    console.error(error)
  }
}
async function aktualizuj() {
  const idUpdate = prompt('Modyfikacja zwierzecia o id: ');
  const imieUpdate = prompt('Aktualizuj imie zwierzecia: ');
  const query = `
    UPDATE zoo  SET 
    imie = $IMIE
    WHERE id = $ID
  `;
  const options = { parameters: { ID: idUpdate, IMIE: imieUpdate } }
  try {
    let result = await cluster.query(query, options)
    return result
  } catch (error) {
    console.error('Query failed: ', error)
  }
}
const wyswietlPoID = async() => {
  const poID = prompt('Podaj ID zwierzecia: ');
  try {
    const result = await collection.get(poID)
    console.log('Zwierze o podanym id:')
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
async function wyswietlPoGatunku() {
  const sektorz = prompt('Podaj Gatunek: ')
  const query = `
    SELECT id, imie, gatunek, waga, wiek, sektor, stanowisko FROM \`zoo\`
    WHERE gatunek=$SEKTOR
  `;
  const options = { parameters: { SEKTOR: sektorz } }

  try {
    let result = await cluster.query(query, options)
    console.log("Result:", result)
  } catch (error) {
    console.error('Query failed: ', error)
  }
}
async function wyswietlPoSektorze() {
  const sektorz = prompt('Podaj Sektor: ')
  const query = `
    SELECT id, imie, gatunek, waga, wiek, sektor, stanowisko FROM \`zoo\`
    WHERE sektor=$SEKTOR
  `;
  const options = { parameters: { SEKTOR: sektorz } }

  try {
    let result = await cluster.query(query, options)
    console.log("Result:", result)
  } catch (error) {
    console.error('Query failed: ', error)
  }
}
async function wyswietlPoSektorzeIStanowisku() {
  const sektorz = prompt('Podaj Sektor: ')
  const stanowiskoz = prompt('Numer stanowiska: ')
  const query = `
    SELECT id, imie, gatunek, waga, wiek, sektor, stanowisko FROM \`zoo\`
    WHERE sektor=$SEKTOR
    AND stanowisko=$STANOWISKO 
  `;
  const options = { parameters: { SEKTOR: sektorz, STANOWISKO: stanowiskoz } }

  try {
    let result = await cluster.query(query, options)
    console.log("Result:", result)
  } catch (error) {
    console.error('Query failed: ', error)
  }
}
  Menu = () => {
    console.log('ZOO:');
    console.log('1. Wyswietl wszystkie zwierzeta');
    console.log('2. Dodaj nowe zwierze ');
    console.log('3. Usun zwierze');
    console.log('4. Aktualizuj dane wybranego zwierzecia ');
    console.log('5. Wyszukaj po ID');
    console.log('6. Wyszukaj po gatunku');
    console.log('7. Wyszukaj po sektorze');
    console.log('8. Wyszukaj po sektorze i konkretnym stanowisku');
    console.log('9. Wyjscie');
  }

  action = (number) => {
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
        wyswietlPoGatunku()
        break; 
      case 7:
        wyswietlPoSektorze()
        break;
      case 8:
        wyswietlPoSektorzeIStanowisku()
        break;   
      case 9:
        Cluster.CloseBucket()
        break;
    }
  }

  Menu();
  const number = prompt('Wybrane: ');
  action(number)
  
