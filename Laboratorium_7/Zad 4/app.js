"use strict";

const Gremlin = require('gremlin');
const config = require("./config");
const prompt = require('prompt-sync')();
const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.primaryKey)

const client = new Gremlin.driver.Client(
    
    config.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }

);
function dodajWszystkie()
{

    return    client.submit("g.addV('towar').property('id', 'telewizory').property('nazwa', 'Telewizory LG').property('ilosc', '100').property('wartosc', '400000').property('miasto', 'Kielce')")
        .then(client.submit("g.addV('towar').property('id', 'meble').property('nazwa', 'Szafy do zabudowy').property('ilosc', '10').property('wartosc', '35000').property('miasto', 'Kielce')"))
        .then(client.submit("g.addV('towar').property('id', 'rowery').property('nazwa', 'Rowery').property('ilosc', '20').property('wartosc', '20000').property('miasto', 'Kielce')"))
        .then(client.submit("g.addV('cel').property('id', 'sklepsportowy').property('nazwa', 'Sklep Sportowy').property('miasto', 'Kielce').property('ulica', 'Warszawska').property('numer', '123')"))
        .then(client.submit("g.addV('cel').property('id', 'sklepmeblowy').property('nazwa', 'Sklep Meblowy').property('miasto', 'Kielce').property('ulica', 'Domaszowska').property('numer', '12')"))
        .then(client.submit("g.addV('cel').property('id', 'sklepzelektronika').property('nazwa', 'Sklep z Elektronika').property('miasto', 'Kielce').property('ulica', 'Seminaryjska').property('numer', '23')"))
        .then(client.submit("g.addV('kierowca').property('id', 'jan').property('imie', 'Jan').property('nazwisko', 'Kowalski').property('miasto', 'Kielce').property('wiek', '35').property('pensja', '3500')"))
        .then(client.submit("g.addV('kierowca').property('id', 'janusz').property('imie', 'Janusz').property('nazwisko', 'Kowal').property('miasto', 'Kielce').property('wiek', '30').property('pensja', '3500')"))
        .then(client.submit("g.addV('kierowca').property('id', 'janek').property('imie', 'Janek').property('nazwisko', 'Kowalewski').property('miasto', 'Kielce').property('wiek', '40').property('pensja', '4000')"))
        .then(client.submit("g.V('telewizory').addE('sa_wiezione_przez').to(g.V('janek'))"))
        .then(client.submit("g.V('rowery').addE('sa_wiezione_przez').to(g.V('jan'))"))
        .then(client.submit("g.V('meble').addE('sa_wiezione_przez').to(g.V('janusz'))"))
        .then(client.submit("g.V('telewizory').addE('sa_wiezione_do').to(g.V('sklepzelektronika'))"))
        .then(client.submit("g.V('rowery').addE('sa_wiezione_do').to(g.V('sklepsportowy'))"))
        .then(client.submit("g.V('meble').addE('sa_wiezione_do').to(g.V('sklepmeblowy'))"))
        .then(client.submit("g.V('janek').addE('zna').to(g.V('janusz'))"))
        .then(client.submit("g.V('janek').addE('zna').to(g.V('jan'))"))
        .then(client.submit("g.V('janusz').addE('zna').to(g.V('jan'))"))
        .then(function (result) {
            console.log('DODAWANIE OSOB i relacji');
        });
}

function dodaj()
{
    const id = prompt('Podaj id towaru: ');
    const nazwa = prompt('Podaj nazwę towaru: ');
    const ilosc = prompt('Podaj ilość towaru: ');
    const wartosc = prompt('Podaj wartość towaru: ');
    const kierowca = prompt('Podaj id kierowcy: ');
    const cel = prompt('Podaj cel: '); 
    const relacja1 = 'sa_wiezione_przez';
    const relacja2 = 'sa_wiezione_do';
    return client.submit("g.addV('towar').property('id', id).property('nazwa', nazwa).property('ilosc', ilosc).property('wartosc', wartosc).property('miasto', 'Kielce')", {
        id: id,
        nazwa: nazwa,
        ilosc: ilosc,
        wartosc: wartosc
        })
        .then(addEdge(id, kierowca, relacja1))
        .then(addEdge(id, cel, relacja2))
        .then(function (result) {
            console.log("Dodano towar oraz relacje: \n", JSON.stringify(result));
        });
}

