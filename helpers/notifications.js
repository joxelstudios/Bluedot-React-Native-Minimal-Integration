import { Platform } from 'react-native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { OS } from '../enums'

export const sendLocalNotification = (message) => {
    if (Platform.OS === OS.IOS) {
        PushNotificationIOS.presentLocalNotification({
            alertTitle: 'BluedotPointSdk',
            alertBody: message,
            isSilent: true
        })
    }
}
