
import React, {Component} from 'react';
// Import React Navigation
import { createStackNavigator, createAppContainer } from 'react-navigation'
// Create the navigator
import Loading from './components/loading';
import { SwitchNavigation } from './navigation/AppNavigationSwitch';
import { db } from './config';
import SyncStorage from 'sync-storage';

// export default App;
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      initialRoute : false,
      loading: true,
      isAuthenticationReady: false,
      isAuthenticated: false,
    };
  }

  async componentWillMount(): void {
    const data = await SyncStorage.init();
    console.log(data)
    const loggedIn = SyncStorage.get('login');
    console.log(loggedIn)
    if(loggedIn){
      this.setState({isAuthenticationReady: true});
      this.setState({isAuthenticated: true});
      this.setState({loading: false});
    }
    else{
      this.setState({isAuthenticationReady: true});
      this.setState({isAuthenticated: false});
      this.setState({loading: false});
    }
   }



  render() {
    if ( (this.state.loading || !this.state.isAuthenticationReady)) {
      return (
        <Loading />
      )
    }else{

    const RootNavigator = SwitchNavigation(this.state.isAuthenticated);
    return <RootNavigator />
    }
  }
}

// export default createStackNavigator({
//   Login: Login,
//   Chat: Chat,
// });