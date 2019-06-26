import React from 'react';
import { Text, View, FlatList, StyleSheet, Dimensions, StatusBar, KeyboardAvoidingView, Image, TouchableOpacity, TextInput, TouchableHighlight, Platform } from 'react-native';
import HeaderComponent from "../components/headerComponents";
import { Divider } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
import CardView from 'react-native-cardview'
import _ from 'lodash';
import SyncStorage from 'sync-storage';
import firebaseSvc from '../FirebaseSvc';
// import * as firebase from 'firebase';
import firebase from 'react-native-firebase';
// import firestore from 'firebase/firestore';
import Moment from 'moment';


                             
// let itemsRef = db.ref('Users/');§

export default class ChatList extends React.Component {
    state = {
        items: [],
        fullData: [],
        firstQuery: '',
        currentUser: {},
        id: '',
        overAllMessageUnRead: '',
        overAllMessage: ''
    };

    async componentDidMount() {
        this._subscribe = this.props.navigation.addListener('did                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              Focus', () => {
            this.loadMessageAndUser();
            //Put your Data loading function here instead of my this.LoadData()
        });
        
    }


    working() {
        alert('It is under development');
    }

    loadMessageAndUser() {
        const result = SyncStorage.get('user_email');
        const db = firebase.firestore();
        
    
        var overAllMessage = 0;
        var overAllMessageUnRead = 0;
        // db.collection('Chatslist').doc('room').onSnapshot((snapshot) => {
          
            db.collection('users').onSnapshot((snapshot) => {
                const user_docs = snapshot.docs.map((docSnapshot) => ({
                    id: docSnapshot.id,
                    data: docSnapshot.data()
                }));
                this.state.currentUser = user_docs.find(x => x.data.email.trim().toLowerCase() == result.trim().toLowerCase());
                let index = user_docs.findIndex(x => x.data.email.trim().toLowerCase() == result.trim().toLowerCase());
                if (index > -1) {
                    user_docs.splice(index, 1);
                }
                var a = 0;
                const user_message = [];
                user_docs.forEach(element => {
                    console.log(user_message)
                    if (this.state.currentUser.id < element.id) {
                        this.state.id = this.state.currentUser.id + '&' + element.id;
                    }
                    else {
                        this.state.id = element.id + '&' + this.state.currentUser.id;
                    }
                    db.collection('Chatslist').doc('room').collection(this.state.id).onSnapshot((snapshot) => {
                        const docs = snapshot.docs.map((docSnapshot) => ({
                            id: docSnapshot.id,
                            data: docSnapshot.data()
                        }));
                        console.log(docs)
                        if (docs.length != 0 && docs[0].data.message) {
                            element.messages = docs[0].data.message;
                            var msgUnRead = 0;
                            var count = 0;
                            element.messages.forEach((ele) => {
                                overAllMessage++;
                                ele.createdAt = new Date(ele.createdAt.seconds * 1000);
                                if (ele.user._id != this.state.currentUser.id && ele.readed == 0) {
                                    count++;
                                    overAllMessageUnRead++;
                                }
                            })
                            let value = element.messages.findIndex(x => x.readed == 0);
                            console.log(value)
                            if (value === -1) {
                                msgUnRead = value;
                            }
                            element.messages.sort(function (a, b) {
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            });
                            element.unread = count;
                            element.msgUnRead = msgUnRead;
                            user_message.push(element);
                        }
                        else {
                            element.messages = [];
                            element.msgUnRead = msgUnRead;
                            element.unread = count;
                            user_message.push(element);
                        }
                        a++;
                        if (a === user_docs.length) {
                            console.log(user_message)
                            this.setState({ items: user_message, fullData: user_message, overAllMessage: overAllMessage, overAllMessageUnRead: overAllMessageUnRead });
                        }
                    })
                })
            })
        // })
    }

    handleSearch = (text) => {
        const formatQuery = text.toLowerCase();
        let filteredData = this.state.fullData.filter(x => String(x.data.fullname.toLowerCase()).includes(formatQuery));
        this.setState({ items: filteredData });
    }
    openChat = (toUser) => {
        const result = SyncStorage.get('user_email');
        firebaseSvc.chatList(this.state.currentUser, toUser);
        SyncStorage.set('user', this.state.currentUser);
        SyncStorage.set('to_user', toUser);
        this.props.navigation.navigate("Chat");
    }

