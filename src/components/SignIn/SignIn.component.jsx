import React from 'react';

import FormInput from '../Form-input/Form-input.component';
import { signInWithGoogle } from '../../firebase/firebase.utils';

import './SignIn.styles.scss';

class SignIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    handleSubmit = event => {
        event.preventDefault();
    
        this.setState({ email: '', password: '' });
      };
    
    handleChange = event => {
        const { value, name } = event.target;
    
        this.setState({ [name]: value });
    };

    render() {
        return (
            <div>
                <h4>الدخول إلى الحساب</h4>
                    <form onSubmit={this.handleSubmit}>
                        <FormInput
                                    name='email'
                                    type='email'
                                    className="form-control"
                                    handleChange={this.handleChange}
                                    value={this.state.email}
                                    label="البريد الإلكتروني :"
                                    required    
                        />
                        <FormInput
                                    name='password'
                                    type='password'
                                    className="form-control"
                                    handleChange={this.handleChange}
                                    value={this.state.password}
                                    label="الرقم السري :"
                                    required
                        />
                        <div className="buttons">
                            <button type="submit" className="btn btn-primary">الدخول</button>
                            <button onClick={signInWithGoogle} className="btn btn-secondary">الدخول بواسطة غوغل</button>
                        </div>
                    </form>
            </div>
            
        )
    }
}

export default SignIn;