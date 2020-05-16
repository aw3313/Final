import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


import logo from './logo.svg';
import './App.css';
import CreateAccount from './pages/CreateAccount.js';
import Login from './pages/Login.js';
import UserProfile from './pages/UserProfile.js';
import Header from './components/Header.js';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";





function App() {
  // Your web app's Firebase configuration
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInformation, setUserInformation] = useState({})

  // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyC7kME3zdtAYecpUj8rq-5VvxuyhwTrTjQ",
      authDomain: "finalproject-f082e.firebaseapp.com",
      databaseURL: "https://finalproject-f082e.firebaseio.com",
      projectId: "finalproject-f082e",
      storageBucket: "finalproject-f082e.appspot.com",
      messagingSenderId: "666007735827",
      appId: "1:666007735827:web:a54076342151f17451b9e6",
      measurementId: "G-RXQLXG59M7"
    };
    // Initialize Firebase


useEffect(() => {


  if(!firebase.apps.length){
    //Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }


//Setting auth to be persistent in SESSION storage, not cookies
//You can also use cookies with firebase but were using session
//because it is easier to work with.
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .catch(function(e) {
    console.log("INSTANTIATING AUTH ERROR", e);
  });
}, [firebaseConfig]);

// Check to see if User is logged in
//User loads page, check their status
// Set state accordingnly
useEffect(()=> {
  firebase.auth().onAuthStateChanged(function(user){
    if(user) {
      //Logged in
      setUserInformation(user)
      setLoggedIn(true);
    } else {
      // Not logged in
      setUserInformation({})
      setLoggedIn(false);
    }
    setLoading(false);
  })
}, [])



//Login
function LoginFunction(e) {
  e.preventDefault();
  let email= e.currentTarget.loginEmail.value;
  let password = e.currentTarget.loginPassword.value

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function(response){
      console.log("LOGIN RESPONSE", response)
      setLoggedIn(true);
    })
    .catch(function(error){
      console.log("LOGIN ERROR",error)

    })

}

//Logout
function LogOutFunction(){
  firebase
  .auth()
  .signOut()
  .then(function() {
    setLoggedIn(false)
  })
  .catch(function(error) {
    console.log("LOGOUT ERROR", error);
  });
}



//Create Account
function CreateAccountFunction(e){
  e.preventDefault();
  console.log('form payload', e);
  //Default values for testing
let email= e.currentTarget.createEmail.value;
let password= e.currentTarget.createPassword.value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email,password)
    .then(function(response) {
      console.log('VALID ACCOUNT CREATE', response);
      setLoggedIn(true);
    })
    .catch(function(e) {
      console.log("CREATE ACCOUNT ERROR", e);
    })

}






  return (
    <div className="App">
      <Header LogOutFunction={LogOutFunction} isLoggedIn={loggedIn}/>
      <Router>
          <Route exact path="/">
            {!loggedIn ? <Redirect to="/login" /> : <UserProfile userInformation={userInformation}/>}
          </Route>
          <Route exact path="/login">
          {!loggedIn ? (
            <Login LoginFunction={LoginFunction}/>
          ): (
            <Redirect to="/" />
          )}
          </Route>
          <Route exact path="/create-account">
          {!loggedIn ? (
            <CreateAccount CreateAccountFunction={CreateAccountFunction}/>
          ) : (
            <Redirect to="/" />
          )}
          </Route>


      </Router>
    </div>
  );
}

export default App;
