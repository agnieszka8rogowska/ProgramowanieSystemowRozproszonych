var cassandraDriver = require('cassandra-driver');
var client = new cassandraDriver.Client({
  contactPoints: ['localhost:9042'],
  localDataCenter: 'datacenter1'
});
const prompt = require('prompt-sync')();

client.connect(function(e) {
  var query;
  query = "CREATE KEYSPACE IF NOT EXISTS Policja WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' }";
   client.execute(query, function(e, res) {

  });
});

async function wyswietlWszystkie() {
var query;
  query = "SELECT * FROM Policja.zatrzymani";
   client.execute(query, function(e, res) {
    console.log("Wynik:", res );
  });
}

async function dodaj () {
  console.log('Dodaj zatrzymanego')
  const id = prompt('ID: ')
  const imie = prompt('Imie: ')
  const nazwisko = prompt('Nazwisko: ')
  const przestepstwo = prompt('Przestępstwo: ')
  const opis = prompt('Opis: ')
  const dzielnica = prompt('Dzielnica: ')
  const miasto = prompt('Miasto: ')
  
    const query = [
      {
        query: 'INSERT INTO Policja.zatrzymani(id, imie, nazwisko, przestepstwo, opis, dzielnica, miasto) VALUES (?, ?, ?, ?, ?, ?, ?)',
        params: [ id, imie, nazwisko, przestepstwo, opis, dzielnica, miasto ]
      }
    ];
  try {
    await client.batch(query, { prepare: true });
    console.log('Dodano dane');
  } catch (error) {
  console.error(error)
  }
}

async function usun () {
  console.log('Usun zatrzymanego')
  const id = prompt('ID: ')
    const query = [
      {
        query: 'DELETE FROM Policja.zatrzymani WHERE ID = ?',
        params: [ id]
      }
    ];
  try {
    await client.batch(query, { prepare: true });
    console.log('Usunięto zatrzymanego');
  } catch (error) {
  console.error(error)
  }
}

async function aktualizuj () {
  console.log('Aktualizuj dane zatrzymanego')
  const id = prompt('ID: ')
  const imie = prompt('Imie: ')
  const nazwisko = prompt('Nazwisko: ')
  const przestepstwo = prompt('Przestępstwo: ')
  const opis = prompt('Opis: ')
  const dzielnica = prompt('Dzielnica: ')
  const miasto = prompt('Miasto: ')

    const query = [
      {
        query: 'UPDATE Policja.zatrzymani SET imie = ?, nazwisko =?, przestepstwo =?, opis =?, dzielnica=?, miasto=?  WHERE ID = ?',
        params: [  imie, nazwisko, przestepstwo, opis, dzielnica, miasto, id ]
      }
    ];
  try {
    await client.batch(query, { prepare: true });
    console.log('Zaktualizowano dane zatrzymanego');
  } catch (error) {
  console.error(error)
  }
}

const wyswietlPoID = async() => {
  console.log('Wyświetl zatrzymanego po ID')
  const id = prompt('ID: ')
  const query = 'SELECT * FROM Policja.zatrzymani WHERE ID = ?';
  try {
    const result = await client.execute(query, [ id ], { prepare: true });
    const row = result.first();
    console.log('Wynik:', row);
  } catch (error) {
  console.error(error)
  }
}

const wyswietlPoTypie = async() => {
    console.log('Wyświetl zatrzymanych po typie przestępstwa')
    const przestepstwo = prompt('Przestępstwo: ')
    const query = 'SELECT * FROM Policja.zatrzymani WHERE przestepstwo = ? ALLOW FILTERING';   
    try {
      const result = await client.execute(query, [ przestepstwo ], { prepare: true });
      console.log('Wynik:', result);
    } catch (error) {
    console.error(error)
    }
}

const wyswietlPoDzielnicy = async() => {
  console.log('Wyświetl po dzielnicy')
  const dzielnica = prompt('Dzielnica: ')
  const query = 'SELECT * FROM Policja.zatrzymani WHERE dzielnica = ? ALLOW FILTERING';
  try {
    const result = await client.execute(query, [ dzielnica ], { prepare: true });
    console.log('Wynik:', result);
  } catch (error) {
  console.error(error)
  }
}

const wyswietlPoPrzestepstwieIDzielnicy = async() => {
  console.log('Wyświetl po typie przestępstwa oraz dzielnicy')
  const przestepstwo = prompt('Przestępstwo: ')
  const dzielnica = prompt('Dzielnica: ')
  const query = 'SELECT * FROM Policja.zatrzymani WHERE dzielnica = ? AND przestepstwo =? ALLOW FILTERING'; 
  try {
    const result = await client.execute(query, [ dzielnica, przestepstwo ], { prepare: true });
    console.log('Wynik:', result);
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
        break;
    }
  }

  Menu();
  const number = prompt('Wybrane: ');
  action(number)
  
