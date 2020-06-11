import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Button, Image} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUser} from '../../redux-saga/actions/auth';
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';

const config = require('../../../config').APPCONST;
const msg = require('../../i18n/en').msg;

class UserProfileScreenComponent extends Component {

    state = {
        user: {},
        message: ''
    };

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus)
        ]
    }

    componentWillFocus = () => {
        const id = this.props.user._id;
        this.props.dispatch(getUser(id))
    };

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove())
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user !== nextProps.user) {
            this.setState({user: nextProps.user})
        }
    }

    render() {
        const {user} = this.state;
        const {_id, firstName, lastName, email, city, role} = user;
        return (
            <Swiper>
                <ScrollView>
                    <View style={styles.buttonGroup}>
                        <Button
                            icon={
                                <Icon
                                    name='user'
                                    size={15}
                                    color='#42dcf7'
                                />
                            }
                            title={msg.edit}
                            type='outline'
                            containerStyle={styles.button}
                            onPress={() => this.props.navigation.navigate('UpdateUser', (user))}
                        />

                        <Button
                            icon={
                                <Icon
                                    name='key'
                                    size={15}
                                    color='#42dcf7'
                                />
                            }
                            title={msg.changePassword}
                            type='outline'
                            containerStyle={styles.button}
                            onPress={() => this.props.navigation.navigate('ChangePassword', (user))}
                        />
                    </View>
                    <View style={styles.imageView}>
                        <Image
                            source={{uri: `${config.avatarURL}${_id}?date=${new Date()}`}}
                            style={styles.image}
                            resizeMode={'contain'}
                            key={new Date()}
                        />
                    </View>
                    <Text style={{padding: 15}}>
                        <Text style={styles.text}>First name:</Text> {firstName}{'\n'}
                        <Text style={styles.text}>Last name:</Text> {lastName}{'\n'}
                        <Text style={styles.text}>E-mail:</Text> {email}{'\n'}
                        <Text style={styles.text}>City:</Text> {city}{'\n'}
                        <Text style={styles.text}>Role:</Text> {role}{'\n'}
                    </Text>
                </ScrollView>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    buttonGroup: {flexDirection: 'row', justifyContent: 'space-around', margin: 3},
    text: {fontWeight: 'bold'},
    image: {width: 250, height: 250, borderColor: 'black', borderWidth: 1},
    imageView: {justifyContent: 'center', alignItems: 'center'},
    button: {width: 'auto', backgroundColor: '#e5e9ea'},
});

export const UserProfile = (connect((state) => ({
    user: state.auth.user
}))(UserProfileScreenComponent));
