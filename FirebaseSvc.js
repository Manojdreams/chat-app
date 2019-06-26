// import firebase from 'firebase';
// import firestore from 'firebase/firestore';
import SyncStorage from 'sync-storage';
import firebase from 'react-native-firebase';


class FirebaseSvc {
  state = {
    chatId: ''
  };
  login = async (user, success_callback, failed_callback) => {
    await firebase.auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  }

  userList = (email, name) => {

    // ********************************************** FireStore ********************************************
    const device_id = SyncStorage.get('fcmToken');
    if(device_id){
      const db = firebase.firestore();
      db.collection('users').onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          data: docSnapshot.data()
        }));
        if (docs.length == 0) {
          const userRef = db.collection('users').add({
            fullname: name,
            email: email,
            device_id: device_id
          });
        }
        else {
          let users = Object.values(docs);
  
          let value = users.findIndex(x => x.data.email.trim().toLowerCase() == email.trim().toLowerCase());
          if (value === -1) {
            const userRef = db.collection('users').add({
              fullname: name,
              email: email,
              device_id: device_id
            });
          }
        }
  
      })
    }
    else{
      this.checkPermission();
    }
   


    // **********************************************Real time database ********************************************

    // var recentPostsRef = firebase.database().ref('Users/');
    // recentPostsRef.once('value').then(snapshot => {
    //   let data = JSON.stringify(snapshot);
    //   if (data == 'null') {
    //     firebase.database().ref('Users/').push({
    //       email,
    //       name
    //     }).then((data) => {
    //       //success callback
    //       return true
    //     }).catch((error) => {
    //       //error callback
    //       return true
    //     })
    //   }
    //   let users = Object.values(snapshot.val());
    //   let value = users.findIndex(x => x.email.trim() == email.trim());
    //   if (value === -1) {
    //     firebase.database().ref('Users/').push({
    //       email,
    //       name
    //     }).then((data) => {
    //       return true
    //     }).catch((error) => {
    //       return true
    //     })
    //   }
    // })
  }



  chatList = (fromEmail, toEmail) => {
    if (fromEmail.id < toEmail.id) {
      this.state.id = fromEmail.id + '&' + toEmail.id;
    }
    else {
      this.state.id = toEmail.id + '&' + fromEmail.id;
    }
    var user_id = fromEmail.id;
    var id = this.state.id;

    // ********************************************** FireStore ********************************************
    const db = firebase.firestore();
    db.collection('Chatslist').doc('room').collection(id).onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        data: docSnapshot.data()
      }));
      if (docs.length == 0) {
        const userRef = db.collection('Chatslist').doc('room').collection(id).add({

        });
      }
      // else {
      //   let users = Object.values(docs);
      //   let value = users.findIndex(x => x.data.user_id == user_id);
      //   if (value === -1) {
      //     const userRef = db.collection(`Chatslist/${user_id}/${id}`).add({
      //       // user_id
      //     });
      //   }
      // }
    })

    // **********************************************Real time database ********************************************


    // var recentPostsRef = firebase.database().ref('ChatList/');
    // recentPostsRef.once('value').then(snapshot => {
    //   let data = JSON.stringify(snapshot);
    //   if (data == 'null') {
    //     firebase.database().ref('ChatList/').push({
    //       id
    //     }).then((data) => {
    //       //success callback
    //       return true
    //     }).catch((error) => {
    //       //error callback
    //       return true
    //     })
    //   }
    //   let users = Object.values(snapshot.val());
    //   alert(JSON.stringify(users))
    //   alert(id)
    //   let value = users.findIndex(x => x.id.trim() == id.trim());
    //   if (value === -1) {
    //     firebase.database().ref('ChatList/').push({
    //       id
    //     }).then((data) => {
    //       return true
    //     }).catch((error) => {
    //       return true
    //     })
    //   }
    // })
  }

  sendMsg(fromEmail, toEmail, message) {
    if (fromEmail.id < toEmail.id) {
      this.state.id = fromEmail.id + '&' + toEmail.id;
    }
    else {
      this.state.id = toEmail.id + '&' + fromEmail.id;
    }
    var user_id = fromEmail.id;
    var id = this.state.id;
    var key;
    var msgData = [];

    // ********************************************** FireStore ********************************************
    const db = firebase.firestore();
    db.collection('Chatslist').doc('room').collection(id).onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        data: docSnapshot.data()
      }));
      key = docs[0].id;
      if (docs[0].data.message) {
        msgData = docs[0].data.message;
      }
      msgData.push(message[0]);
    })
    setTimeout(() => {
      db.collection('Chatslist').doc('room').collection(id).doc(key).update({ message: msgData });
    }, 1000);

  }

  getUserList() {

    // ********************************************** FireStore ********************************************

    const db = firebase.firestore();
    db.collection('users').onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        data: docSnapshot.data()
      }));


      // **********************************************Real time database ********************************************

      //   var recentPostsRef = firebase.database().ref('Users/');
      //   recentPostsRef.once('value').then(snapshot => {
      //     let data = JSON.stringify(snapshot);
      //     if (data == 'null') {
      //       alert('data');
      //       return data;
      //     }
      //     else {
      //       let users = Object.values(snapshot.val());
      //       alert(users);
      //       return users;
      //     }
      //   })
      // }
    })
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
      this.userList();
     console.log(fcmToken);
      if (fcmToken) {
        
        // user has a device token
        await SyncStorage.set('fcmToken', fcmToken);
        console.log(fcmToken);
        this.userList();
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
      firebase.messaging().requestPermission();
      // User has rejected permissions
      // alert('permission rejected');
    }
  }

  

}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
// export const firestore = firebase.firestore();