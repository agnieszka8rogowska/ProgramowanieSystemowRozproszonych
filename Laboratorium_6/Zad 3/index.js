var storageAccount = 'agnieszkarogowska'
var accessKey= 'GQYtD+C1bDy3d8HKsy/mUP+cQxSfUZbTUVsXTv5cuhMJ3Q5h2Y8a3T9zXtBFtNM6r+C8K6ApQuYrqS9Zsx8p1A=='
var azure = require('azure-storage');
var policja = azure.createTableService(storageAccount,accessKey);
const prompt = require('prompt-sync')();

async function dodajPodstawoweDane() {
var task1 = {
    PartitionKey: {'_':'kradziez'},
    RowKey: {'_': '1'},
    opis: {'_':'Kradzież w sklepie budowlanym'},
    imie: {'_':'Jan'},
    nazwisko: {'_':'Kowalski'},
    dzielnica: {'_':'Barwinek'},
    miasto: {'_':'Kielce'}
  };
  var task2 = {
    PartitionKey: {'_':'kradziez'},
    RowKey: {'_': '2'},
    opis: {'_':'Kradzież w sklepie spozywczym'},
    imie: {'_':'Janek'},
    nazwisko: {'_':'Kowal'},
    dzielnica: {'_':'Bocianek'},
    miasto: {'_':'Kielce'}
  };
  var task3 = {
    PartitionKey: {'_':'pobicie'},
    RowKey: {'_': '3'},
    opis: {'_':'Pobicie ochroniarza'},
    imie: {'_':'Janusz'},
    nazwisko: {'_':'Kowalczyk'},
    dzielnica: {'_':'Bocianek'},
    miasto: {'_':'Kielce'}
  };
policja.insertEntity('zatrzymani', task1, {echoContent: true}, function (error, result, response) {
    if(!error){ console.log("Insert wykonany poprawnie");}});
policja.insertEntity('zatrzymani', task2, {echoContent: true}, function (error, result, response) {
    if(!error){ console.log("Insert wykonany poprawnie");}});
policja.insertEntity('zatrzymani', task3, {echoContent: true}, function (error, result, response) {
    if(!error){ console.log("Insert wykonany poprawnie");}});
}
async function wyswietlWszystkie() {
    var query = new azure.TableQuery()
    .top(5)
    .where('PartitionKey eq ?', 'pobicie')
    .or('PartitionKey eq ?', 'kradziez')
    .or('PartitionKey eq ?', 'wlamanie');

    try {
        policja.queryEntities('zatrzymani',query, null, function(error, result, response) {
            if(!error) {
                console.log('Query  ', result.entries)
            }
          });
    } catch (error) {
      console.error('Query failed: ', error)
    }
}

const dodaj = () => {
    console.log('Dodaj zatrzymanego')
    const PK = prompt('PK: ')
    const RK = prompt('RK: ')
    const opis = prompt('Opis: ')
    const imie = prompt('Imie: ')
    const nazwisko = prompt('Nazwisko: ')
    const dzielnica = prompt('Dzielnica: ')
    const miasto = prompt('Miasto: ')

    var task = {
        PartitionKey: {'_':PK},
        RowKey: {'_': RK},
        opis: {'_':opis},
        imie: {'_':imie},
        nazwisko: {'_':nazwisko},
        dzielnica: {'_':dzielnica},
        miasto: {'_':miasto}
      };


    try {
        policja.insertEntity('zatrzymani', task, {echoContent: true}, function (error, result, response) {
            if(!error){ 
                console.log("Insert wykonany poprawnie");
            }});
    } catch (error) {
    console.error(error)
    }
}

const usun = async() => {
    const PK = prompt('Podaj PK do usuniecia: ');
    const RK = prompt('Podaj RK do usuniecia: ');
    var task = {
        PartitionKey: {'_':PK},
        RowKey: {'_': RK}
      };
    try {
          policja.deleteEntity('zatrzymani', task, function(error, response){
            if(!error) {
                console.log("Usunieto");
            }
          });
    } catch (error) {
        console.error(error)
    }
}

async function aktualizuj() {
    const PK = prompt('Aktualizacja zatrzymanego o PK: ');
    const RK = prompt('RK: ')
    const opis = prompt('Opis: ')
    const imie = prompt('Imie: ')
    const nazwisko = prompt('Nazwisko: ')
    const dzielnica = prompt('Dzielnica: ')
    const miasto = prompt('Miasto: ')

    var updatedTask = {
        PartitionKey: {'_':PK},
        RowKey: {'_': RK},
        opis: {'_':opis},
        imie: {'_':imie},
        nazwisko: {'_':nazwisko},
        dzielnica: {'_':dzielnica},
        miasto: {'_':miasto}
      };
    try {
        policja.replaceEntity('zatrzymani', updatedTask, function(error, result, response){
            if(!error) {
                console.log("Update wykonany poprawnie");
            }
          });
    } catch (error) {
      console.error('Wystapil blad ', error)
    }
}

const wyswietlPoID = async() => {
    const RK = prompt('Podaj ID zatrzymanego: ');
    var query = new azure.TableQuery()
    .where('RowKey eq ?', RK);
    try {
        policja.queryEntities('zatrzymani',query, null, function(error, result, response) {
            if(!error) {
                console.log("Wynik", result.entries);
            }
          });
    } catch (error) {
    console.error(error)
    }
}

async function wyswietlPoTypie() {
    const PK = prompt('Podaj typ przestępstwa: ');
    var query = new azure.TableQuery()
    .where('PartitionKey eq ?', PK);
    try {
        policja.queryEntities('zatrzymani',query, null, function(error, result, response) {
            if(!error) {
                console.log("Wynik", result.entries);
            }
          });
    } catch (error) {
    console.error(error)
    }
}

async function wyswietlPoDzielnicy() {
    const dzielnica = prompt('Podaj dzielnicę: ');
    var query = new azure.TableQuery()
    .where('dzielnica eq ?', dzielnica);
    try {
        policja.queryEntities('zatrzymani',query, null, function(error, result, response) {
            if(!error) {
                console.log("Wynik", result.entries);
            }
          });
    } catch (error) {
    console.error(error)
    }
}

async function wyswietlPoPrzestepstwieIDzielnicy() {
    const PK = prompt('Podaj przestępstwo: ');
    const dzielnica = prompt('Podaj dzielnicę: ');
    var query = new azure.TableQuery()
    .where('dzielnica eq ?', dzielnica)
    .and('PartitionKey eq ?', PK);
    try {
        policja.queryEntities('zatrzymani',query, null, function(error, result, response) {
            if(!error) {
                console.log("Wynik", result.entries);
            }
          });
    } catch (error) {
    console.error(error)
    }
}

Menu = () => {
    console.log('Policja:');
    console.log('1. Wyswietl wszystkich zatrzymanych');
    console.log('2. Dodaj nowego zatrzymanego ');
    console.log('3. Usuń zatrzymanego');
    console.log('4. Aktualizuj dane wybranego zatrzymanego ');
    console.log('5. Wyszukaj po ID');
    console.log('6. Wyszukaj po typie przestępstwa');
    console.log('7. Wyszukaj po dzielnicy');
    console.log('8. Wyszukaj po typie przestępstwa i konkretnej dzielnicy');
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
        wyswietlPoTypie()
        break; 
      case 7:
        wyswietlPoDzielnicy()
        break;
      case 8:
        wyswietlPoPrzestepstwieIDzielnicy()
        break;   
      case 9:
        Cluster.CloseBucket()
        break;
    }
  }
  dodajPodstawoweDane();
  Menu();
  const number = prompt('Wybrane: ');
  action(number)
  