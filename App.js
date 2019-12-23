import React, { Component } from 'react';
import { Platform, Text, View, Button } from 'react-native';
import BluedotPointSdk from 'bluedot-react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { requestLocationPermissions, requestBluetoothPermissions } from './helpers/permissionsHandler';
import { sendLocalNotification } from './helpers/notifications'
import { OS, LOCATION_PERMISSIONS } from './enums'
import styles from './styles' 

const APIKEY = 'api_key_goes_here';

export default class App extends Component {
  state = {
    buttonTitle: 'Authenticate',
    ruleRequestMessage: null,
    locationPermissions: '',
    eventName: '',
    eventData: ''
  };

  componentDidMount = async () => {

    // Ask location permission 
    await requestLocationPermissions();
    await requestBluetoothPermissions()

    const channelId = 'Bluedot React'
    const channelName = 'Bluedot React'
    const title = 'Bluedot Foreground Service'
    const content = "This app is running a foreground service using location services"

    BluedotPointSdk.setForegroundNotification(channelId, channelName, title, content, true);

    // Set custom event metadata
    BluedotPointSdk.setCustomEventMetaData({
      userId: 'user_id_goes_here'
    })

    if (Platform.OS === OS.IOS) {
      const hasLocationAlwaysPermission = await check(PERMISSIONS.IOS.LOCATION_ALWAYS) === RESULTS.GRANTED
      const hasLocationWhileInUsePermission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE) === RESULTS.GRANTED
      const hasBluetoothPermission = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL) === RESULTS.GRANTED

      if (hasLocationAlwaysPermission) {
        this.setState({ locationPermissions: LOCATION_PERMISSIONS.ALWAYS })
      }

      if (hasLocationWhileInUsePermission) {
        this.setState({ locationPermissions: LOCATION_PERMISSIONS.WHILE_IN_USE })
      }

      if (hasBluetoothPermission) {
        this.setState({ bluetoothPermission: RESULTS.GRANTED })
      }
    }

    BluedotPointSdk.on('zoneInfoUpdate', (event) => {
      const eventData = `There are ${event.zoneInfos.length} zones`
      this.setState({ eventName: 'zoneInfoUpdate', eventData })
    })

    BluedotPointSdk.on('checkedIntoFence', (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`
  
      sendLocalNotification(message)

      this.setState({ eventName: 'checkedIntoFence', eventData: message })
    })

    BluedotPointSdk.on('checkedOutFromFence', (event) => {
      const message = `You have checked out from ${event.zoneInfo.name}`

      sendLocalNotification(message)

      this.setState({ eventName: 'checkedOutFromFence', eventData: message })
    })

    BluedotPointSdk.on('checkedIntoBeacon', (event) => {
      const message = `You have checked in ${event.zoneInfo.name}`

      sendLocalNotification(message)

      this.setState({ eventName: 'checkedIntoBeacon', eventData: message })
    })

    BluedotPointSdk.on('checkedOutFromBeacon', (event) => {
      const message = `You have checked out from ${event.zoneInfo.name}`

      sendLocalNotification(message)

      this.setState({ eventName: 'checkedOutFromBeacon', eventData })
    })

    BluedotPointSdk.on('startRequiringUserInterventionForBluetooth', (event) => {
      const eventData = JSON.stringify(event)
      this.setState({ eventName: 'startRequiringUserInterventionForBluetooth', eventData })
    })

    BluedotPointSdk.on('stopRequiringUserInterventionForBluetooth', (event) => {
      const eventData = JSON.stringify(event)
      this.setState({ eventName: 'stopRequiringUserInterventionForBluetooth', eventData })
    })

    BluedotPointSdk.on('startRequiringUserInterventionForLocationServices', (event) => {
      const eventData = JSON.stringify(event)
      this.setState({ eventName: 'startRequiringUserInterventionForLocationServices', eventData })
    })

    BluedotPointSdk.on('stopRequiringUserInterventionForLocationServices', (event) => {
      const eventData = JSON.stringify(event)
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

    BluedotPointSdk.authenticate(APIKEY, this.state.locationPermissions, onSuccess, onFail)
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
