import { Platform, PermissionsAndroid } from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { OS } from '../enums'

export const requestLocationPermissions = async () => {
    if (Platform.OS === OS.ANDROID) {
        const hasLocationPermissions = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

        if (!hasLocationPermissions) {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        };
    }

    if (Platform.OS === OS.IOS) {
        Geolocation.requestAuthorization()
    }
};

export const requestBluetoothPermissions = async () => {
    if (Platform.OS === OS.IOS) {
        await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL)
    }
}