import { Platform } from "react-native";
import { request, checkMultiple, requestMultiple, PERMISSIONS, requestNotifications } from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";
import { OS } from "../enums";

export const requestLocationPermissions = async () => {
  if (Platform.OS === OS.ANDROID) {
    const currentPermissions = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    ])

    const hasLocationPermissions = currentPermissions["android.permission.ACCESS_BACKGROUND_LOCATION"] === 'granted' && currentPermissions["android.permission.ACCESS_FINE_LOCATION"] === 'granted'

    if (!hasLocationPermissions) {
        requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        ])
    }
  }

  if (Platform.OS === OS.IOS) {
    Geolocation.requestAuthorization();
  }
};

export const requestBluetoothPermissions = async () => {
  if (Platform.OS === OS.IOS) {
    await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
  }
};

export const requestNotificationPermissions = async () => {
  if (Platform.OS === OS.IOS) {
    await requestNotifications(['alert', 'sound']).then(({status, settings}) => {
      console.log("Notification Permission Status: " + status);
    });
  }
};
