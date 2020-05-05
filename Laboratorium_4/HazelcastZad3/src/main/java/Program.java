import com.hazelcast.client.HazelcastClient;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.hibernate.instance.IHazelcastInstanceFactory;

import java.net.UnknownHostException;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;

public class Program {
    static  HazelcastInstance hazelcastInstance;
    static Scanner scanner;
    static Integer r;
    static boolean exit = true;

    static void fillData(){
        Map<Integer,SerwisSamochodowy> serwisSamochodowyMap = hazelcastInstance.getMap("serwisSamochodowy");
        serwisSamochodowyMap.put(1,new SerwisSamochodowy("Jan Kowalski",1,200,"Diagnostyka komputerowa","Jan Nowak"));
        serwisSamochodowyMap.put(2,new SerwisSamochodowy("Jan Kowal",1,100,"Wymiana oleju", "Jan Nowakowski"));
        serwisSamochodowyMap.put(3,new SerwisSamochodowy("Jan Kowalczyk",1,300,"Wymiana paska rozrzadu", "Jan Nowakiewicz"));
        serwisSamochodowyMap.put(4,new SerwisSamochodowy("Jan Kowalewski",2,300,"Wymiana klockow hamulcowych", "Jan Nowaczek"));

    }

    static void all(){
        Map<Integer,SerwisSamochodowy> serwisSamochodowyMap = hazelcastInstance.getMap("serwisSamochodowy");
        System.out.println("Wszystkie przeprowadzone usługi serwisowe: ");
        for(Map.Entry<Integer,SerwisSamochodowy> e: serwisSamochodowyMap.entrySet()){
            System.out.println(e.getKey() + " - " + e.getValue().toString());
        }
    }

    static void add(){
        Map<Integer,SerwisSamochodowy> serwisSamochodowyMap = hazelcastInstance.getMap("serwisSamochodowy");
        SerwisSamochodowy serwisSamochodowy = new SerwisSamochodowy();
        System.out.println("Mechanik: ");
        serwisSamochodowy.setRepairManager(scanner.nextLine());

        System.out.println("Klient: ");
        serwisSamochodowy.setClient(scanner.nextLine());

        System.out.println("Usluga:");
        serwisSamochodowy.setDescribe(scanner.nextLine());

        System.out.println("Zakladany czas naprawy:");
        serwisSamochodowy.setTimeRepair(scanner.nextInt());

        System.out.println("Koszt: ");
        serwisSamochodowy.setPrice(scanner.nextInt());

        Integer key = r++;
        serwisSamochodowyMap.put(Math.toIntExact(key),serwisSamochodowy);
    }

    static void remove(){
        Map<Integer,SerwisSamochodowy> serwisSamochodowyMap = hazelcastInstance.getMap("serwisSamochodowy");
        System.out.println("Podaj klucz: ");
        Integer key = scanner.nextInt();
        serwisSamochodowyMap.remove(key);
    }

    static void getMechanic(){
        Map<Integer,SerwisSamochodowy> serwisSamochodowyMap = hazelcastInstance.getMap("serwisSamochodowy");
        System.out.println("Podaj imie i nazwisko mechanika: ");
        String nazwa = scanner.nextLine();

        for (Map.Entry<Integer,SerwisSamochodowy> e: serwisSamochodowyMap.entrySet()){
            if (e.getValue().getMechanic().equals(nazwa)==true){
                System.out.println(e.getKey() + " => " + e.getValue().toString());
            }
        }
    }

    static void getService(){
        System.out.println("Podaj opis:");
        Map<Long,SerwisSamochodowy> serwisSamochodowyMap = hazelcastInstance.getMap("serwisSamochodowy");
        String choose = scanner.nextLine();
        for (Map.Entry<Long,SerwisSamochodowy> e: serwisSamochodowyMap.entrySet()) {
            if((e.getValue().getService()).contains(choose))
            {
                System.out.println(e.getKey() + " => " + e.getValue().toString());
            }
        }
    }

    static private int getMenuChoice() {
        int choice = -1;
        do {
            System.out.print("Wybor: ");
            try {
                choice = Integer.parseInt(scanner   .nextLine());
            }
            catch (NumberFormatException e) {
                System.out.println("Wprowadz liczbe");
            }

        } while (choice < 1 || choice > 5);
        return choice;
    }

    static private void printMenu() {
        System.out.println("\n************************************************\n** Serwis samochodowy \n** MENU:\n** ");
        System.out.println("** 1. Wyswietlanie wszystkich danych");
        System.out.println("** 2. Dodaj nowy rekord");
        System.out.println("** 3. Usun rekord");
        System.out.println("** 4. Wyswietl uslugi konkretnego mechanika");
        System.out.println("** 5. Wyswietl po usludze");
        System.out.println("************************************************");
    }

    static private void performAction(int choice) {
        switch (choice) {
            case 1:
                all();
                break;
            case 2:
                add();
                break;
            case 3:
                remove();
                break;
            case 4:
                getMechanic();
                break;
            case 5:
                getService();
                break;
            default:
                System.out.println("Bledne dane");
        }
    }

    static public void runMenu() {
        while (exit) {
            printMenu();
            int choice = getMenuChoice();
            performAction(choice);
        }
    }

    public static void main(String[] args) throws UnknownHostException{
        hazelcastInstance = Hazelcast.newHazelcastInstance(HConfig.getConfig());
        scanner = new Scanner(System.in);
        r = 5;
        fillData();
        runMenu();
        scanner.nextInt();
    }
}
