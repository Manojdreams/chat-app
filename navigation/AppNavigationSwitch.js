import { createSwitchNavigator,createStackNavigator, createAppContainer } from "react-navigation";
import Login from '../screens/Login';
import Chat from '../screens/Chat';
import ChatList from '../screens/chatList';
import HeaderComponent from '../components/headerComponents';
import SyncStorage from 'sync-storage';

export const SwitchNavigation = (switchNavroute = false ) =>{
  return createAppContainer(createStackNavigator({
    Login: {
      screen: Login,
      navigationOptions: {
        header: null ,//this will hide the header
        gesturesEnabled: false,
      }
    },
    ChatList: {
      screen: ChatList,
      navigationOptions: {
        header: null ,//this will hide the header
        gesturesEnabled: false,
      }
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        header: null ,//this will hide the header
        gesturesEnabled: false,

      }
    },
  },
  {
    initialRouteName: switchNavroute ? 'ChatList': 'Login' 
  }
))
}


