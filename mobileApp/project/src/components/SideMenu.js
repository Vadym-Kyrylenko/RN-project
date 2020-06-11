import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {logOutAction} from '../redux-saga/actions/auth';
import Icon from 'react-native-vector-icons/FontAwesome';


class SideMenuComponent extends Component {

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.closeDrawer();
    };

    handleLogout = () => {
        this.props.dispatch(logOutAction());
        this.props.navigation.navigate('Login')
    };

    render() {
        const {user} = this.props;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <TouchableOpacity onPress={this.navigateToScreen('Home')}>
                            <View style={styles.item}>
                                <Text style={styles.itemText}>
                                    Main
                                </Text>
                                <Icon
                                    name='home'
                                    size={25}
                                    color='#268cdc'
                                />
                            </View>
                        </TouchableOpacity>
                        {
                            user.role === 'admin' || user.role === 'user' || user.role === 'userBlocked'?
                                <TouchableOpacity onPress={this.navigateToScreen('Basket')}>
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>
                                            Basket
                                        </Text>
                                        <Icon
                                            name='shopping-basket'
                                            size={25}
                                            color='#268cdc'
                                        />
                                        {user.basket &&
                                        <View style={user.basket.length ? styles.itemPushNumberWrap : null}>
                                            <Text style={styles.itemPushNumberText}>
                                                {user.basket.length ? user.basket.length : null}
                                            </Text>
                                        </View>}
                                    </View>
                                </TouchableOpacity>
                                : null
                        }

                        {
                            user.role === 'admin' || user.role === 'user' || user.role === 'userBlocked' ?
                                <TouchableOpacity onPress={this.navigateToScreen('Profile')}>
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>
                                            Profile
                                        </Text>
                                        <Icon
                                            name='user'
                                            size={25}
                                            color='#268cdc'
                                        />
                                    </View>
                                </TouchableOpacity>
                                : null
                        }

                        {
                            user.role === 'admin' || user.role === 'user' || user.role === 'userBlocked' ?
                                <TouchableOpacity onPress={this.navigateToScreen('Chat')}>
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>
                                            Chat
                                        </Text>
                                        <Icon
                                            name='comments'
                                            size={25}
                                            color='#268cdc'
                                        />
                                    </View>
                                </TouchableOpacity>
                                : null
                        }

                        {
                            user.role === 'admin' ?
                                <View>
                                    <TouchableOpacity onPress={this.navigateToScreen('AddProduct')}>
                                        <View style={styles.item}>
                                            <Text style={styles.itemText}>
                                                Create product
                                            </Text>
                                            <Icon
                                                name='plus'
                                                size={25}
                                                color='#268cdc'
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.navigateToScreen('UsersList')}>
                                        <View style={styles.item}>
                                            <Text style={styles.itemText}>
                                                All users
                                            </Text>
                                            <Icon
                                                name='users'
                                                size={25}
                                                color='#268cdc'
                                            />
                                        </View>
                                    </TouchableOpacity>

                                </View>
                                : null
                        }
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={this.handleLogout}>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>
                            Log out
                        </Text>
                        <Icon
                            name='sign-out'
                            size={25}
                            color='#268cdc'
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    itemsContainer: {},
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    itemPushNumberWrap: {
        alignItems: 'center',
        marginLeft: 'auto',
    },
    itemPushNumberText: {
        alignItems: 'center',
        alignSelf: 'center',
        color: 'black',
    },
    itemText: {
        color: '#268cdc',
        margin: 5
    }
});

export const SideMenu = (connect((state) => ({
    success: state.auth.success,
    error: state.auth.error,
    user: state.auth.user
}))(SideMenuComponent));
