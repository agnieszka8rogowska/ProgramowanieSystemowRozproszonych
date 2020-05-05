import java.io.Serializable;
import java.util.Map;

public class SerwisSamochodowy implements Serializable {

    private static final long serialVersionUID = 1L;

    private String mechanik;
    private int czas_naprawy;
    private int koszt;
    private String usluga;
    private String klient;

    public SerwisSamochodowy(){}

    public SerwisSamochodowy(String mechanik, int czas_naprawy, int koszt, String usluga, String klient) {
        this.mechanik = mechanik;
        this.czas_naprawy = czas_naprawy;
        this.koszt = koszt;
        this.usluga = usluga;
        this.klient = klient;
    }

    public String getMechanic() {
        return mechanik;
    }
    public String getService() {
        return usluga;
    }
    public void setRepairManager(String mechanik) {
        this.mechanik = mechanik;
    }
    public void setClient(String klient) {
        this.klient = klient;
    }
    public void setTimeRepair(int czas_naprawy) {
        this.czas_naprawy = czas_naprawy;
    }
    public void setPrice(int koszt) {
        this.koszt = koszt;
    }
    public void setDescribe(String usluga) {
        this.usluga = usluga;
    }

    @Override
    public String toString() {
        return "|" + "mechanik='" + mechanik + '\'' + "| klient='" + klient + '\'' + "| czas_naprawy=" + czas_naprawy + "| koszt=" + koszt + "| usluga='" + usluga + '\'' + '|';
    }
}
