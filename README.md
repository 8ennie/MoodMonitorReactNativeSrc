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
  > WARNING: Could be that you have to delet the App.js and .gitignore!

* Install missing dependancys
  ```
  npm install @react-navigation/native @react-navigation/stack
  npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
  npm install --save realm
  npm install @react-native-community/geolocation --save
  ```
* For Andoid:
  * Add Lines to \android\app\src\main\AndroidManifest.xml:
  ```
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  ```
  ```
  <application>
     <meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyAE83-j5Perr4b6hk7b1_Kfcwma88_Fg2Q"/>
     <uses-library android:name="org.apache.http.legacy" android:required="false"/>
   </application>
  ```
  * Add Lines to \android\build.gradle:
  ```
    buildscript {
       ext {
            buildToolsVersion = "xxx"
            minSdkVersion = xxx
            compileSdkVersion = xxx
            targetSdkVersion = xxx
            supportLibVersion   = "28.0.0" // Insert this Line
            playServicesVersion = "17.0.0" // Insert this Line
            androidMapsUtilsVersion = "2.0.1" // Insert this Line
       }
      }
      ...
    ```
    * Make Sure Your emulator has Google Play Services Installed

* For IOS:
  * Run Commands:
    ```
    cd ios
    pod install
    ```
  * in ios\MoodMonitor\Info.plist add a description for "NSLocationWhenInUseUsageDescription":
    ```
    <key>NSLocationWhenInUseUsageDescription</key>
    <string> The Location is Required inorder to add Location and Weather to Mood </string>
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


