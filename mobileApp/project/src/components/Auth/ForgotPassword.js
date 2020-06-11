import React, {Component} from 'react';
import {ScrollView, Text, View, Alert, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {forgotPassword} from '../../redux-saga/actions/auth';
import {connect} from 'react-redux';

const msg = require('../../i18n/en').msg;

class ForgotPasswordScreenComponent extends Component {
    state = {
        email: '',
        emailError: null,
        showError: false,
        messageFromServer: '',
        showNullError: false,
    };

    handleInput = (name, value) => {
        this.setState({...this.state, [name]: value})
    };

    handleSubmit = async () => {
        const {email} = this.state;

        let validation = async () => {
            if (email) {
                this.setState({
                    emailError: null,
                });
                this.props.dispatch(forgotPassword({email: email}));
            } else if (!email) {
                this.setState(() => ({
                    emailError: msg.enterEmail,
                }));
            }
        };
        await validation();
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 403) {
                Alert.alert(
                    msg.authMessage,
                    msg.emailNotInDb,
                    [
                        {
                            text: 'OK', onPress: () => {
                                console.log('OK Pressed');
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
            if (nextProps.success.status === 8) {
                Alert.alert(
                    msg.authMessage,
                    msg.emailWithNewPasswordSent,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Login')
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
        }
    }

    render() {
        const {email} = this.state;
        return (
            <ScrollView>
                <Text style={styles.text}>Forgot password Component</Text>
                <Text>Email</Text>
                <Input
                    placeholder={msg.email}
                    value={email}
                    onChangeText={(value) => this.handleInput('email', value)}
                    returnKeyType='next'
                />
                {!!this.state.emailError && (
                    <Text style={styles.textError}>{this.state.emailError}</Text>
                )}

                <View style={styles.buttonView}>
                    <Button
                        title={msg.sendNewPasswordToEmail}
                        type='outline'
                        containerStyle={styles.button}
                        onPress={() => this.handleSubmit()}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonView: {flexDirection: 'row', justifyContent: 'space-around', margin: 3},
    button: {width: 'auto', backgroundColor: '#e5e9ea'},
    text: {textAlign: 'center', margin: 10},
    textError: {
        color: 'red',
        marginLeft: 25
    }
});

export const ForgotPassword = (connect((state) => ({
    success: state.auth.success
}))(ForgotPasswordScreenComponent));