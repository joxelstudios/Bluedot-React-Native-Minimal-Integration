import React, { useState } from "react";
import { Platform, Text, View, Button } from "react-native";
import BluedotPointSdk from "bluedot-react-native";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { sendLocalNotification } from "../helpers/notifications";
import { OS, LOCATION_PERMISSIONS } from "../enums";
import Tempo from "./Tempo";
import styles from "../styles";

const PROJECTID = "4269e393-0870-4d37-a4d0-574f7ef8fe2f";

export default function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [locationPermissions, setLocationPermissions] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventData, setEventData] = useState("");
  const [hasTempoStarted, setHasTempoStarted] = useState(false);
  const [installRef, setInstallRef] = useState(null);

  React.useEffect(() => {
    // Get device's Install Reference
    BluedotPointSdk.getInstallRef().then((value) => setInstallRef(value));

    registerBluedotListeners();

    const channelId = "Bluedot React";
    const channelName = "Bluedot React";
    const title = "Bluedot Foreground Service";
    const content =
      "This app is running a foreground service using location services";

    BluedotPointSdk.setForegroundNotification(
      channelId,
      channelName,
      title,
      content,
      true
    );

    // Set custom event metadata
    BluedotPointSdk.setCustomEventMetaData({
      CustomerName: "Demo Customer",
    });

    checkLocationPermissions();
  }, []);

  const checkLocationPermissions = async () => {
    if (Platform.OS === OS.IOS) {
      const hasLocationAlwaysPermission =
        (await check(PERMISSIONS.IOS.LOCATION_ALWAYS)) === RESULTS.GRANTED;
      const hasLocationWhileInUsePermission =
        (await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)) === RESULTS.GRANTED;

      if (hasLocationAlwaysPermission) {
        setLocationPermissions(LOCATION_PERMISSIONS.ALWAYS);
      }

      if (hasLocationWhileInUsePermission) {
        setLocationPermissions(LOCATION_PERMISSIONS.WHILE_IN_USE);
      }
    }
  };

  const registerBluedotListeners = () => {
    BluedotPointSdk.on("zoneInfoUpdate", (event) => {
      const eventData = `There are ${event.zoneInfos.length} zones`;
      setEventName("zoneInfoUpdate");
      setEventData(eventData);
    });

    BluedotPointSdk.on("checkedIntoFence", (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`;
      sendLocalNotification(message);
      setEventName("checkedIntoFence");
      setEventData(message);
    });

    BluedotPointSdk.on("checkedOutFromFence", (event) => {
      const message = `You have checked out from ${event.zoneInfo.name}`;
      sendLocalNotification(message);
      setEventName("checkedOutFromFence");
      setEventData(message);
    });

    BluedotPointSdk.on("checkedIntoBeacon", (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`;
      sendLocalNotification(message);
      setEventName("checkedIntoBeacon");
      setEventData(message);
    });

    BluedotPointSdk.on("checkedOutFromBeacon", (event) => {
      const message = `You have checked out from ${event.zoneInfo.name}`;
      sendLocalNotification(message);
      setEventName("checkedOutFromBeacon");
      setEventData(message);
    });

    BluedotPointSdk.on(
      "startRequiringUserInterventionForLocationServices",
      (event) => {
        const eventData = JSON.stringify(event);
        setEventName("startRequiringUserInterventionForLocationServices");
        setEventData(eventData);
      }
    );

    BluedotPointSdk.on(
      "stopRequiringUserInterventionForLocationServices",
      (event) => {
        const eventData = JSON.stringify(event);
        setEventName("stopRequiringUserInterventionForLocationServices");
        setEventData(eventData);
      }
    );

    // Tempo Events
    BluedotPointSdk.on("tempoStarted", (event) => {
      const eventData = JSON.stringify(event);
      setEventName("tempoStarted");
      setEventData(eventData);
      setHasTempoStarted(true);
    });

    BluedotPointSdk.on("tempoStopped", (event) => {
      const eventData = JSON.stringify(event);
      setEventName("tempoStopped");
      setEventData(eventData);
      setHasTempoStarted(false);
    });

    BluedotPointSdk.on("tempoStartError", (event) => {
      const eventData = JSON.stringify(event);
      setEventName("tempoStartError");
      setEventData(eventData);
      setHasTempoStarted(false);
    });
  };

  const handlePress = () => {
    isAuthenticated ? handleLogout() : handleAuthenticate();
  };

  const handleAuthenticate = () => {
    const onSuccess = () => {
      setIsAuthenticated(true);
      registerBluedotListeners();
    };

    const onFail = () => {
      setIsAuthenticated(false);
      setEventData("---   AUTHENTICATION FAILED    ---");
    };

    BluedotPointSdk.authenticate(
      PROJECTID,
      locationPermissions,
      onSuccess,
      onFail
    );
  };

  handleLogout = () => {
    const onSuccess = () => {
      setIsAuthenticated(false);
      setEventName("");
      setEventData("");
    };

    const onFail = () => {
      setEventData("Fail logging out");
    };

    BluedotPointSdk.logOut(onSuccess, onFail);
  };

  handleInitializeSDK = () => {
    const onSuccess = () => {
      setIsAuthenticated(true);
      registerBluedotListeners();
    };

    const onFail = () => {
      setIsAuthenticated(false);
      setEventData("---   AUTHENTICATION FAILED    ---");
    };

    BluedotPointSdk.initialize(PROJECTID, onSuccess, onFail);
  };

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

      <View>
        <Button title="Initialize SDK" onPress={initializeSdk} />
      </View>

      <Button
        title={isAuthenticated ? "Logout" : "Authenticate"}
        onPress={handlePress}
      />

      {isAuthenticated && <Tempo hasStarted={hasTempoStarted} />}
    </View>
  );
}
