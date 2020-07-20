import React, { Fragment, useState } from 'react'
import BluedotPointSdk from '@bluedot-innovation/bluedot-react-native';
import { Text, View, Button, TextInput } from 'react-native';
import styles from './styles' 

export default function Tempo({ hasStarted }) {
    const [ destinationId, setDestinationId ] = useState('')

    function onStartTempoFailed(error) {
        console.log(error)
    }

    return (
        <View style={styles.tempoWrapper}>
            { hasStarted ? 
                <Text>Destination ID: {destinationId}</Text>
                :(  
                    <Fragment>
                        <Text>Destination ID:</Text>
                        <TextInput 
                            style={styles.textInput} 
                            onChangeText={setDestinationId}
                            value={destinationId}
                            placeholder="Destination ID"
                        />
                    </Fragment>
                 
                )
            }
            { hasStarted ? 
                <Button title="STOP TEMPO" onPress={BluedotPointSdk.stopTempoTracking} />
                : <Button title="START TEMPO" onPress={() => BluedotPointSdk.startTempoTracking(destinationId.trim(), onStartTempoFailed)} /> 
            }
      </View>
    )
}
