import React from 'react'
import { Text, View, Button } from 'react-native';
import { useHistory } from 'react-router';
import { requestLocationPermissions } from '../helpers/permissionsHandler';


export default function RequestLocationPermissions() {
    const history = useHistory()

    async function handleOnPress() {
        try {
            await requestLocationPermissions()
            history.push('/initialize')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Allow Location Access</Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>This app uses location services to determine your location relative to the geofences.</Text>
            <Button onPress={handleOnPress} title="Allow"></Button>
        </View>
    )
}