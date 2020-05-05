import com.hazelcast.client.HazelcastClient;
import com.hazelcast.client.config.ClientConfig;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.map.EntryProcessor;
import com.hazelcast.map.IMap;

import java.io.Serializable;
import java.net.UnknownHostException;
import java.util.Map.Entry;

public class HExecuteOnEntries {

    public static void main( String[] args ) throws UnknownHostException {
        ClientConfig clientConfig = HConfig.getClientConfig();
		final HazelcastInstance client = HazelcastClient.newHazelcastClient(clientConfig);

		IMap<Long, SerwisSamochodowy> serwisSamochodowy = client.getMap("serwisSamochodowy");
		serwisSamochodowy.executeOnEntries(new HEntryProcessor());

		for (Entry<Long, SerwisSamochodowy> e : serwisSamochodowy.entrySet()) {
			System.out.println(e.getKey() + " => " + e.getValue());
		}
	}
}

class HEntryProcessor implements EntryProcessor<Long, SerwisSamochodowy, String>, Serializable {
	private static final long serialVersionUID = 1L;

	@Override
	public String process(Entry<Long, SerwisSamochodowy> e) {
		SerwisSamochodowy serwisSamochodowy = e.getValue();
		String name = serwisSamochodowy.getMechanic();
		if (name.equals(name.toLowerCase())) {
			name = name.toUpperCase();
			serwisSamochodowy.setRepairManager(name);
		} else{
			name = name.toLowerCase();
			serwisSamochodowy.setRepairManager(name);
		}
		
		System.out.println("Processing = " + serwisSamochodowy);
		e.setValue(serwisSamochodowy);
		
		return name;
	}
}
