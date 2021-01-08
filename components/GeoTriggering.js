import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useHistory } from "react-router-native";
import BluedotPointSdk from "@bluedot-innovation/bluedot-react-native";
import styles from "../styles";

export default function GeoTriggering() {
  const history = useHistory();
  const [isGeotriggeringRunning, setIsGeotriggeringRunning] = useState(false);
  const [error, setError] = useState(null);
  const [zoneInfo, setZoneInfo] = useState([]);
  
  const geoTriggeringBuilder = new BluedotPointSdk.GeotriggeringBuilder()

  useEffect(() => {
    BluedotPointSdk.isGeotriggeringRunning().then(setIsGeotriggeringRunning);
    BluedotPointSdk.on("zoneInfoUpdate", () => {
      BluedotPointSdk.getZonesAndFences().then(setZoneInfo);
    });
  }, []);

  const handleStartStopGeotriggering = () => {
    const onSuccess = () => {
        BluedotPointSdk.isGeotriggeringRunning().then(setIsGeotriggeringRunning);
    }

    const onFail = (error) => setError(error);

    if (isGeotriggeringRunning) {
      BluedotPointSdk.stopGeotriggering(onSuccess, onFail);
    } else {
      geoTriggeringBuilder
        .iOSAppRestartNotification(
          "To get best experience with your order please re-open the app",
          "Press here to re-open the app"
        )
        .start(onSuccess,onFail);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eventTitle}>Geo Triggering</Text>
      {error ? <Text>Error: {error}</Text> : null}
      <Button
        title={isGeotriggeringRunning ? "Stop" : "Start"}
        onPress={handleStartStopGeotriggering}
      />
      <Button title="Back" onPress={() => history.push("/main")} />

      <View>
        {zoneInfo.length ? <Text>{JSON.stringify(zoneInfo)}</Text> : null}
      </View>
    </View>
  );
}
