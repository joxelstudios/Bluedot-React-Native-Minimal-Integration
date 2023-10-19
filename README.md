# Bluedot Minimal Integration Example - Forked and Modified

## Introduction

This repository is a fork of Bluedot's minimal integration example. The primary purpose of this fork is to assist the Bluedot team in troubleshooting a specific error log occuring on iOS the latest version of React-Native.

## Key Modifications

### Type Declaration for Bluedot SDK

A TypeScript type declaration file (`Bluedot.d.ts`) has been added to provide better type inference and code intelligence when using the Bluedot SDK in a TypeScript project.

### React Native CLI Project

The example project has been restructured to use the React Native CLI instead of Expo since this best reflects the usage scenario we are debugging.

### Bluedot SDK Initialization

The `bluedot.tsx` file serves as the core integration point for the Bluedot SDK within the React Native project. It encapsulates the SDK's initialization, state management, and event handling logic.


### SDK Initialization

The file contains the `handleInitializeSDK` function, which initializes the Bluedot SDK with the project ID and registers event listeners. This function is crucial for the SDK to start its services.

### State Management
State variables like `isSdkInitialized`, `geoTriggeringActive`, and `tempoActive` are managed using React's useState hook. These states help in tracking the SDK's operational status.

### Event Listeners
Event listeners for various Bluedot events such as `enterZone`, `exitZone`, and `zoneInfoUpdate` are registered in this file. These listeners allow the app to respond to geofencing events triggered by the SDK.

### Custom Hooks
The `useBluedotService` custom hook is defined to encapsulate all the Bluedot-related logic, making it reusable across different components.

### Error Handling
The `checkSDKStatus` function checks the initialization status of the SDK and handles any errors that occur during the initialization process.

### Context Creation
The `BluedotContext` is created using React's `createContext` API. This context serves as a centralized store for the Bluedot SDK's state and provides a way to pass this state down the component tree without having to pass props manually at every level.

### Context Provider

The `BluedotProvider` component wraps the application's components and injects the Bluedot state and methods into them. This is where the `useBluedotService` custom hook is invoked to get the SDK's state and functionalities, which are then provided to the rest of the app via the `BluedotContext.Provider`.


### Context Consumer
The `useBluedot` custom hook serves as a consumer of the `BluedotContext`. It allows any component in the application to access the SDK's state and methods without prop drilling.

### Getting Started

1. Clone the repository.
2. Navigate to the react-native-cli-example directory.
3. Run `yarn install` to install dependencies.
4. Run `yarn start` to start the Metro bundler.
5. Follow the platform-specific instructions to run the project on Android or iOS.

### Simulating Geofencing Events

I've inlcuded a GPX file in the project (`react-native-cli-example/1800 McConnor Pkwy.gpx`) that can be used to simulate geofencing events in the iOS simulator. To use this file, follow these steps:

1. Open Xcode and run the project on the iOS simulator.
2. With Xcode focused, go to `Debug` > `Simulate Location` > `1800 McConnor Pkwy`.
3. The simulator should now be running a repeated route, and the app should receive a `enterZone` event for any zones that are within the route.




For more information on the original example and SDK, please refer to [Bluedot's official documentation](#).

**Note**: This is a forked and modified version of the original example provided by Bluedot. For any issues related to the SDK itself, it's recommended to refer to the official Bluedot support channels.