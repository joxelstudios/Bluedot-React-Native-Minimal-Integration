import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NativeRouter, Route, Router, Routes, Switch } from "react-router-native";
import { StyleSheet, Text, View } from 'react-native';
import {
  requestLocationPermissions,
  requestBluetoothPermissions,
  requestNotificationPermissions,
} from "./helpers/permissionsHandler";

import Initilize from "./components/InitializeSdk";
import Main from "./components/Main";
import GeoTriggering from "./components/GeoTriggering";
import Tempo from "./components/Tempo";


export default function App() {

  React.useEffect(() => {
    // Ask location permission
    requestLocationPermissions();
    requestBluetoothPermissions();
    requestNotificationPermissions();
  }, []);

  return (
    <NativeRouter>
      <Routes>
        <Route exact path="/" element={<Initilize />} />
        <Route exact path="/main" element={<Main />} />
        <Route exact path="/geotriggering" element={<GeoTriggering />} />
        <Route exact path="/tempo" element={<Tempo />} />
      </Routes> 
      </NativeRouter>
  );
}
