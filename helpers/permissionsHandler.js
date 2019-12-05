import { Platform, PermissionsAndroid } from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import { OS } from '../enums'

export let requestLocationPermissions = async () => {
    if (Platform.OS === OS.ANDROID) {
        let hasLocationPermissions = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

        if (!hasLocationPermissions) {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        };
    }

    if (Platform.OS === OS.IOS) {
        navigator.geolocation.requestAuthorization()
    }
};

export let requestBluetoothPermissions = async () => {
    if (Platform.OS === OS.IOS) {
        await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL)
    }
}