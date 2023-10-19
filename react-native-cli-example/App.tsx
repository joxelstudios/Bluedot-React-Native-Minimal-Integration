/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import type {PropsWithChildren} from 'react';
import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import useLocationPermission from './src/hooks/useGeolocationPermissions';
import {BluedotProvider, useBluedot} from './src/services/bluedot/bluedot';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function Provider({children}: PropsWithChildren): JSX.Element {
  return <BluedotProvider>{children}</BluedotProvider>;
}

function AppWrapper(): JSX.Element {
  return (
    <Provider>
      <App />
    </Provider>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {
    updateProjectId,
    setProjectId,
    projectId,
    geoTriggeringActive,
    handleStartGeoTriggering,
  } = useBluedot();
  const {requestPermission, permissionGranted} = useLocationPermission();

  const handlePermissionRequest = () => {
    if (!permissionGranted) {
      requestPermission();
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">Grant location permissions.</Section>
          <Button title="Submit" onPress={() => handlePermissionRequest()} />
          <Section title="Step Two">
            Update the form below with your Bluedot project ID.
          </Section>
          <TextInput
            style={styles.input}
            defaultValue={projectId}
            onChange={e => setProjectId(e.nativeEvent.text)}
          />
          <Button title="Submit" onPress={() => updateProjectId()} />
          <Section title="Step Three">Start Geo Triggering Service</Section>
          <View style={styles.container}>
            <Text>
              Geo Triggering Status:{' '}
              {geoTriggeringActive ? 'Active' : 'Inactive'}
            </Text>
            <Button title="Start" onPress={() => handleStartGeoTriggering()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 6,
  },
  submit: {
    margin: 12,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});

export default AppWrapper;