    _keyExtractor = (item, index) => item;
    _renderItem = ({ item }) => {
        console.log(item)
        return (
            <View style={{ marginLeft: 16, marginRight: 16 }}>
                <TouchableOpacity onPress={() => this.openChat(item)}
                >
                    <CardView style={styles.chatCardData} cardElevation={6} cardMaxElevation={6} cornerRadius={5}>
                        <View style={styles.ChatRow}>
                            <View style={item.msgUnRead < 0 ? styles.chatUserImgRead : styles.chatUserImg}>
                                <Image style={{ resizeMode: "contain", overflow: 'hidden', height: 44, width: 44 }}

                                    source={require("../images/user.png")}
                                />
                                <View style={styles.chatDot}>
                                    {item.msgUnRead < 0 ? (<Image style={{ resizeMode: "contain", overflow: 'hidden', height: 10, width: 10, marginRight: 15 }}
                                        source={require("../images/dot_blue.png")}
                                    />) : (<Image style={{ resizeMode: "contain", overflow: 'hidden', height: 10, width: 10, marginRight: 15 }}
                                        source={require("../images/dot.png")}
                                    />)}

                                </View>
                            </View>
                            <View style={styles.chatView}>
                                <Text style={styles.chatName}>
                                    {item.data.fullname}
                                </Text>
                                <Text style={styles.chatMessage}>
                                    {item.msgUnRead < 0 ? (<Image style={{ resizeMode: "contain", overflow: 'hidden', height: 8, width: 8 }}
                                        source={require("../images/tick.png")}
                                    />) : (<Image style={{ resizeMode: "contain", overflow: 'hidden', height: 8, width: 8 }}
                                        source={require("../images/tick_1.png")}
                                    />)}

                                    &nbsp;&nbsp;
                                    {item.messages.length > 0 ? (

                                        <Text> {item.messages[0].text}</Text>
                                    ) : (
                                            <Text>{item.data.email}</Text>
                                        )}

                                </Text>
                            </View>
                            {item.messages.length > 0 ? (
                                <View style={styles.chatTimeView}>
                                    <Text style={styles.chatTime}>
                                        {Moment(item.messages[0].createdAt).calendar()}
                                    </Text>

                                    {item.unread > 0 ? (
                                        <View style={styles.chatCountView}>
                                            <Text style={styles.chatCount}>
                                                {item.unread}
                                            </Text>
                                        </View>) : (
                                            <View></View>
                                        )}
                                </View>
                            ) : (
                                    <View style={styles.chatTimeView}>
                                        {/* <Text style={styles.chatTime}>
                                            {Moment(item.messages[item.messages.length - 1].createdAt).calendar()}
                                        </Text> */}
                                    </View>
                                )}

                        </View>
                    </CardView>
                </TouchableOpacity>
            </View>
        )
    };



