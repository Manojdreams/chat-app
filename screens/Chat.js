import React from 'react';
import { Text, View, FlatList, ImageBackground, StyleSheet, Dimensions, StatusBar, KeyboardAvoidingView, Image, TouchableOpacity, TextInput, TouchableHighlight, Platform } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import HeaderComponent from "../components/headerComponents";
import SyncStorage from 'sync-storage';
import firebaseSvc from '../FirebaseSvc';
// import * as firebase from 'firebase';
import firebase from 'react-native-firebase';
// import firestore from 'firebase/firestore';


export default class Chat extends React.Component {

  state = {
    messages: [],
    user: {},
    to_user: {},
    loaded: false,
    msgloaded: false,
    inputText: {}
  }
  componentDidMount() {
    var id;
    var key;
    this.state.user = SyncStorage.get('user');
    this.state.to_user = SyncStorage.get('to_user');
    if (this.state.user.id < this.state.to_user.id) {
      this.state.id = this.state.user.id + '&' + this.state.to_user.id;
    }
    else {
      this.state.id = this.state.to_user.id + '&' + this.state.user.id;
    }
    var user_id = this.state.user.id;
    var id = this.state.id;
    const db = firebase.firestore();
    console.log(id)
    db.collection('Chatslist').doc('room').collection(id).onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        data: docSnapshot.data()
      }));
      if (docs.length != 0) {
        key = docs[0].id;
        if (docs[0].data.message) {
          this.setState({ messages: [] })
          var message = docs[0].data.message;
          var loop = 0;
          message.forEach((element) => {
            element.createdAt = new Date(element.createdAt.seconds * 1000);
            if (element.user._id != this.state.user.id && element.readed == 0) {
              element.readed = 1;
              console.log(element)
            }
            loop++;
            if (loop == message.length) {
              message.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
              // if(!this.state.loaded){
              //   db.collection(`Chatslist/`).doc(`room/${id}/${key}`).update({ message: message});
              // }
              this.setState({ messages: message, loaded: true, msgloaded: true })
              db.collection(`Chatslist/`).doc(`room/${id}/${key}`).update({ message: message});
            }
          })

        }
        else {
          this.setState({ loaded: true })
          console.log(this.state.loaded)
        }
      }
      else {
        this.setState({ loaded: true })
        console.log(this.state.loaded)
      }
    })
  }

  onSend(messages = []) {
    messages[0]._id = this.state.to_user.id;
    messages[0].readed = 0;
    firebaseSvc.sendMsg(this.state.user, this.state.to_user, messages);

  }

  render() {
    console.log(this.state.messages.length)
    return (
      <View >
        <HeaderComponent page="chat" navigation={this.props.navigation}
        />
        <ImageBackground source={require("../images/chat-bg.png")} style={{ width: '100%', zIndex: -1, height: '100%' }}>
          {this.state.loaded === true ? (
            
            <GiftedChat
              loadEarlier={false}
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              text={this.state.inputText}
              onInputTextChanged={text => this.setState({ inputText: text })}
              user={{
                _id: this.state.user.id,
                avatar: 'https://placeimg.com/140/140/any',
              }}
            />
           
          ) : (
              <Text style={{ marginLeft: '40%', marginTop: 100 }}>No Text found</Text>
            )}

        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  image: {
    flex: 1
  }
});

