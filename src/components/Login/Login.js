import { Button } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import './Login.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: false,
    })
    //this firebase configuration
    const handleGoogleSign = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;
                var token = credential.accessToken;
                var user = result.user;
                const { displayName, photoURL, email } = user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    photo: photoURL,
                    email: email
                }
                setUser(signedInUser);
                setLoggedInUser(signedInUser);
                history.replace(from);
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
            });
    }
    const handleFbSignIn = () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                const { displayName, photoURL, email } = user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    photo: photoURL,
                    email: email
                }
                setUser(signedInUser);
                setLoggedInUser(signedInUser);
                history.replace(from);
                console.log(user);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                console.log(errorCode, errorMessage, email)
            });
    }

    const handleGithubSIgnIn = () => {
        const provider = new firebase.auth.GithubAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                const { displayName, photoURL, email } = user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    photo: photoURL,
                    email: email
                }
                setUser(signedInUser);
                setLoggedInUser(signedInUser);
                history.replace(from);
                console.log(user);
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                console.log(errorMessage, errorCode, email)
            });
    }
    const handleOnBlur = (e) => {
        let isFormValid = true;
        console.log(e.target.name, e.target.value);
        if (e.target.name === 'email') {
            isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const isPassValid = e.target.value.length > 6;
            const passHasNum = /\d{1}/.test(e.target.value)
            isFormValid = isPassValid && passHasNum;
        }
        if (isFormValid) {
            const newUser = { ...user };
            newUser[e.target.name] = e.target.value;
            newUser.isSignedIn = true;
            setUser(newUser);
        }
    }
    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    const newUser = { ...user };
                    newUser.error = ''
                    newUser.success = true;
                    setUser(newUser);
                    updateUserName(user.name)
                    setLoggedInUser(newUser);
                    history.replace(from);
                })
                .catch((error) => {
                    const newUser = { ...user };
                    newUser.error = error.message;
                    newUser.success = false;
                    setUser(newUser);
                });
        }
        if (!newUser && user.name, user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    const newUser = { ...user };
                    newUser.error = ''
                    newUser.success = true;
                    setUser(newUser);
                    setLoggedInUser(newUser);
                    history.replace(from);
                    console.log('sign in user info ', res.user)
                })
                .catch((error) => {
                    const newUser = { ...user };
                    newUser.error = error.message;
                    newUser.success = false;
                    setUser(newUser);

                });
        }
        e.preventDefault()
    }
    const updateUserName = name => {
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name
        }).then(function () {
            console.log('user name updated successfully')
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
        <div className="container mt-5">
            {
                user.isSignedIn &&
                <div>
                    name: {user.name} <br />
                email: {user.email} <br />
                password: {user.password}
                    <img src={user.photo} alt="" />

                </div>
            }
            <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-12 sing-up">
                    <Form onSubmit={handleSubmit}>
                        {newUser && <Form.Group controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" onBlur={handleOnBlur} name="name" placeholder="Enter Name" />
                        </Form.Group>}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" onBlur={handleOnBlur} name="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onBlur={handleOnBlur} name="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onClick={() => setNewUser(!newUser)} type="checkbox" label="Create new account" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {newUser ? 'sign up' : 'sign in'}
                        </Button>
                    </Form>
                </div>
                <div className="col-md-6 col-lg-6 col-sm-12 sign-up-social">
                    <button onClick={handleGoogleSign} className="social-button">Sign Up with Goggle</button><br />
                    <button onClick={handleFbSignIn} className="social-button">Sign Up with Facebook</button> <br />
                    <button onClick={handleGithubSIgnIn} className="social-button">Sign Up with Github</button> <br />
                </div>
            </div>
            <p style={{ color: 'red' }}>{user.error}</p>
            {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged in'} Successfully</p>}
        </div>
    );
};

export default Login;