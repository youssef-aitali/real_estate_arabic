import React from 'react';
import SignUp from '../SignUp/SignUp.component';
import SignIn from '../SignIn/SignIn.component';
import './SignUp-SignIn.styles.scss';

class SignUpSignIn extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="myModal">
                <div className="modal-dialog mx-0">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="staticBackdropLabel">تسجيل الدخول</h4>
                            <button type="button" className="btn-close" onClick={this.props.hideSignUpModal}></button>
                        </div>
                        <div className="modal-body p-5">
                            <SignIn />
                            <SignUp />
                        </div>
                    </div>
                </div>
          </div>
          );
    }
}

export default SignUpSignIn;