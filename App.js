import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, NativeEventEmitter, Button } from 'react-native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import BluedotPointSdk from '@bluedot-innovation/react-native-library';
import { requestLocationPremissions } from './helpers/permissionsHandler';
import { check, PERMISSIONS } from 'react-native-permissions';

// DARREN API KEY
const APIKEY = 'c2674ef0-5d4f-11e8-90a2-0af2bfcd2e22';

// DANIEL API KEY
// const APIKEY = '647bff30-c8c1-11e6-b298-b8ca3a6b879d';

const TRUNCATE_LENGTH = 70

export default class App extends Component {
  state = {
    status: 'starting',
    message: '--',
    buttonTitle: 'Authenticate',
    ruleRequestMessage: null,
    locationPermissions: 'Always',
    eventName: '',
    eventData: ''
  };

  componentDidMount = async () => {
    // Ask location permission 
    requestLocationPremissions();

    if (Platform.OS === 'ios') {
      const hasLocationAlwaysPermission = await check(PERMISSIONS.IOS.LOCATION_ALWAYS) === 'granted'
      const hasLocationWhileInUsePermission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE) === 'granted'

      if (hasLocationAlwaysPermission) {
        this.setState({ locationPermissions: 'Always' })
      }

      if (hasLocationWhileInUsePermission) {
        this.setState({ locationPermissions: 'WhileInUse' })
      }
    }

    const eventEmitter = new NativeEventEmitter(BluedotPointSdk)

    eventEmitter.addListener('zoneInfoUpdate', (event) => {
      const eventData = JSON.stringify(event).substring(0, TRUNCATE_LENGTH)
      this.setState({ eventName: 'zoneInfoUpdate', eventData })
    })

    eventEmitter.addListener('checkedIntoFence', (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`

      if (Platform.OS === 'ios') {
        PushNotificationIOS.presentLocalNotification({
          alertTitle: 'BluedotPointSdk',
          alertBody: message,
          isSilent: true
        })
      }

      this.setState({ eventName: 'checkedIntoFence', eventData: message })
    })

    eventEmitter.addListener('checkedOutFromFence', (event) => {
      const message = `You have checked out from ${event.zoneInfo.name}`

      if (Platform.OS === 'ios') {
        PushNotificationIOS.presentLocalNotification({
          alertTitle: 'BluedotPointSdk',
          alertBody: message,
          isSilent: true
        })
      }

      this.setState({ eventName: 'checkedOutFromFence', eventData: message })
    })

    eventEmitter.addListener('checkedIntoBeacon', (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`

      if (Platform.OS === 'ios') {
        PushNotificationIOS.presentLocalNotification({
          alertTitle: 'BluedotPointSdk',
          alertBody: message,
          isSilent: true
        })
      }

      this.setState({ eventName: 'checkedIntoBeacon', eventData: message })
    })

    eventEmitter.addListener('checkedOutFromBeacon', (event) => {
      const message = `You have checked out from ${event.zoneInfo.name}`

      if (Platform.OS === 'ios') {
        PushNotificationIOS.presentLocalNotification({
          alertTitle: 'BluedotPointSdk',
          alertBody: message,
          isSilent: true
        })
      }

      this.setState({ eventName: 'checkedOutFromBeacon', eventData })
    })

    eventEmitter.addListener('startRequiringUserInterventionForBluetooth', (event) => {
      const eventData = JSON.stringify(event).substring(0, TRUNCATE_LENGTH)
      this.setState({ eventName: 'startRequiringUserInterventionForBluetooth', eventData })
    })

    eventEmitter.addListener('stopRequiringUserInterventionForBluetooth', (event) => {
      const eventData = JSON.stringify(event, null, 2).substring(0, TRUNCATE_LENGTH)
      this.setState({ eventName: 'stopRequiringUserInterventionForBluetooth', eventData })
    })

    eventEmitter.addListener('startRequiringUserInterventionForLocationServices', (event) => {
      const eventData = JSON.stringify(event, null, 2).substring(0, TRUNCATE_LENGTH)
      this.setState({ eventName: 'startRequiringUserInterventionForLocationServices', eventData })
    })

    eventEmitter.addListener('stopRequiringUserInterventionForLocationServices', (event) => {
      const eventData = JSON.stringify(event, null, 2).substring(0, TRUNCATE_LENGTH)
      this.setState({ eventName: 'stopRequiringUserInterventionForLocationServices', eventData })
    })
  }

  handlePress = () => {
    if (this.state.buttonTitle === 'Authenticate') {
      this.handleAuthenticate();
    }
    else {
      this.handleLogout();
    }
  }

  handleAuthenticate = () => {
    let onSuccess = () => {
      this.setState({
        buttonTitle : 'Logout',
      });
    }

    let onFail = () => {
      this.setState({
        eventData: '---   AUTHENTICATION FAILED    ---',
      });
    }

    BluedotPointSdk.authenticate(APIKEY, 'Always', onSuccess, onFail)
  }

  handleLogout = () => {
    BluedotPointSdk.logOut(() => {
      this.setState({
        buttonTitle: 'Authenticate',
        eventName: '',
        eventData: ''

      });
    },
      () => {
        this.setState({
          eventData: 'Fail logging out',
        });
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bluedot Point SDK</Text>
          <Text style={styles.title}>React Native</Text>
        </View>

        <View style={styles.eventContainer}>
          <View style={styles.eventNameContainer}>
            <Text style={styles.eventTitle}>EVENT</Text>
            <Text style={styles.eventName}>{this.state.eventName}</Text>
          </View>

          <View style={styles.eventDataContainer}>
            <Text style={styles.eventTitle}>EVENT DATA</Text>
            <Text>{this.state.eventData}</Text>
          </View>
        </View>

        <Button title={this.state.buttonTitle} onPress={this.handlePress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 80
  },
  title: {
   fontWeight: '800',
   fontSize: 18
  },
  eventContainer: {
    alignItems: 'center',
    marginBottom: 80
  },
  eventTitle: {
    fontSize: 14,
    letterSpacing: 0.2,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: 'dimgray'
  },
  eventNameContainer: {
    marginBottom: 40
  },  
  eventName:{
    fontSize: 22,
    textAlign: 'center'
  },  
  eventDataContainer: {
    maxHeight: 200,
    maxWidth: 320
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: 'tomato'
  }
});
