import React, {Component} from 'react';
import {connect} from 'react-redux'
import {View, KeyboardAvoidingView, Alert, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements/src/index';
import {Input, Text} from 'react-native-elements';
import {registerUser} from '../../redux-saga/actions/auth';
import {Header} from 'react-navigation'

const msg = require('../../i18n/en').msg;

class RegisterScreenComponent extends Component {
    static navigationOptions = {
        title: msg.registration,
    };

    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                firstNameError: null,
                lastNameError: null,
                emailError: null,
                passwordError: null
            },
        }
    }

    handleInput = (name, value) => {
        this.setState({user: {...this.state.user, [name]: value}});
    };

    handleSubmit = async () => {
        const user = this.state.user;
        const {firstName, lastName, email, password} = user;
        let validation = async () => {
            if (firstName && lastName && email && password) {
                this.setState({
                    firstNameError: null,
                    lastNameError: null,
                    emailError: null,
                    passwordError: null,
                });
                this.props.dispatch(registerUser(user));
            } else if (!firstName && lastName && email && password) {
                this.setState(() => ({
                    firstNameError: msg.enterFirstName,
                    lastNameError: null,
                    emailError: null,
                    passwordError: null
                }));
            } else if (firstName && !lastName && email && password) {
                this.setState(() => ({
                    lastNameError: msg.enterLastName,
                    firstNameError: null,
                    emailError: null,
                    passwordError: null
                }));
            } else if (firstName && lastName && !email && password) {
                this.setState(() => ({
                    emailError: msg.enterEmail,
                    lastNameError: null,
                    firstNameError: null,
                    passwordError: null
                }));
            } else if (firstName && lastName && email && !password) {
                this.setState(() => ({
                    passwordError: msg.enterPassword,
                    emailError: null,
                    lastNameError: null,
                    firstNameError: null,
                }));
            } else if (!firstName && !lastName && email && password) {
                this.setState(() => ({
                    firstNameError: msg.enterFirstName,
                    lastNameError: msg.enterLastName,
                    emailError: null,
                    passwordError: null
                }));
            } else if (!firstName && !lastName && !email && password) {
                this.setState(() => ({
                    firstNameError: msg.enterFirstName,
                    lastNameError: msg.enterLastName,
                    emailError: msg.enterEmail,
                    passwordError: null
                }));
            } else if (!firstName && !lastName && !email && !password) {
                this.setState(() => ({
                    firstNameError: msg.enterFirstName,
                    lastNameError: msg.enterLastName,
                    emailError: msg.enterEmail,
                    passwordError: msg.enterPassword
                }));
            } else if (firstName && !lastName && !email && !password) {
                this.setState(() => ({
                    firstNameError: null,
                    lastNameError: msg.enterLastName,
                    emailError: msg.enterEmail,
                    passwordError: msg.enterPassword
                }));
            } else if (firstName && lastName && !email && !password) {
                this.setState(() => ({
                    firstNameError: null,
                    lastNameError: null,
                    emailError: msg.enterEmail,
                    passwordError: msg.enterPassword
                }));
            } else if (!firstName && lastName && !email && password) {
                this.setState(() => ({
                    firstNameError: msg.enterFirstName,
                    lastNameError: null,
                    emailError: msg.enterEmail,
                    passwordError: null
                }));
            } else if (firstName && !lastName && email && !password) {
                this.setState(() => ({
                    firstNameError: null,
                    lastNameError: msg.enterLastName,
                    emailError: null,
                    passwordError: msg.enterPassword
                }));
            }
        };
        await validation();
    };

    componentWillReceiveProps(nextProps) {

        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 7) {
                Alert.alert(
                    msg.registrationMessage,
                    msg.userRegistered,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({
                                    user: {
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        password: '',
                                        firstNameError: null,
                                        lastNameError: null,
                                        emailError: null,
                                        passwordError: null,
                                    },
                                });
                                this.props.navigation.navigate('Authentication')
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
        }
    }

    render() {
        const {user} = this.state;
        return (

            <KeyboardAvoidingView
                keyboardVerticalOffset={Header.HEIGHT}
                style={styles.container}
                behavior='padding'>
                <Text>Registration form</Text>
                <Input
                    placeholder={msg.firstName}
                    leftIcon={{type: 'font-awesome', name: 'user'}}
                    value={user.firstName}
                    onChangeText={(value) => this.handleInput('firstName', value)}
                />
                {!!this.state.firstNameError && (
                    <Text style={styles.textError}>{this.state.firstNameError}</Text>
                )}

                <Input
                    placeholder={msg.lastName}
                    leftIcon={{type: 'font-awesome', name: 'user'}}
                    value={user.lastName}
                    onChangeText={(value) => this.handleInput('lastName', value)}
                />
                {!!this.state.lastNameError && (
                    <Text style={styles.textError}>{this.state.lastNameError}</Text>
                )}

                <Input
                    placeholder={msg.email}
                    keyboardType='email-address'
                    leftIcon={{type: 'font-awesome', name: 'envelope'}}
                    value={user.email}
                    onChangeText={(value) => this.handleInput('email', value)}
                />
                {!!this.state.emailError && (
                    <Text style={styles.textError}>{this.state.emailError}</Text>
                )}

                <Input
                    secureTextEntry={true}
                    placeholder={msg.password}
                    leftIcon={{type: 'font-awesome', name: 'lock'}}
                    value={user.password}
                    onChangeText={(value) => this.handleInput('password', value)}
                />
                {!!this.state.passwordError && (
                    <Text style={styles.textError}>{this.state.passwordError}</Text>
                )}

                <View style={styles.buttonView}>
                    <Button
                        title={msg.registration}
                        type='outline'
                        containerStyle={styles.button}
                        onPress={() => this.handleSubmit()}
                    />
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {flex: 1},
    buttonView: {flexDirection: 'row', justifyContent: 'space-around', margin: 3},
    button: {width: 'auto', backgroundColor: '#e5e9ea'},
    textError: {
        color: 'red',
        marginLeft: 25
    }
});

export const Register = (connect((state) => ({
    success: state.auth.success
}))(RegisterScreenComponent));