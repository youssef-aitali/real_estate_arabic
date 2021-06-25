import React from 'react';
import MapView from './components/MapView/MapView';
import Navbar from './components/Navbar/Navbar';
import SignUp from './components/SignUp/SignUp';
import Sidebar from './components/Sidebar/Sidebar';

import './App.css'

class App extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      isSignUpModal : false
    }

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
        <Navbar showSignUpModal={this.showSignUpModal}/>
        { this.state.isSignUpModal ? <SignUp hideSignUpModal={this.hideSignUpModal} /> : null }
        <MapView />
        <Sidebar />
      </div>
    );

  }
}

export default App;
