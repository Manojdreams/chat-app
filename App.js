
import React, { Component } from 'react';
// Import React Navigation
import { createStackNavigator, createAppContainer } from 'react-navigation'
// Create the navigator
import Loading from './components/loading';
import { SwitchNavigation } from './navigation/AppNavigationSwitch';
import { db } from './config';
import firebase from 'react-native-firebase';
import SyncStorage from 'sync-storage';


// export default App;
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      initialRoute: false,
      loading: true,
      isAuthenticationReady: false,
      isAuthenticated: false,
    };
    this.checkPermission();
  }

  async checkPermission() {
    const messaging = await firebase.messaging();
    const fcmToken = messaging.getToken();
    console.log(fcmToken);
    const enabled = await firebase.messaging().hasPermission();
    console.log(enabled);
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }



  async getToken() {
    let fcmToken = await SyncStorage.get('fcmToken');
    console.log(fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      SyncStorage.set('fcmToken', fcmToken);
      console.log(fcmToken);
      if (fcmToken) {

        // user has a device token
        await SyncStorage.set('fcmToken', fcmToken);
        console.log(fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      alert('permission rejected');
    }
  }

  async componentWillMount(): void {
    const data = await SyncStorage.init();
    console.log(data)
    const loggedIn = SyncStorage.get('login');
    console.log(loggedIn)
    if (loggedIn) {
      this.setState({ isAuthenticationReady: true });
      this.setState({ isAuthenticated: true });
      this.setState({ loading: false });
    }
    else {
      this.setState({ isAuthenticationReady: true });
      this.setState({ isAuthenticated: false });
      this.setState({ loading: false });
    }
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }



  render() {
    if ((this.state.loading || !this.state.isAuthenticationReady)) {
      return (
        <Loading />
      )
    } else {

      const RootNavigator = SwitchNavigation(this.state.isAuthenticated);
      return <RootNavigator />
    }
  }
}

// export default createStackNavigator({
//   Login: Login,
//   Chat: Chat,
// });