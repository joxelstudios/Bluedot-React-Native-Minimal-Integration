import {useState, useEffect, useCallback} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {Platform, PermissionsAndroid, Alert} from 'react-native';

const useLocationPermission = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePermissionDenied = useCallback(() => {
    Alert.alert(
      'Location permissions denied',
      'Please enable location permissions.',
    );
  }, []);

  const requestAndroidPermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        setPermissionGranted(true);
      } else {
        setPermissionGranted(false);
        handlePermissionDenied();
      }
    } catch (err) {
      console.warn(err);
    }
  }, [handlePermissionDenied]);

  const requestIOSPermission = useCallback(() => {
    Geolocation.requestAuthorization('always')
      .then(result => {
        if (result === 'granted') {
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
          handlePermissionDenied();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [handlePermissionDenied]);

  const requestPermission = useCallback(() => {
    if (Platform.OS === 'android') {
      requestAndroidPermission().catch(error => {
        console.error(error);
      });
    } else {
      requestIOSPermission();
    }
  }, [requestAndroidPermission, requestIOSPermission]);

  useEffect(() => {
    requestPermission();
    setLoading(false);
  }, [requestPermission]);

  return {permissionGranted, loading, requestPermission};
};

export default useLocationPermission;
