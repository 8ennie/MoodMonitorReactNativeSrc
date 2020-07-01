# MoodMonitor
MoodMonitor is a project in ReactNative that allows a user to trackk his mood and certain params. The App the analyses it and gives a the user the opertunity to view coralations. 

## Getting Started

### Installing

A step by step guide to get the React Native Application to run!

* Fist set up your enviroment to run React Native Applications
  ([React Native Doc](https://reactnative.dev/docs/environment-setup))
* Initilize a new React Native Application
```
npx react-native init MoodMonitor
```

* Initilize the git repo in Project File
```
cd MoodMonitor/
git init
git remote add origin https://github.com/8ennie/MoodMonitorReactNativeSrc.git
git pull origin master
```
> WARNING: Could be that you have to delet the App.js!

* Install missing dependancys
```
npm install @react-navigation/native @react-navigation/stack
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install --save realm
npm install @react-native-community/geolocation --save
```
* For Andoid change config in \android\app\src\main\AndroidManifest.xml:  
Add Line:
```
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```
### Run Application

* For Android
```
npx react-native run-android
```
* For IOS
```
npx react-native run-ios
```


