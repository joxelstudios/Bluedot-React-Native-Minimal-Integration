import React, { Fragment, useState, useEffect } from "react";
import BluedotPointSdk from "bluedot-react-native";
import { Text, View, Button, TextInput } from "react-native";
import { useNavigate } from "react-router"
import styles from "../styles";

export default function Tempo({ hasStarted }) {
  const [destinationId, setDestinationId] = useState("");
  const [isTempoRunning, setIsTempoRunning] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const tempoBuilder = new BluedotPointSdk.TempoBuilder();

  useEffect(() => {
    BluedotPointSdk.isTempoRunning().then(setIsTempoRunning)
  }, [])

  function handleStartTempo() {
    function onStartTempoSuccess() {
      console.log('Tempo has started successfuly')
      BluedotPointSdk.isTempoRunning().then(setIsTempoRunning)
    }
    
    function onStartTempoFailed(error) {
      console.error('Error Starting Tempo: ', error);
      setError(error)
    }

    BluedotPointSdk.setCustomEventMetaData({
      orderId: randomOrderId(6),
      customerName: "Customer"
    })

      const androidNotificationParams = {
        channelId: 'Bluedot React',
        channelName: 'Bluedot React',
        title: 'Bluedot Foreground Service - Tempo',
        content: "This app is running a foreground service using location services"
      }

      tempoBuilder
        .androidNotification( // Required to run Tempo in Android
          androidNotificationParams.channelId,
          androidNotificationParams.channelName,
          androidNotificationParams.title,
          androidNotificationParams.content
        )
        .start(
          destinationId.trim(),
          onStartTempoSuccess,
          onStartTempoFailed
        )
  }

  function handleStopTempo() {
    function onStopTempoSuccess() {
        console.log('Tempo has stopped successfuly')
        BluedotPointSdk.isTempoRunning().then(setIsTempoRunning)
      }
    
      function onStopTempoFailed(error) {
        console.error('Error Stopping Tempo: ', error);
      }

      BluedotPointSdk.stopTempoTracking(
        onStopTempoSuccess,
        onStopTempoFailed
      )
  }

  function randomOrderId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eventTitle}>Tempo</Text>
      <View style={styles.tempoWrapper}>
        {hasStarted ? (
          <Text>Destination ID: {destinationId}</Text>
        ) : (
          <Fragment>
            <Text style={styles.eventTitle}>Destination ID:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setDestinationId}
              value={destinationId}
              placeholder="Destination ID"
              editable={!isTempoRunning}
            />
          </Fragment>
        )}
        {error && <Text>{error}</Text>}
        { isTempoRunning ? (
          <Button
            title="Stop Tempo"
            onPress={handleStopTempo}
          />
        ) : (
          <Button
            title="Start Tempo"
            onPress={handleStartTempo}
          />
        )}
        <Button title="Back" onPress={() => navigate('/main')}/>
      </View>
    </View>
  );
}
