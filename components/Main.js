import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { useHistory } from "react-router-native"
import BluedotPointSdk from "bluedot-react-native";
import styles from "../styles";

export default function Main() {
  const [installRef, setInstallRef] = useState(null);
  const [sdkVersion, setSdkVersion] = useState(null);
  const history = useHistory()

  useEffect(() => {
    // Get device's Install Reference
    BluedotPointSdk.getInstallRef().then((instRef) => setInstallRef(instRef));
    BluedotPointSdk.getSdkVersion().then((version) => setSdkVersion(version));
  }, []);

  const unsubscribeBluedotListeners = () => {
    BluedotPointSdk.unsubscribe("enterZone", (event) => {
      console.log(JSON.stringify(event))
    });

    BluedotPointSdk.unsubscribe("exitZone", (event) => {
      console.log(JSON.stringify(event))
    });

    BluedotPointSdk.unsubscribe("zoneInfoUpdate", () => {
      console.log()
    });

    BluedotPointSdk.unsubscribe(
      "lowPowerModeDidChange",
      (event) => console.log(JSON.stringify(event))
    );

    BluedotPointSdk.unsubscribe(
      "locationAuthorizationDidChange",
      (event) => console.log(JSON.stringify(event))
    );

    BluedotPointSdk.unsubscribe(
      // This event is exclusive for iOS Location Accuracy (Precise: on/off)
      "accuracyAuthorizationDidChange",
      (event) => console.log(JSON.stringify(event))
    );

    BluedotPointSdk.unsubscribe(
      "startRequiringUserInterventionForBluetooth",
      (event) => console.log(JSON.stringify(event))
    )

    BluedotPointSdk.unsubscribe(
      "startRequiringUserInterventionForBluetooth",
      (event) => console.log(JSON.stringify(event))
    )
  };

  const handleResetSdk = () => {
    const onSuccess = () => {
      unsubscribeBluedotListeners()
      history.push('/');
    }

    const onFail = (error) => console.error('Error', error)
    
    BluedotPointSdk.reset(onSuccess, onFail)
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bluedot React Native</Text>
      </View>

      {installRef && (
        <View style={styles.titleContainer}>
          <Text style={styles.eventTitle}>Install Reference</Text>
          <Text style={styles.eventTitle}>{installRef}</Text>
        </View>
      )}

      {sdkVersion && (
        <View style={styles.titleContainer}>
          <Text style={styles.eventTitle}>SDK Version</Text>
          <Text style={styles.eventTitle}>{sdkVersion}</Text>
        </View>
      )}

      <View>
        <Button title="Geo-triggering" onPress={() => history.push('/geotriggering')}/>
        <Button title="Tempo" onPress={() => history.push('/tempo')}/>
        <Button title="Reset SDK" onPress={handleResetSdk}/>
      </View>
    </View>
  );
}
