import React, { useState, useEffect } from "react";
import { Button, Platform, Text, View, Switch } from "react-native";
import { useNavigate } from "react-router";
import BluedotPointSdk from "bluedot-react-native";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GeoTriggering() {

  const navigate = useNavigate();
  const [isGeotriggeringRunning, setIsGeotriggeringRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isBackgroundLocationUpdatesEnabled, setIsBackgroundLocationUpdatesEnabled] = useState(false);
  const allowsBackgroundLocationUpdatesString = "allowsBackgroundLocationUpdates";
  const toggleSwitch = async (value) => {
    setIsBackgroundLocationUpdatesEnabled(value);
    BluedotPointSdk.allowsBackgroundLocationUpdates(value);
    try {
    await AsyncStorage.setItem(allowsBackgroundLocationUpdatesString, value.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const geoTriggeringBuilder = new BluedotPointSdk.GeoTriggeringBuilder();
  let isBackgroundLocationUpdatesEnabledString = `Is Background Location Enabled: ${isBackgroundLocationUpdatesEnabled}`;

  useEffect(() => {
    BluedotPointSdk.isGeoTriggeringRunning().then((isRunning) => {
      setIsGeotriggeringRunning(isRunning);
    });

    const retrieveBackgroundLocationStatus = async () => {
      try {
        const isBackgroundLocationUpdatesAllowed = ((await AsyncStorage.getItem(allowsBackgroundLocationUpdatesString) || 'false') === 'true')
        if(isBackgroundLocationUpdatesAllowed !== null) {
          setIsBackgroundLocationUpdatesEnabled(isBackgroundLocationUpdatesAllowed);
        }
      } catch(e) {
        console.log(e);
      }
    };
    
    retrieveBackgroundLocationStatus();

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
      <Text>Allow Background Location Updates</Text>
      { Platform.OS == "ios" ? (
        <Switch
          onValueChange={toggleSwitch}
          value={isBackgroundLocationUpdatesEnabled}
        />
        ): {}}
      { Platform.OS == "ios" ? (
        <Text>{isBackgroundLocationUpdatesEnabledString}</Text>
        ): {}}
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
        onPress={() => navigate("/main")}
        style={styles.button}
      />

    </View>
  );
}