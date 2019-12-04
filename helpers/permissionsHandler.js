import { Platform, PermissionsAndroid } from 'react-native';
// TODO: make it work for ios 
export let requestLocationPremissions = async () => {
    if ( Platform.OS === 'android') {
        let hasLocationPermissions = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

        if (!hasLocationPermissions) {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        };
    }

    if ( Platform.OS === 'ios') {
        navigator.geolocation.requestAuthorization()
    }
};