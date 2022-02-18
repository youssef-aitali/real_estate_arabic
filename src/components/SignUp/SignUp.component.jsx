import React from 'react';

import FormInput from '../Form-input/Form-input.component';

import { auth, createUserProfileDocument} from '../../firebase/firebase.utils';

import './SignUp.styles.scss';

class SignUp extends React.Component {

    constructor(){
        super();

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        const {displayName, email, password, confirmPassword} = this.state;
        
        if(password !== confirmPassword) {
            alert("Passwords dont't match");
            return;
        }

        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            createUserProfileDocument(user, {displayName});
            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error(error);
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
    
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div>
                <h4>Register</h4> 
                    <form onSubmit={this.handleSubmit}>
                        <FormInput
                                    name='displayName'
                                    type='text'
                                    className="form-control"
                                    handleChange={this.handleChange}
                                    value={this.state.displayName}
                                    label="Username :"
                                    required    
                        />
                        <FormInput
                                    name='email'
                                    type='email'
                                    className="form-control"
                                    handleChange={this.handleChange}
                                    value={this.state.email}
                                    label="Email :"
                                    required    
                        />
                        <FormInput
                                    name='password'
                                    type='password'
                                    className="form-control"
                                    handleChange={this.handleChange}
                                    value={this.state.password}
                                    label="Password :"
                                    required    
                        />
                        <FormInput
                                    name='confirmPassword'
                                    type='password'
                                    className="form-control"
                                    handleChange={this.handleChange}
                                    value={this.state.confirmPassword}
                                    label="Confirm Password :"
                                    required    
                        />
                        <div className="buttons">
                            <button type="submit" className="btn btn-primary">Continue</button>
                        </div>
                    </form>
            </div>
            
        )
    }
}

export default SignUp;