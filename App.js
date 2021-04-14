import React from "react";
import { NativeRouter, Route, Switch } from "react-router-native";
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
      <Switch>
        <Route exact path="/">
          <Initilize />
        </Route>
        <Route exact path="/main">
          <Main />
        </Route>
        <Route exact path="/geotriggering">
          <GeoTriggering />
        </Route>
        <Route exact path="/tempo">
          <Tempo />
        </Route>
      </Switch>
    </NativeRouter>
  );
}
