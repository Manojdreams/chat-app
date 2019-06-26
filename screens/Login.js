import React from 'react';
import { Text, View, Button, StyleSheet, KeyboardAvoidingView, Image, TextInput, TouchableHighlight, Platform } from 'react-native';
import firebaseSvc from '../FirebaseSvc';
import LinearGradient from "react-native-linear-gradient";
import Loading from "../components/loading";
import SyncStorage from 'sync-storage';


export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loggedIn: false,
      loading: false,
      data: {}
    };
   
  }
  async componentDidMount(){
    var login = await SyncStorage.get('login');
    console.log(login)
    if (this.state.loggedIn) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'ChatList' }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      // this.props.navigation.navigate('ChatList');
    }
  }

  onPressLogin = async () => {
    this.showLoading();
    // fetch('https://stage-api-customer-2.engage-bot.asia/accounts/login', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: this.state.email,
    //     password: this.state.password,
    //   }),
    // }).then((response) => response.json())
    //   .then((responseJson) => {
    //     this.hideLoading();
    //     if (responseJson.statusCode != 400) {
    //       this.state.data = responseJson;
          // const val = firebaseSvc.userList(this.state.data.email, this.state.data.name);
    firebaseSvc.userList(this.state.email, this.state.password);
    SyncStorage.set('user_email', this.state.email);
    SyncStorage.set('login', 'true');
    this.loginSuccess();
    //   }
    //   if (responseJson.statusCode == 400) {
    //     this.loginFailed();
    //   }
    // })
    // .catch((error) => {
    //   this.hideLoading();
    //   alert(error);
    // });
  };

  loginSuccess = () => {
    console.log('login successful, navigate to chat.');
    // firebaseSvc.checkPermission();
    this.hideLoading();
    this.props.navigation.navigate('ChatList');
  };
  loginFailed = () => {
    this.hideLoading();
    alert('Login failure. Please tried again.');
  };

  showLoading() {
    this.setState({ loading: true });
  }
  //Hide Loader function
  hideLoading() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <Image style={styles.map} source={require("../images/map.png")}
          />
          <View style={{ width: '100%', height: 100, position: "absolute", marginTop: 155, justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <Image style={styles.logo} source={require("../images/loginlogo.png")}
            />
          </View>
          <View style={{ height: '100%', zIndex: -1 }}>
            <LinearGradient colors={["#00FFF1", "#1FB5AD"]}
              style={styles.linearGradient}>
              <View style={styles.dashBoardCard}>
              </View>
            </LinearGradient>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 20, marginTop: -20, height: 1000, alignItems: 'center' }}>
              <Text style={styles.loginTitleText}>Login</Text>
              <View style={styles.loginContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#7c7c7c"
                    placeholder="Email Address"
                    keyboardType="email-address"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    onChangeText={email => this.setState({ email })}
                  />
                  <Image
                    style={styles.icon}
                    source={require("../images/email.png")}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputs}
                    placeholderTextColor="#7c7c7c"
                    placeholder="Password"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    onChangeText={password => this.setState({ password })}
                  />
                  <Image
                    style={styles.icon}
                    source={require("../images/password.png")}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row", width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: '15%' }}>
                <Text style={styles.forgetTitleText}>Forget Password?</Text>
              </View>
              <View style={{ flexDirection: "row", width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 18, marginLeft: "2%", marginRight: "2%" }}>
                <TouchableHighlight
                  style={[styles.buttonContainer, styles.loginButton]}
                  onPress={() => this.onPressLogin()}
                >
                  <Text style={styles.loginText}>Login</Text>
                </TouchableHighlight>
              </View>
              <View style={{ flexDirection: "row", width: '100%', justifyContent: 'center', marginTop: 18, alignItems: 'center' }}>
                <Text style={styles.forgetTitleText}>Don't have an account? </Text>
                <Text style={styles.registerText}>Register</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        {this.state.loading && <Loading />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: '100%',
    position: "absolute",
    backgroundColor: "#ffffff",
  },
  map: {
    position: "absolute",
    marginTop: -20,
    width: '100%',
    height: 260,
    resizeMode: "contain",
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: "flex-end",
    zIndex: 1
  },
  logo: {
    position: "absolute",
    width: 55,
    height: 55,
    resizeMode: "contain",
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: "flex-end",
    zIndex: 2
  },
  // loginTitle: {
  //   // position: 'absolute',
  //   width: "100%",
  //   // height: 40,
  //   // justifyContent: "center",
  //   alignItems: "center",
  // },
  loginTitleText: {
    fontFamily: "Poppins-Medium",
    position: "relative",
    marginTop: 50,
    color: "#000000",
    fontSize: 16,
  },
  forgetTitleText: {
    fontFamily: "Poppins-Light",
    color: "#000000",
    fontSize: 12,

  },
  registerText: {
    fontFamily: "Poppins-Medium",
    color: "#000000",
    fontSize: 12,
  },
  loginContainer: {
    marginTop: "2%",
    alignItems: "center",
    marginBottom: 18,
    marginLeft: "2%",
    marginRight: "2%"
  },
  linearGradient: {
    height: 225,
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainer: {
    borderColor: "#7c7c7c",
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 0.5,
    color: "#998e8e",
    width: "90%",
    height: 45,
    marginTop: 18,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 13,
  },
  dashBoardCard: {
    zIndex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  inputs: {
    fontFamily: "Poppins-Light",
    height: 40,
    marginLeft: 10,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: '90%',
    borderRadius: 50,
    marginLeft: "2%",
    marginRight: "2%"
  },
  register: {
    textAlign: "center",
    color: "#000000"
  },
  loginButton: {
    backgroundColor: "#00FFF1",
    borderRadius: 50
  },
  loginText: {
    fontFamily: 'Poppins-SemiBold',
    color: "white",
    fontSize: 14
  }
});
