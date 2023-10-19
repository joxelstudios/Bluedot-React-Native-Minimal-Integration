import BluedotPointSdk, {ZoneInfo} from 'bluedot-react-native';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert} from 'react-native';

// Define a type for the error state
type BluedotError = string | Error | undefined;

/**
 * The shape of the Bluedot context state.
 */
interface BluedotState {
  error: BluedotError;
  isSdkInitialized: boolean;
  geoTriggeringActive: boolean;
  handleStartGeoTriggering: () => void;
  handleStopGeoTriggering: () => void;
  handleInitializeSDK: () => void;
  handleResetSDK: () => void;
  updateProjectId: () => void;
  projectId: string;
  setProjectId: (projectID: string) => void;
}

// Constants
const PROJECTID = 'YOUR_PROJECT_ID';
const initialState: BluedotState = {
  error: undefined,
  isSdkInitialized: false,
  geoTriggeringActive: false,
  handleStartGeoTriggering: () => {},
  handleStopGeoTriggering: () => {},
  handleInitializeSDK: () => {},
  handleResetSDK: () => {},
  updateProjectId: () => {},
  projectId: PROJECTID,
  setProjectId: () => {},
};

/**
 * The useBluedot hook is used to initialize and interact with the Bluedot SDK. It uses the useState
 *  hook to manage the state of the SDK, including the project ID, error messages, and whether the SDK
 *  is initialized. It also defines functions for initializing, resetting, starting, and stopping the
 *  SDK, as well as checking whether the GeoTriggering feature is running.
 */
function useBluedotService() {
  const [projectId, setProjectId] = useState(PROJECTID);
  const [error, setError] = useState<BluedotError>();
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [geoTriggeringActive, setGeoTriggeringActive] = useState(false);
  const geoTriggeringService = useRef(
    new BluedotPointSdk.GeoTriggeringBuilder(),
  ).current;

  /**
   * Check SDK initialization status.
   */
  const checkSDKStatus = useCallback(
    (failureError: Error) => {
      BluedotPointSdk.isInitialized()
        .then((isInitialized: boolean) => {
          if (isInitialized) {
            setIsSdkInitialized(true);
            Alert.alert(
              'The SDK is Initialized',
              'Current Project ID: ' + projectId,
            );
          } else {
            setError(failureError);
            Alert.alert('Failed to initialize SDK', String(failureError));
            console.error('SDK initialization failed', failureError);
          }
        })
        .catch((err: Error) => console.error(err));
    },
    [projectId],
  );

  /**
   * Checks if the Bluedot GeoTriggering is running.
   */

  useEffect(() => {
    BluedotPointSdk.isGeoTriggeringRunning()
      .then((isRunning: boolean) => {
        if (isRunning) {
          setGeoTriggeringActive(true);
        }
      })
      .catch((err: Error) => console.error(err));
  }, []);

  /**
   * Registers the Bluedot listeners.
   */
  const registerBluedotListeners = () => {
    BluedotPointSdk.on('enterZone', (event: {zoneInfo: ZoneInfo}) => {
      console.info('enterZone', event);

      const message = `You have checked in ${event?.zoneInfo?.name}`;
      Alert.alert('Success', message);
    });

    BluedotPointSdk.on('exitZone', (event: {zoneInfo: ZoneInfo}) => {
      const message = `You have checked-out from ${event?.zoneInfo?.name}`;
      Alert.alert('Success', message);
    });

    BluedotPointSdk.on('zoneInfoUpdate', () => {
      BluedotPointSdk.getZonesAndFences().catch((err: Error) =>
        console.error(err),
      );
    });

    BluedotPointSdk.on(
      'lowPowerModeDidChange',
      (event: {isLowPowerModeEnabled: boolean}) =>
        console.error(JSON.stringify(event)),
    );

    BluedotPointSdk.on(
      // This event is exclusive for iOS Location Accuracy (Precise: on/off)
      'accuracyAuthorizationDidChange',
      (event: {accuracyAuthorization: string}) =>
        console.error(JSON.stringify(event)),
    );

    BluedotPointSdk.on(
      'locationAuthorizationDidChange',
      (event: {status: string}) => console.error(JSON.stringify(event)),
    );
  };

  /**
   * The handleInitializeSDK function initializes the Bluedot SDK with the project ID and registers
   *  event listeners for zone entry and exit, zone info updates, and location accuracy changes. If the
   *  initialization fails, it sets an error message and errors the error to the console.
   */
  const handleInitializeSDK = useCallback(() => {
    console.log('handleInitializeSDK', projectId);
    BluedotPointSdk.initialize(
      projectId,
      () => Alert.alert('Success', 'Bluedot SDK initialized successfully'),
      checkSDKStatus,
    );
    registerBluedotListeners();
  }, [checkSDKStatus, projectId]);

  /**
   * Resets the Bluedot SDK.
   */
  const handleResetSDK = useCallback(() => {
    BluedotPointSdk.reset(() => {
      registerBluedotListeners();
      Alert.alert('Success', 'Bluedot SDK reset successfully');
    }, checkSDKStatus);
  }, [checkSDKStatus]);

  /**
   * The handleStartGeoTriggering function starts the GeoTriggering feature of the Bluedot SDK
   *  and shows a success or error message using the Toast component.
   */
  function handleStartGeoTriggering(): void {
    geoTriggeringService.start(
      () => {
        setGeoTriggeringActive(true);
        Alert.alert('Success', 'Route Tracking Started');
      },
      errorMessage => {
        console.error(errorMessage);
        Alert.alert('Error.', String(errorMessage));
      },
    );
  }

  /**
   * The handleStopGeoTriggering function stops the GeoTriggering feature of the Bluedot SDK and
   *  shows a success or error message using the Toast component.
   */
  function handleStopGeoTriggering(): void {
    BluedotPointSdk.stopGeoTriggering(
      () => {
        setGeoTriggeringActive(false);
        Alert.alert('Success', 'Route Tracking Stopped');
      },
      errorMessage => {
        console.error(errorMessage);
        Alert.alert('Error', 'There was an error stopping geo-triggering.');
      },
    );
  }

  const updateProjectId = useCallback(() => {
    console.log('updateProjectId', projectId);
    handleInitializeSDK();
  }, [handleInitializeSDK, projectId]);

  return {
    error,
    isSdkInitialized,
    handleInitializeSDK,
    handleResetSDK,
    handleStartGeoTriggering,
    handleStopGeoTriggering,
    updateProjectId,
    setProjectId,
    geoTriggeringActive,
    projectId,
  };
}

/**
 * The Bluedot context.
 */
const BluedotContext = createContext<BluedotState>(initialState);

/**
 * A custom hook to access the Bluedot context.
 * @returns The Bluedot context state.
 */
export const useBluedot = (): BluedotState => {
  const context = useContext<BluedotState>(BluedotContext);
  if (!context) {
    throw new Error('useBluedot must be used within a BluedotProvider');
  }
  return context;
};

/**
 * The BluedotProvider component.
 * @param children - The React children components.
 * @returns The Bluedot context provider wrapping its children.
 */
export const BluedotProvider: FC<PropsWithChildren> = ({children}) => {
  const bluedotState = useBluedotService();
  return (
    <BluedotContext.Provider value={bluedotState ?? initialState}>
      {children}
    </BluedotContext.Provider>
  );
};
