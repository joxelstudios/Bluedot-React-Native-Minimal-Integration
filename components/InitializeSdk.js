import React, { useState, useEffect } from "react";
import BluedotPointSdk from "@bluedot-innovation/bluedot-react-native";
import { useHistory } from "react-router";
import { Button, Platform, Text, TextInput, View } from "react-native";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { sendLocalNotification } from "../helpers/notifications";
import { OS, LOCATION_PERMISSIONS } from "../enums";
import styles from "../styles";

const PROJECTID = "4269e393-0870-4d37-a4d0-574f7ef8fe2f";

export default function Initialize() {
  const [projectId, setProjectId] = useState(PROJECTID);
  const [error, setError] = useState(null);
  const [locationPermissions, setLocationPermissions] = useState("");
  const history = useHistory();

  useEffect(() => {
    BluedotPointSdk.isInitialized().then((isInitialized) => {
      if (isInitialized) history.push("/main");
    });

    checkLocationPermissions();
    registerBluedotListeners();

    // Set custom event metadata.
    // We suggest to set the Custom Event Meta Data before starting GeoTriggering or Tempo.
    BluedotPointSdk.setCustomEventMetaData({
      orderId: "order_1234",
      storeId: "store_5678",
      carModel: "ford",
      carColor: "blue",
    });
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
    // NEW EVENTS
    BluedotPointSdk.on("enterZone", (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`;
      sendLocalNotification(message);
    });

    BluedotPointSdk.on("exitZone", (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`;
      sendLocalNotification(message);
    });

    BluedotPointSdk.on("zoneInfoUpdate", () => {
      BluedotPointSdk.getZonesAndFences().then(console.log);
    });

    BluedotPointSdk.on("checkedIntoBeacon", (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`;
      sendLocalNotification(message);
    });

    BluedotPointSdk.on("checkedOutFromBeacon", (event) => {
      const message = `You have checked out from ${event.zoneInfo.name}`;
      sendLocalNotification(message);
    });

    BluedotPointSdk.on(
      "lowPowerModeDidChange",
      (event) => console.log(JSON.stringify(event))
    );

    BluedotPointSdk.on(
      "locationAuthorizationDidChange",
      (event) => console.log(JSON.stringify(event))
    );

    BluedotPointSdk.on(
      // This event is exclusive for iOS Location Accuracy (Precise: on/off)
      "accuracyAuthorizationDidChange",
      (event) => console.log(JSON.stringify(event))
    );

    BluedotPointSdk.on(
      "startRequiringUserInterventionForBluetooth",
      (event) => console.log(JSON.stringify(event))
    )

    BluedotPointSdk.on(
      "startRequiringUserInterventionForBluetooth",
      (event) => console.log(JSON.stringify(event))
    )
  };

  function handleInitializeSDK() {
    function onSuccess() {
      history.push("/main");
    }

    function onFail(error) {
      setError(error);
    }

    BluedotPointSdk.initialize(projectId, onSuccess, onFail);
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bluedot React Native</Text>
      </View>

      <Text style={styles.eventTitle}>Project ID</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setProjectId}
        value={projectId}
        placeholder="Use your project Id here"
      />

      {error !== null && <Text>Error authenticating {error}</Text>}

      <Button
        title="Initialize"
        onPress={handleInitializeSDK}
        disabled={Boolean(!projectId)}
      />
    </View>
  );
}
