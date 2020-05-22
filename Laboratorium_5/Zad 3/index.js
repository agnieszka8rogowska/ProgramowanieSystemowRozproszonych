const mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://student:student@laboratorium5-c7twg.mongodb.net/test?retryWrites=true&w=majority";
const client = new mongo.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const prompt = require('prompt-sync')();

wyswietlWszystkie = () => {
  zoo.find({}).toArray((err, zooList) => {
    if (err) {
      console.log('Blad wyswietlania');
    } else {
      console.log('Wszystkie zwierzeta w zoo:', zooList);
      client.close();
    }
  });
};

dodaj = () => {
  const idzw = prompt('id: ');
  const imiezw = prompt('Imie: ');
  const gatunekzw = prompt('Gatunek: ');
  const wagazw = prompt('Waga: ');
  const wiekzw = prompt('Wiek: ');
  const sektorzw = prompt('Sektor: ');
  const stanowiskozw = prompt('Numer stanowiska: ');

  zoo.insertOne(
    {
      _id: idzw,
      imie: imiezw,
      gatunek: gatunekzw,
      waga: wagazw,
      wiek: wiekzw,
      sektor: sektorzw,
      stanowisko: stanowiskozw,      
    },
    (err) => {
      if (err) {
        console.log('Blad dodawania');
      } else {
        console.log('Dodano zwierze do bazy');
        client.close();
      }
    }
  );
};

usun = () => {
  const zwierzeId = prompt('Podaj ID, zeby usunac: ');
  zoo.deleteOne({ _id: zwierzeId });
  console.log('Usunieto dane');
};

aktualizuj = () => {
  const idUpdate = prompt('Modyfikacja zwierzecia o id: ');
  const imieUpdate = prompt('Aktualizuj imie zwierzecia: ');
  const gatunekUpdate = prompt('Aktualizuj gatunek zwierzecia: ');
  const wagaUpdate = prompt('Aktualizuj wage zwierzecia: ');
  const wiekUpdate = prompt('Aktualizuj wiek zwierzecia: ');
  const sektorUpdate = prompt('Aktualizuj sektor: ');
  const stanowiskoUpdate = prompt('Aktualizuj numer stanowiska: ');

  zoo.findOneAndUpdate(
    { _id: idUpdate },
    {
      $set: {
        _id: idUpdate,
        imie: imieUpdate,
        gatunek: gatunekUpdate,
        waga: wagaUpdate,
        wiek: wiekUpdate,
        sektor: sektorUpdate,
        stanowisko: stanowiskoUpdate, 
      },
    },
    function (err) {
      if (err) {
        console.log('Blad aktualizacji danych');
      } else {
        console.log('Uaktualniono dane');
        client.close();
      }
    }
  );
};

wyswietlPoID = () => {
  const poID = prompt('Podaj ID zwierzecia: ');
  zoo.findOne({ _id: poID }, (err, result) => {
    if (err) throw err;
    console.log(
      'Imie: ' + result.imie + 
      ', gatunek:  ' + result.gatunek +
      ', waga:  ' + result.waga +
      ', wiek:  ' + result.wiek +
      ', sektor:  ' + result.sektor +
      ', stanowisko:  ' + result.stanowisko 
      );
      client.close();
  });
};

wyswietlPoGatunku = () => {
  const poGatunku = prompt('Podaj gatunek: ');
  zoo.find({gatunek:poGatunku}).toArray((err, zooList) => {
   if (err) {
     console.log('Blad gatunku');
   } else {
     console.log('Zwierzeta z podanego gatunku:', zooList);
     client.close();
   }
 });
};

wyswietlPoSektorze = () => {
  const poSektorze = prompt('Podaj sektor: ');
  zoo.find({sektor:poSektorze}).toArray((err, zooList) => {
   if (err) {
     console.log('Blad sektoru');
   } else {
     console.log('W podanym sektorze znajduja sie zwierzeta:', zooList);
     client.close();
   }
 });
};

wyswietlPoSektorzeIStanowisku =()=>{
  const poSektorze = prompt('Podaj sektor: ');
  const poStanowisku = prompt('Podaj stanowisko: ');
  zoo.find({sektor:poSektorze, stanowisko:poStanowisku}).toArray((err, zooList) => {
   if (err) {
     console.log('Blad sektoru/stanowiska');
   } else {
     console.log('W podanym sektorze na podanym stanowisku znajduje sie zwierze:', zooList);
     client.close();
   }
 });
};


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
};

action = (number) => {
  switch (parseInt(number)) {
    case 1:
      wyswietlWszystkie();
      break;
    case 2:
      dodaj();
      break;
    case 3:
      usun();
      
      break;
    case 4:
      aktualizuj();
      break;
    case 5:
      wyswietlPoID();
      break;
    case 6:
      wyswietlPoGatunku();
      break; 
    case 7:
      wyswietlPoSektorze();
      break;
    case 8:
      wyswietlPoSektorzeIStanowisku();
      break;   
    case 9:
      client.close();
      break;
  }
};
var db;
var zoo;
client.connect(() => {
  db = client.db('zad3');
  zoo = db.collection('zoo');
  Menu();
  const number = prompt('Wybrane: ');
  action(number);
});
