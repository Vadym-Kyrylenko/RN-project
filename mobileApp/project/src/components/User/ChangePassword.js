import React, {Component} from 'react';
import {ScrollView, Text, Alert, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {changePassword} from '../../redux-saga/actions/auth';
import {connect} from 'react-redux';

const msg = require('../../i18n/en').msg;

class ChangePasswordScreenComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lastPassword: '',
            newPassword: '',
            repeatNewPassword: '',
            lastPasswordError: null,
            newPasswordError: null,
            repeatNewPasswordError: null,
            passwordMatchCheck: null
        };
    }

    handleInput = (name, value) => {
        this.setState({...this.state, [name]: value})
    };

    handleSubmit = async () => {
        let {lastPassword, newPassword, repeatNewPassword} = this.state;
        let data = {lastPassword, newPassword, repeatNewPassword, userId: this.props.user._id};
        let validation = async () => {
            if (newPassword.trim() === '' && repeatNewPassword.trim() !== '' && lastPassword.trim() !== ''
                && newPassword.trim() === repeatNewPassword.trim()) {
                this.setState(() => ({
                    newPasswordError: msg.enterNewPassword,
                    lastPasswordError: null,
                    repeatNewPasswordError: null,
                    passwordMatchCheck: null
                }));
            } else if (lastPassword.trim() === '' && repeatNewPassword.trim() !== '' && newPassword.trim() !== ''
                && newPassword.trim() !== repeatNewPassword.trim()) {
                this.setState(() => ({
                    lastPasswordError: msg.enterLastPassword,
                    newPasswordError: null,
                    repeatNewPasswordError: null,
                    passwordMatchCheck: msg.newPasswordAndRepeatNewPasswordDoNotMatch
                }));
            } else if (lastPassword.trim() !== '' && repeatNewPassword.trim() !== '' && newPassword.trim() === '') {
                this.setState(() => ({
                    lastPasswordError: null,
                    newPasswordError: msg.enterNewPassword,
                    repeatNewPasswordError: null,
                    passwordMatchCheck: null
                }));
            } else if (lastPassword.trim() === '' && repeatNewPassword.trim() !== '' && newPassword.trim() !== '') {
                this.setState(() => ({
                    lastPasswordError: msg.enterLastPassword,
                    repeatNewPasswordError: null,
                    newPasswordError: null,
                    passwordMatchCheck: null
                }));
            } else if (repeatNewPassword.trim() === '' && newPassword.trim() !== '' && lastPassword.trim() !== '') {
                this.setState(() => ({
                    repeatNewPasswordError: msg.enterRepeatNewPassword,
                    lastPasswordError: null,
                    newPasswordError: null,
                    passwordMatchCheck: null
                }));
            } else if (newPassword.trim() === '' && repeatNewPassword.trim() === '' && lastPassword.trim() === '') {
                this.setState(() => ({
                    lastPasswordError: msg.enterLastPassword,
                    newPasswordError: msg.enterNewPassword,
                    repeatNewPasswordError: msg.enterRepeatNewPassword,
                    passwordMatchCheck: null
                }));
            } else if (newPassword.trim() === '' && lastPassword.trim() === '' && repeatNewPassword.trim() !== '') {
                this.setState(() => ({
                    lastPasswordError: msg.enterLastPassword,
                    newPasswordError: msg.enterNewPassword,
                    repeatNewPasswordError: null,
                    passwordMatchCheck: null
                }));
            } else if (newPassword.trim() !== '' && lastPassword.trim() === '' && repeatNewPassword.trim() === '') {
                this.setState(() => ({
                    lastPasswordError: msg.enterLastPassword,
                    newPasswordError: null,
                    repeatNewPasswordError: msg.enterRepeatNewPassword,
                    passwordMatchCheck: null
                }));
            } else if (newPassword.trim() !== '' && repeatNewPassword.trim() !== '' && newPassword.trim() !== repeatNewPassword.trim()) {
                this.setState(() => ({
                    passwordMatchCheck: msg.newPasswordAndRepeatNewPasswordDoNotMatch,
                    lastPasswordError: null,
                    repeatNewPasswordError: null,
                    newPasswordError: null
                }));
            } else if (lastPassword.trim() !== '' && newPassword.trim() !== '' && repeatNewPassword.trim() !== ''
                && newPassword.trim() === repeatNewPassword.trim()) {
                this.setState(() => ({
                    lastPasswordError: null,
                    newPasswordError: null,
                    repeatNewPasswordError: null,
                    passwordMatchCheck: null
                }));
                await this.props.dispatch(changePassword(data));
            }
        };
        await validation();
    };

    componentWillReceiveProps(nextProps) {

        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 0) {
                Alert.alert(
                    msg.profileMessage,
                    msg.passwordChanged,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Profile')
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
            if (nextProps.success.status === 2) {
                Alert.alert(
                    msg.profileMessage,
                    msg.notCorrectLastPassword,
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
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.textTitle}>Change password Component</Text>
                {!!this.state.passwordMatchCheck && (
                    <Text style={styles.textError}>{this.state.passwordMatchCheck}</Text>
                )}
                <Text>Last password</Text>
                <Input
                    placeholder={msg.lastPassword}
                    secureTextEntry={true}
                    value={this.state.lastPassword}
                    onChangeText={(value) => this.handleInput('lastPassword', value)}
                    returnKeyType='next'
                />
                {!!this.state.lastPasswordError && (
                    <Text style={styles.textError}>{this.state.lastPasswordError}</Text>
                )}
                <Text>New password</Text>
                <Input
                    placeholder={msg.newPassword}
                    secureTextEntry={true}
                    value={this.state.newPassword}
                    onChangeText={(value) => this.handleInput('newPassword', value)}
                    returnKeyType='next'
                />
                {!!this.state.newPasswordError && (
                    <Text style={styles.textError}>{this.state.newPasswordError}</Text>
                )}

                <Text>Repeat new password</Text>
                <Input
                    placeholder={msg.repeatNewPassword}
                    secureTextEntry={true}
                    value={this.state.repeatNewPassword}
                    selectTextOnFocus
                    onChangeText={(value) => this.handleInput('repeatNewPassword', value)}
                    returnKeyType='next'
                />
                {!!this.state.repeatNewPasswordError && (
                    <Text style={styles.textError}>{this.state.repeatNewPasswordError}</Text>
                )}


                <Button
                    containerStyle={styles.button}
                    title={msg.changePassword}
                    onPress={() => this.handleSubmit()}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {marginBottom: 25},
    textError: {color: 'red', marginLeft: 25},
    button: {marginTop: 10},
    textTitle: {textAlign: 'center', margin: 10}
});

export const ChangePassword = (connect((state) => ({
    user: state.auth.user,
    success: state.auth.success
}))(ChangePasswordScreenComponent));