    render() {
        const dimensions = Dimensions.get('window');
        const screenWidth = dimensions.width;
        const { firstQuery } = this.state.items;
        return (
            // <View style={styles.container}>
            //     {this.state.items.length > 0 ? (
            //         <ItemComponent items={this.state.items} />
            //     ) : (
            //             <Text>No items</Text>
            //         )}
            // </View>
            <View >
                <HeaderComponent  navigation={this.props.navigation}
                />
                <View style={styles.listView}>

                    <View style={styles.searchBar}>
                        <Searchbar style={styles.search}
                            inputStyle={styles.searchInput}
                            placeholder="Search by user"
                            onChangeText={this.handleSearch}
                            value={firstQuery}
                            icon={require("../images/Search.png")}
                        />
                    </View>
                    <View style={{ marginTop: 40, marginBottom: 20, position: 'relative' }}>
                        <View style={styles.scrollviewStyle}>
                            <View style={styles.cardView}>
                                <View style={styles.card}>

                                    <CardView style={[styles.cardData, styles.selectedCardData]} cardElevation={2} cardMaxElevation={2} cornerRadius={0}>
                                        <View style={styles.cardIconRow}>
                                            <Image
                                                style={styles.leftIcon}
                                                source={require("../images/all-message-white.png")}
                                            />
                                            <Image
                                                style={styles.rightIcon}
                                                source={require("../images/more-white.png")}
                                            />
                                        </View>
                                        <View style={styles.cardTitleContainer}>
                                            <Text style={[styles.cardTitle, styles.selectedCardTitle]}>
                                                AllMessages
                                        </Text>
                                        </View>
                                        <View style={[styles.cardCountContainer, styles.selectedCardCountContainer]}>
                                            <Text style={[styles.cardCount, styles.selectedCardCount]}>
                                                {this.state.overAllMessage}
                                            </Text>
                                        </View>
                                    </CardView>

                                </View>
                                <View style={styles.card}>
                                    <CardView style={styles.cardData} cardElevation={2} cardMaxElevation={2} cornerRadius={0}>
                                        <View style={styles.cardIconRow}>
                                            <Image
                                                style={styles.leftIcon}
                                                source={require("../images/Unread-black.png")}
                                            />
                                            <Image
                                                style={styles.rightIcon}
                                                source={require("../images/more.png")}
                                            />
                                        </View>
                                        <View style={styles.cardTitleContainer}>
                                            <Text style={styles.cardTitle}>
                                                Unread
                                    </Text>
                                        </View>
                                        <View style={styles.cardCountContainer}>
                                            <Text style={styles.cardCount}>
                                                {this.state.overAllMessageUnRead}
                                            </Text>
                                        </View>
                                    </CardView>
                                </View>

                                <View style={styles.card}>

                                    <CardView style={styles.cardData} cardElevation={1} cardMaxElevation={1} cornerRadius={0}>
                                        <TouchableOpacity onPress={() => this.working()}
                                        >
                                            <View style={styles.cardIconRow}>
                                                <Image
                                                    style={styles.leftIcon}
                                                    source={require("../images/Unresponse-black.png")}
                                                />
                                                <Image
                                                    style={styles.rightIcon}
                                                    source={require("../images/more.png")}
                                                />
                                            </View>
                                            <View style={styles.cardTitleContainer}>
                                                <Text style={styles.cardTitle}>
                                                    Unresponse
                                    </Text>
                                            </View>
                                            <View style={styles.cardCountContainer}>
                                                <Text style={styles.cardCount}>
                                                    60
                                    </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>

                                </View>

                                <View style={styles.card}>

                                    <CardView style={styles.cardData} cardElevation={2} cardMaxElevation={2} cornerRadius={0}>
                                        <TouchableOpacity onPress={() => this.working()}
                                        >
                                            <View style={styles.cardIconRow}>
                                                <Image
                                                    style={styles.leftIcon}
                                                    source={require("../images/Auto-Message-black.png")}
                                                />
                                                <Image
                                                    style={styles.rightIcon}
                                                    source={require("../images/more.png")}
                                                />
                                            </View>
                                            <View style={styles.cardTitleContainer}>
                                                <Text style={styles.cardTitle}>
                                                    Automessage
                                    </Text>
                                            </View>
                                            <View style={styles.cardCountContainer}>
                                                <Text style={styles.cardCount}>
                                                    20
                                    </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>
                                </View>
                            </View>
                            <Divider style={{ marginTop: 40, position: 'relative', backgroundColor: '#C8C8C8' }} />
                            <View style={{ marginBottom: 20, position: 'relative', flexDirection: 'row', flex: 1 }}>
                                <View style={styles.peopleCountView}>
                                    <Text style={styles.peopleCountText}>
                                        25 People
                                </Text>
                                </View>
                                <View style={styles.peopleOnlineCountView}>
                                    <Text style={styles.peopleOnlineCountText}>
                                        Online
                                </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {this.state.items.length > 0 ? (

                            <FlatList
                                data={this.state.items}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                            />
                        ) : (
                                <Text style={{ marginLeft: '40%', marginTop: 100 }}>No users found</Text>
                            )}
                    </View>


                </View>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC',
    },
    listView: {
        backgroundColor: '#FCFCFC',
        height: 10000,
        borderRadius: 20,
        marginTop: 90,
    },
    searchBar: {
        backgroundColor: '#FCFCFC',
        margin: 10,
    },
    cardView: {
        flex: 1,
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flex: 6
    },
    cardData: {
        marginTop: 5,
        backgroundColor: 'white',
        width: '100%',
        marginBottom: 15,
        shadowColor: '#8C8C8C',
        height: 65,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 7,
    },
    chatCardData: {
        backgroundColor: 'white',
        width: '100%',
        marginBottom: 10,
        height: 62,
        shadowColor: '#8C8C8C',
        borderColor: '#ffffff'
    },
    selectedCardData: {
        backgroundColor: '#0DE3D7',
    },
    card: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    cardIconRow: {
        // flex: 1,
        flexDirection: 'row',
        height: 25,
        marginTop: 5
    },
    leftIcon: {
        width: 20,
        height: 20,
        resizeMode: "contain",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'column'
    },
    rightIcon: {
        marginLeft: 10,
        width: 20,
        height: 20,
        resizeMode: "contain",
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flex: 1,
        flexDirection: 'column'
    },
    selectedCardTitle: {
        color: 'white',
        fontWeight: '500',
    },
    selectedCardCount: {
        color: 'black'
    },
    cardTitle: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 8,
        fontFamily: "Poppins-Regular",
        color: 'black'
    },
    cardCount: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: 8,
        fontFamily: "Poppins-Regular",
        color: 'white',
        flex: 1,
        marginTop: 1
    },
    cardTitleContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 12,
        flexDirection: 'row',
        marginBottom: 3,
        marginBottom: 5,
        marginBottom: 5,
        marginLeft: 5,
        // flex:1,
    },
    cardCountContainer: {
        justifyContent: 'center',
        alignSelf: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#7c7c7c',
        height: 8,
        width: 35,
        borderRadius: 50,
        marginBottom: 5,
        marginLeft: 5,
        flex: 1,
    },
    selectedCardCountContainer: {
        backgroundColor: 'white',
    },
    scrollviewStyle: {
        marginRight: 16,
        marginLeft: 16
    },
    peopleCountView: {
        marginTop: 15,
        backgroundColor: '#0DE3D7',
        height: 20,
        width: 80,
        borderRadius: 50,
        flexDirection: 'column'
    },
    peopleOnlineCountView: {
        marginTop: 15,
        marginBottom: 15,
        height: 20,
        width: 60,
        flexDirection: 'column'
    },
    peopleCountText: {
        marginTop: 1,
        color: 'white',
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    peopleOnlineCountText: {
        marginTop: 2,
        color: 'black',
        fontFamily: "Poppins-Medium",
        fontSize: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ChatRow: {
        flex: 1,
        flexDirection: 'row'
    },
    chatUserImg: {
        height: 52,
        width: 52,
        borderColor: '#8C8C8C',
        borderRadius: 50,
        borderStyle: "dashed",
        borderWidth: 1,
        padding: 3,
        margin: 5,
        flexDirection: 'column',
    },
    chatUserImgRead: {
        height: 52,
        width: 52,
        borderColor: '#03F9EB',
        borderRadius: 50,
        borderStyle: "dashed",
        borderWidth: 1,
        padding: 3,
        margin: 5,
        flexDirection: 'column',
    },
    chatDot: {
        width: 12,
        height: 12,
        backgroundColor: 'white',
        borderRadius: 50,
        position: 'absolute',
        top: 37,
        left: 36,
        padding: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 18,
    },
    chatView: {
        width: '45%',
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 10,
        marginRight: 0,
    },
    chatName: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        color: 'black',
        height: 20,
        flexDirection: 'column',
    },
    chatMessage: {
        fontFamily: 'Poppins-Light',
        fontSize: 9.5,
        color: '#8C8C8C',
        height: 20,
        flexDirection: 'column',
        // marginLeft:10,
    },
    chatTimeView: {
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10,
        width: 100
    },
    chatTime: {
        fontFamily: 'Poppins-Light',
        fontSize: 9,
        color: '#000000',
        height: 20,
        flexDirection: 'column',
    },
    chatCountView: {
        flexDirection: 'column',
        marginLeft: 55,
        width: 15,
        backgroundColor: "#FF9B44",
        borderRadius: 50,
        height: 15,
    },
    chatCount: {
        fontFamily: 'Poppins-Medium',
        fontSize: 9,
        marginTop: 1,
        color: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    search: {
        shadowColor: '#8C8C8C',
        fontSize: 12
    },
    searchInput: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        color: '#8C8C8C',
    }

});