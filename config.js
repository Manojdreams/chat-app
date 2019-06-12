// import  * as Firebase from 'firebase';
// import firestore from 'firebase/firestore';
import firebase from 'react-native-firebase';

const settings = {timestampsInSnapshots: false};

let config = {
  apiKey: "AIzaSyBFIVrWzeT_b9HsyR5aOJeI2YyI65FoAlM",
  authDomain: "react-chat-c5ca8.firebaseapp.com",
  databaseURL: "https://react-chat-c5ca8.firebaseio.com",
  projectId: "react-chat-c5ca8",
  storageBucket: "react-chat-c5ca8.appspot.com",
  messagingSenderId: "174595149252",
};



let app = firebase.initializeApp(config);
// Firebase.firestore().settings(settings);

export const db = app.database();  