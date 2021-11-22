import { firebaseConfig } from "./config";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'
import 'firebase/compat/auth';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const firestore = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export default firebaseApp;