function addEdge(first, second, relationship)
{
    return client.submit("g.V(first).addE(relationship).to(g.V(second))", {
            first:first, 
            relationship:relationship, 
            second: second
        }).then(function (result) {
            //console.log("Dodano towar oraz relacje");
        });
}

function wyswietlWszystkie(){
    console.log('Wszystkie towary');

    return client.submit("g.V().hasLabel('towar').has('miasto','Kielce').values('id','nazwa','ilosc','wartosc')", { 
    }).then(function (result) {
        console.log("Result: ", result );
    });
}

function usun(){
    const id = prompt('Podaj id towaru do usunięcia: ');
    return client.submit("g.V().hasLabel('towar').has('id', id).drop()", {
        id: id
        })
        .then(function (result) {
            console.log("Usunięto");
        });
}

function aktualizuj()
{
    const id = prompt('Podaj id towaru: ');
    const nazwa = prompt('Podaj nazwę towaru: ');
    const ilosc = prompt('Podaj ilość towaru: ');
    const wartosc = prompt('Podaj wartość towaru: ');
    const kierowca = prompt('Podaj id kierowcy: ');
    const cel = prompt('Podaj cel: '); 
    const relacja1 = 'sa_wiezione_przez';
    const relacja2 = 'sa_wiezione_do';
    return client.submit("g.V().hasLabel('towar').has('id', id).property('nazwa', nazwa).property('ilosc', ilosc).property('wartosc', wartosc)", {
        id: id,
        nazwa: nazwa,
        ilosc: ilosc,
        wartosc: wartosc
        })
        .then(addEdge(id, kierowca, relacja1))
        .then(addEdge(id, cel, relacja2))
        .then(function (result) {
            console.log("Result: %s\n", JSON.stringify(result));
        });
}

function wyswietlPoID(){
    const id = prompt('Podaj towar do wyswietlenia: ');
    return client.submit("g.V().hasLabel('towar').has('id',id).values('id','nazwa','ilosc','wartosc','miasto')", {
        id: id
    }).then(function (result) {
        console.log("Result: \n", result);
    });
}

function wyswietlPoKierowcy(){
    const kierowca = prompt('Podaj nazwisko kierowcy do wyswietlenia: ');
    return client.submit("g.V().hasLabel('kierowca').has('nazwisko',nazwisko).values('imie','nazwisko','wiek','pensja')", {
        nazwisko: kierowca
    }).then(function (result) {
        console.log("Result: \n", result);
    });
}

function wyswietlPoCelu(){
    const cel = prompt('Podaj cel zlecenia do wyswietlenia: ');
    return client.submit("g.V().hasLabel('cel').has('nazwa',cel).values('nazwa','miasto','ulica','numer')", {
        cel: cel
    }).then(function (result) {
        console.log("Result: \n", result);
    });
}

function finish()
{
    console.log("Zakończono");
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
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
        //console.log('---8. Wyszukaj po towarze, celu i kierowcy');
        console.log('8. Wyjscie');
      }
    
function OtworzKlienta(funkcja){
    client.open()
    .then(funkcja)
    .catch((err) => {
        console.error("Błąd podczas wyświtlania danych");
        console.error(err)
    }).then((res) => {
        client.close();
        finish();
    }).catch((err) => 
        console.error("Fatal error:", err)
    );
}

    function  action (number){
        switch (parseInt(number)) {
          case 1:
            OtworzKlienta(wyswietlWszystkie);
            break;
          case 2:
            OtworzKlienta(dodaj);
            break;
          case 3:
            OtworzKlienta(usun);
            break;
          case 4:
            OtworzKlienta(aktualizuj);
            break;
          case 5:
            OtworzKlienta(wyswietlPoID);
            break;
          case 6:
            OtworzKlienta(wyswietlPoKierowcy);
            break; 
          case 7:
            OtworzKlienta(wyswietlPoCelu);
            break;
          case 8:
            
            break;
        }
      }
    
      Menu();
      const number = prompt('Wybrane: ');
      action(number)