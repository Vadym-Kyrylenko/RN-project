import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {Button, Image, Input} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {updateUser} from '../../redux-saga/actions/auth';
import {connect} from 'react-redux';

const config = require('../../../config').APPCONST;
const msg = require('../../i18n/en').msg;

const options = {
    title: msg.selectAvatar
};

class UpdateUserScreenComponent extends Component {
    state = {
        user: {},
        firstNameError: null,
        lastNameError: null
    };

    componentDidMount() {
        const user = this.props.navigation.state.params;
        this.setState({user})
    }

    handleImg = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            const avatar = {uri: response.uri, imageBase64: response.data};
            this.setState({user: {...this.state.user, ['avatar']: avatar}});
            if (response.didCancel) {
                console.log('User cancelled avatar picker');
            } else if (response.error) {
                console.log('AvatarPicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log('1')
            }
        });
    };

    handleInput = (name, value) => {
        this.setState({user: {...this.state.user, [name]: value}})
    };

    handleSubmit = async () => {
        let user = this.state.user;

        let validation = async () => {
            if (user.firstName.trim() === '' && user.lastName.trim() !== '') {
                this.setState(() => ({
                    firstNameError: msg.enterFirstName,
                    lastNameError: null
                }));
            } else if (user.lastName.trim() === '' && user.firstName.trim() !== '') {
                this.setState(() => ({
                    lastNameError: msg.enterLastName,
                    firstNameError: null
                }));
            } else if (user.lastName.trim() === '' && user.firstName.trim() === '') {
                this.setState(() => ({
                    firstNameError: msg.enterFirstName,
                    lastNameError: msg.enterLastName
                }));
            } else if (user.lastName.trim() !== '' && user.firstName.trim() !== '') {
                this.setState(() => ({
                    firstNameError: null,
                    lastNameError: null
                }));
                await this.props.dispatch(updateUser(user));
            }
        };
        await validation();
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 3) {
                Alert.alert(
                    msg.userMessage,
                    msg.userEdited,
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
        }
    }

    render() {
        const {user} = this.state;
        const {_id, firstName, lastName, city} = user;
        return (
            <ScrollView>
                <View style={styles.imageView}>
                    <TouchableOpacity onPress={this.handleImg}>
                        <Image
                            style={styles.image}
                            source={{uri: user.avatar ? user.avatar.uri : `${config.avatarURL}${_id}?date=${new Date()}`}}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                </View>

                <Text>First name</Text>
                <Input
                    placeholder={msg.firstName}
                    value={firstName}
                    onChangeText={(value) => this.handleInput('firstName', value)}
                    returnKeyType='next'
                    selectTextOnFocus
                />
                {!!this.state.firstNameError && (
                    <Text style={styles.textError}>{this.state.firstNameError}</Text>
                )}

                <Text>Last name</Text>
                <Input
                    placeholder={msg.lastName}
                    value={lastName}
                    onChangeText={(value) => this.handleInput('lastName', value)}
                    returnKeyType='next'
                    selectTextOnFocus
                />
                {!!this.state.lastNameError && (
                    <Text style={styles.textError}>{this.state.lastNameError}</Text>
                )}

                <Text>City</Text>
                <Input
                    placeholder={msg.city}
                    value={city}
                    onChangeText={(value) => this.handleInput('city', value)}
                    returnKeyType='done'
                    selectTextOnFocus
                />

                <Button
                    title={msg.update}
                    onPress={() => this.handleSubmit()}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    imageView: {justifyContent: 'center', alignItems: 'center'},
    textError: {color: 'red', marginLeft: 25},
image: {width: 200, height: 200, borderColor: 'black', borderWidth: 1},

    container: {marginBottom: 25},
    button: {marginTop: 10},
    textTitle: {textAlign: 'center', margin: 10}
});

export const UpdateUser = (connect((state) => ({
    user: state.auth.user,
    success: state.auth.success
}))(UpdateUserScreenComponent));
