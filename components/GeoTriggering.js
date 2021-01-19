import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useHistory } from "react-router-native";
import BluedotPointSdk from "@bluedot-innovation/bluedot-react-native";
import styles from "../styles";

export default function GeoTriggering() {
  const history = useHistory();
  const [isGeotriggeringRunning, setIsGeotriggeringRunning] = useState(false);
  const [error, setError] = useState(null);
  
  const geoTriggeringBuilder = new BluedotPointSdk.GeoTriggeringBuilder();

  useEffect(() => {
    BluedotPointSdk.isGeoTriggeringRunning().then(setIsGeotriggeringRunning);
  }, []);

  const handleStartStopGeotriggering = () => {
    const onSuccess = () => {
        BluedotPointSdk.isGeoTriggeringRunning().then(setIsGeotriggeringRunning);
    }

    const onFail = (error) => setError(error);

    if (isGeotriggeringRunning) {
      BluedotPointSdk.stopGeoTriggering(onSuccess, onFail);
    } else {
      const androidNotificationParams = {
        channelId: 'Bluedot React',
        channelName: 'Bluedot React',
        title: 'Bluedot Foreground Service - Tempo',
        content: "This app is running a foreground service using location services"
      }

      geoTriggeringBuilder
        .androidNotification(
          androidNotificationParams.channelId,
          androidNotificationParams.channelName,
          androidNotificationParams.title,
          androidNotificationParams.content
        )
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
    </View>
  );
}
