import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyA8whbqgKf7e4RioOOBuImbZgmseRwqRSQ",
    authDomain: "real-estate-c8cbb.firebaseapp.com",
    projectId: "real-estate-c8cbb",
    storageBucket: "real-estate-c8cbb.appspot.com",
    messagingSenderId: "675474461591",
    appId: "1:675474461591:web:96d8d095c6bf4143a5aad2",
    measurementId: "G-G7QK3WR7XQ"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if(!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await (userRef.get());

    if(!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })

        } catch (error) {
            console.log('error creating user', error.message);
        }
    }
    
    return userRef;
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;