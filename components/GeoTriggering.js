import React, { useState, useEffect } from "react";
import { Button, Platform, Text, View } from "react-native";
import { useHistory } from "react-router-native";
import BluedotPointSdk from "@bluedot-innovation/bluedot-react-native";
import styles from "../styles";

export default function GeoTriggering() {
  const history = useHistory();
  const [isGeotriggeringRunning, setIsGeotriggeringRunning] = useState(false);
  const [error, setError] = useState(null);

  const geoTriggeringBuilder = new BluedotPointSdk.GeoTriggeringBuilder();

  useEffect(() => {
    BluedotPointSdk.isGeoTriggeringRunning().then((isRunning) => {
      setIsGeotriggeringRunning(isRunning);
    });
  }, []);

  const handleStartGeotriggering = () => {
    const onSuccessCallback = () => setIsGeotriggeringRunning(true)
    const onFailCallback = (error) => setError(error);

    geoTriggeringBuilder
    .iOSAppRestartNotification("Press here to restart the app", "Press here to restart the app")
    .start(onSuccessCallback, onFailCallback);
  };

  const handleStartGeotriggeringWithAndroidNotification = () => {
    const onSuccessCallback = () => setIsGeotriggeringRunning(true);
    const onFailCallback = (error) => setError(error);

    const androidNotificationParams = {
      channelId: "Bluedot React",
      channelName: "Bluedot React",
      title: "Bluedot Foreground Service - Geo-triggering",
      content:
        "This app is running a foreground service using location services",
      notificationId: 123,
    };

    geoTriggeringBuilder
      .androidNotification(
        androidNotificationParams.channelId,
        androidNotificationParams.channelName,
        androidNotificationParams.title,
        androidNotificationParams.content,
        androidNotificationParams.notificationId
      )
      .start(onSuccessCallback, onFailCallback);
  };

  const handleStopGeotriggering = () => {
    function onSuccessCallback() {
      setIsGeotriggeringRunning(false);
    }
    function onFailCallback(error) {
      setError(error);
    }

    BluedotPointSdk.stopGeoTriggering(onSuccessCallback, onFailCallback);
  };

  const renderStartButtons = () => {
    return (
      <>
        {Platform.OS === "android" && (
          <Button
            title={"Start with foreground notification"}
            onPress={handleStartGeotriggeringWithAndroidNotification}
            style={styles.button}
          />
        )}

        <Button
          title={"Start"}
          onPress={handleStartGeotriggering}
          style={styles.button}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eventTitle}>Geo Triggering</Text>
      {error ? <Text>Error: {error}</Text> : null}
      {isGeotriggeringRunning ? (
        <Button
          title={"Stop"}
          onPress={handleStopGeotriggering}
          style={styles.button}
        />
      ) : (
        renderStartButtons()
      )}

      <Button
        title="Back"
        onPress={() => history.push("/main")}
        style={styles.button}
      />

    </View>
  );
}