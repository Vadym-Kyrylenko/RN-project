import React, {Component} from 'react';
import {connect} from 'react-redux'
import {ScrollView, View, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-elements/src/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';
import {loginUser} from '../../redux-saga/actions/auth';
import GoogleAuth from './GoogleAuth';
import AsyncStorage from "@react-native-community/async-storage";

const msg = require('../../i18n/en').msg;

class AuthScreenComponent extends Component {
    static navigationOptions = {
        title: msg.authentication,
    };

    constructor(props) {
        super(props);
        this.state = {
            login: {
                email: '',
                password: '',
            },
            nameErrorEmail: null,
            nameErrorPassword: null
        }
    }


    async componentDidMount() {
        const login = await AsyncStorage.getItem('login');
        if (login) {
            await this.props.dispatch(loginUser(login));
        }
    }

    handleInput = (name, value) => {
        this.setState({login: {...this.state.login, [name]: value}})
    };

    handleLogin = async () => {
        let login = this.state.login;
        let validation = async () => {
            if (login.email.trim() === '' && login.password.trim() !== '') {
                this.setState(() => ({
                    nameErrorEmail: msg.enterEmail,
                    nameErrorPassword: null
                }));
            } else if (login.password.trim() === '' && login.email.trim() !== '') {
                this.setState(() => ({
                    nameErrorPassword: msg.enterPassword,
                    nameErrorEmail: null
                }));
            } else if (login.password.trim() === '' && login.email.trim() === '') {
                this.setState(() => ({
                    nameErrorEmail: msg.enterEmail,
                    nameErrorPassword: msg.enterPassword
                }));
            } else if (login.password.trim() !== '' && login.email.trim() !== '') {
                this.setState(() => ({
                    nameErrorPassword: null,
                    nameErrorEmail: null
                }));
                await this.props.dispatch(loginUser(login));
            }
        };
        await validation();
    };

    componentWillReceiveProps(nextProps) {

        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 10) {
                Alert.alert(
                    msg.loginMessage,
                    msg.incorrectUsernameOrPassword,
                    [
                        {
                            text: 'OK', onPress: () => {
                                AsyncStorage.setItem('login', this.state.login);
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
        }
        if (nextProps.token && this.props.token !== null) {
            this.setState({
                login: {
                    email: '',
                    password: '',
                },
            });
            this.props.navigation.navigate('Home')
        }
    }

    render() {
        const {login} = this.state;
        return (
            <ScrollView>
                <Input
                    placeholder={msg.email}
                    value={login.email}
                    keyboardType='email-address'
                    leftIcon={{type: 'font-awesome', name: 'user'}}
                    onChangeText={(value) => this.handleInput('email', value)}
                />
                {!!this.state.nameErrorEmail && (
                    <Text style={styles.textError}>{this.state.nameErrorEmail}</Text>
                )}
                <Input
                    placeholder={msg.password}
                    secureTextEntry={true}
                    value={login.password}
                    leftIcon={{type: 'font-awesome', name: 'lock'}}
                    onChangeText={(value) => this.handleInput('password', value)}
                />
                {!!this.state.nameErrorPassword && (
                    <Text style={styles.textError}>{this.state.nameErrorPassword}</Text>
                )}
                <Button
                    icon={
                        <Icon
                            name='blind'
                            size={15}
                            color='#268cdc'
                        />
                    }
                    title={msg.login}
                    type='outline'
                    containerStyle={styles.button}
                    onPress={() => this.handleLogin()}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 3}}>
                    <Button
                        icon={
                            <Icon
                                name='blind'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        title={msg.registration}
                        type='outline'
                        containerStyle={styles.button}
                        onPress={() => this.props.navigation.navigate('Register')}
                    />
                    <Button
                        icon={
                            <Icon
                                name='arrow-right'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        title=' Guest'
                        type='outline'
                        containerStyle={styles.button}
                        onPress={() => this.props.navigation.navigate('Home')}
                    />
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                    <View style={styles.forgotPass}>
                        <Text>
                            FORGOT PASSWORD
                        </Text>
                        <Icon
                            name='question'
                            size={25}
                            color='#268cdc'
                        />
                    </View>
                </TouchableOpacity>

                <GoogleAuth/>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    /* container: {
         flex: 1,
         backgroundColor: '#FFF',
         marginBottom: 15
     }
     */
    textError: {
        color: 'red',
        marginLeft: 25
    },
    button: {width: 'auto', backgroundColor: '#e5e9ea', margin: 20},
    forgotPass: {flex: 1, flexDirection: 'row', margin: 25}

});

export const Auth = (connect((state) => ({
    success: state.auth.success,
    token: state.auth.token,
    user: state.auth.user,
    message: state.auth.message
}))(AuthScreenComponent));
