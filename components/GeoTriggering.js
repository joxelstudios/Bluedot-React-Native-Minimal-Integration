import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useHistory } from "react-router-native";
import BluedotPointSdk from "@bluedot-innovation/bluedot-react-native";
import styles from "../styles";

export default function GeoTriggering() {
  const history = useHistory();
  const [isGeotriggeringRunning, setIsGeotriggeringRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    BluedotPointSdk.isGeotriggeringRunning()
        .then(setIsGeotriggeringRunning);
  }, []);

  const handleStartStopGeotriggering = () => {
    const onSuccess = () => BluedotPointSdk.isGeotriggeringRunning().then(setIsGeotriggeringRunning);
    const onFail = (error) => setError(error);

    if (isGeotriggeringRunning) {
        BluedotPointSdk.stopGeotriggering(onSuccess, onFail);
    } else {
        BluedotPointSdk.startGeotriggeringWithAppRestartNotification("Restart the app to keep tracking you", "Press here to open the app", onSuccess, onFail)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eventTitle}>Geo Triggering</Text>
      { error ? <Text>Error: {error}</Text> : null }
      <Button title={isGeotriggeringRunning ? "Stop" : "Start"} onPress={handleStartStopGeotriggering} />
      <Button title="Back" onPress={() => history.push("/main")} />
    </View>
  );
}
