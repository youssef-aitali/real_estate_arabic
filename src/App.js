import React from 'react';
import MapView from './components/MapView/MapView';
import Navbar from './components/Navbar/Navbar';
import SignUpSignIn from './components/SignUp-SignIn/SignUp-SignIn.component';
import Sidebar from './components/Sidebar/Sidebar';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';

import './App.css'

class App extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      isSignUpModal : false,
      currentUser: null
    }

  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          });
        })
      } else {
        this.setState({currentUser: userAuth});
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

 showSignUpModal = () => {
    this.setState({
      isSignUpModal: true
    });
  }

  hideSignUpModal = () => {
    this.setState({
      isSignUpModal: false
    });
  }

  render() {

    return (
      <div className="containerBox">
        <Navbar showSignUpModal={this.showSignUpModal} currentUser={this.state.currentUser}/>
        { this.state.isSignUpModal ? <SignUpSignIn hideSignUpModal={this.hideSignUpModal} /> : null }
        <Sidebar />
        <MapView />
      </div>
    );

  }
}

export default App;
