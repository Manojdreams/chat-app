import React, { Component } from "react";
import { Text, View, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Platform, Dimensions } from 'react-native';
import firebaseSvc from '../FirebaseSvc';
import LinearGradient from "react-native-linear-gradient";
import Loading from "../components/loading";
import Icon from "react-native-vector-icons/Ionicons";
import {
    Header,
    Title,
    Left,
    Right,
    Button,
    Body
} from "native-base";
import SyncStorage from 'sync-storage';


class HeaderComponent extends Component {


    state = {
        loading: false,
        data: {}
    };
    constructor(props) {
        super(props);
        console.log(props)

    }
    isIPhoneXSize(dim) {
        return dim.height == 812 || dim.width == 812;
    }

    isIPhoneXrSize(dim) {
        return dim.height == 896 || dim.width == 896;
    }
    logout() {

        Alert.alert(
            'Logout',
            'Are you sure want to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: () => {
                        SyncStorage.remove('login');
                        SyncStorage.remove('to_user');
                        SyncStorage.remove('user');
                        this.props.navigation.navigate('Login');
                    }
                },
            ],
            { cancelable: false },
        );

    }
    render() {
        const dim = Dimensions.get('window');
        // const { navigate } = this.props.navigation;
        console.log(this.props)
        return (
            // <View style={{ backgroundColor: '#eee' }}>

            <LinearGradient
                colors={["#00FFF1", "#1FB5AD"]}
                style={[StyleSheet.absoluteFill, {
                    height: Platform.OS === 'ios' && (this.isIPhoneXSize(dim) || this.isIPhoneXrSize(dim)) ? (this.props.page === 'chat' ? 95 : 120) : (this.props.page === 'chat' ? 60 : 120)
                }]}
            >
                <Header style={[styles.headerStyle, { height: Platform.OS === 'ios' && (this.isIPhoneXSize(dim) || this.isIPhoneXrSize(dim)) ? (this.props.page === 'chat' ? 95 : 120) : (this.props.page === 'chat' ? 60 : 120) }]}>
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor="#00FFF1"
                    />
                    {this.props.page === 'chat' ? (<Left style={{ flexShrink: 1, paddingLeft: 20 }} >
                        <Button
                            transparent
                            onPress={() => this.props.navigation.pop()}
                        >
                            <Icon
                                name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
                                color="#fff"
                                size={25}
                            />
                        </Button>
                    </Left>) : (<View style={{ flexShrink: 1, paddingLeft: 40 }}></View>)}
                    <Body
                        style={{
                            flexGrow: 10,
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        <Title style={styles.title}>Chat</Title>
                    </Body>
                    {this.props.page === 'chat' ? (<View></View>) : (<TouchableOpacity onPress={() => this.logout()}
                    ><Right style={{ flexShrink: 1, paddingRight: 20 }}  >
                            <Icon
                                name={Platform.OS === "ios" ? "ios-log-out" : "md-log-out"}
                                color="#fff"
                                size={25}
                            />
                        </Right></TouchableOpacity>)}
                </Header>
            </LinearGradient>
        );
    }
}
export default HeaderComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
    },
    headerStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: '#00FFF1'
    },
    backIcon: {
        color: "#fff",
        fontSize: 26,
        marginRight: 5,
    },
    title: {
        fontSize: 14,
        marginRight: Platform.OS === "ios" ? 0 : -50,
        alignItems: "flex-start",
        fontFamily: "Poppins-Regular",
        color: "white"
    },
    moreIcon: {
        width: 30,
        height: 30
    },
    editIcon: {
        width: 25,
        height: 25
    },
    linearGradient: {
        width: '100%',
        marginRight: 0,
        marginLeft: 0,
    },
});

