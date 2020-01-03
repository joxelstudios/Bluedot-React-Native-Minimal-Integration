# Bluedot-React-Native-Minimal-Integration

This App is a minimal App depicting integration of Bluedot Plugin(bluedot-react-native) https://www.npmjs.com/package/bluedot-react-native
with a React Native App supporting react native version 0.61.2

Additional steps to follow while building for Android App as give build error for AndroidX:

In below path, in the dependencies section change "compileOnly" to "implementation" for 
/Users/UserName/react-native-minimal-integration/node_modules/@unimodules/react-native-adapter/android/build.gradle


### Old:
compileOnly('com.facebook.react:react-native:+') {
    exclude group: 'com.android.support'
}
  
### New:
implementation('com.facebook.react:react-native:+') {
    exclude group: 'com.android.support'
}

More Details on above issue can be found at:

https://github.com/react-native-community/react-native-maps/issues/2940

