import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
        apiKey: "AIzaSyAuE2hyCl9hyDA-dTOJbVpX33haR9CDqF0",
        authDomain: "react-chat-app-d7788.firebaseapp.com",
        databaseURL: "https://react-chat-app-d7788.firebaseio.com",
        projectId: "react-chat-app-d7788",
        storageBucket: "react-chat-app-d7788.appspot.com",
        messagingSenderId: "713814693300"
  };
  firebase.initializeApp(config);

  export default firebase;