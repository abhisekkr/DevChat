import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyCQXsVhBeqO9Fv5hJFEPNjgZ1rKEZqJVcQ",
	authDomain: "chatapp-3b9d3.firebaseapp.com",
	projectId: "chatapp-3b9d3",
	storageBucket: "chatapp-3b9d3.appspot.com",
	messagingSenderId: "759399202283",
	appId: "1:759399202283:web:0a36abc7e14d67526a2dae",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { storage, auth, provider };
export default db;
