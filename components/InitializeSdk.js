import React, { useState } from "react";
import BluedotPointSdk from 'bluedot-react-native'
import { useHistory } from 'react-router'
import { Button, Text, TextInput, View } from "react-native";

export default function Initialize() {
  const [projectId, setProjectId] = useState("4269e393-0870-4d37-a4d0-574f7ef8fe2f");
  const [error, setError] = useState(null)
  const history = useHistory()

  function handleInitializeSDK() {
    function onSuccess() {
        history.push('/main')
    }

    function onFail(error) {
        setError(error)
    }

    BluedotPointSdk.initialize(projectId, onSuccess, onFail)
  }

  return (
    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <Text>Project ID</Text>
      <TextInput
        onChangeText={setProjectId}
        value={projectId}
        placeholder="Use your project Id here"
      />

      { error !== null && (
          <Text>Error authenticating {error}</Text>
      )}

      <Button 
        title="Initialize the SDK"
        onPress={handleInitializeSDK}
        disabled={Boolean(!projectId)}
      />
    </View>
  );
}
