// firebase config key setuo 

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD6sgGQAefs5zIZBT0C2lkYIaGIJjpHbqY",
    authDomain: "ortagtest.firebaseapp.com",
    projectId: "ortagtest",
    storageBucket: "ortagtest.appspot.com",
    messagingSenderId: "523196127849",
    appId: "1:523196127849:web:69af1eacf6a3574fac60f8",
    measurementId: "G-YS6V6127W9"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

  export{firebase};