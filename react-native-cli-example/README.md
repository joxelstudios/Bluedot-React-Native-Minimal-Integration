# Bluedot-React-Native-Minimal-Integration

This App is a minimal App depicting integration of Bluedot Plugin(bluedot-react-native) https://www.npmjs.com/package/bluedot-react-native with a React Native App (using react-native-cli) supporting react native version 0.72.5

### Notes:

If you encounter issues while running the react native apps on iOS and Android, try these steps:

1. Clear watchman watches: `watchman watch-del-all`
2. Delete node_modules and package-lock.json and reinstall packages: `rm -rf node_modules && rm -rf package-lock.json`
3. Reinstall packages: `yarn install`
4. Reinstall ios pods: `cd ios && pod install`
   1. if using bundler, run `bundle install` in the root directory
   2. cd into ios and run `bundle exec pod install`
5. Start fresh by resetting cache: `yarn start --reset-cache`
6. Run again: `yarn ios` or `yarn android`

