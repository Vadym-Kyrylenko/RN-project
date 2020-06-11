import React, {Component} from 'react';
import {createAppContainer, createStackNavigator, createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import {HomeScreen} from '../HomeScreen';
import {DetailsScreen} from '../Product/DetailsScreen';
import {CreateProduct} from '../Product/CreateProduct';
import {UpdateProduct} from '../Product/UpdateProduct';
import {Filter} from '../Product/Filter';
import {Auth} from '../Auth/Auth';
import {Register} from '../Auth/Register';
import {UserProfile} from '../User/UserProfile';
import {UpdateUser} from '../User/UpdateUser';
import {SideMenu} from '../SideMenu';
import {Basket} from '../User/Basket';
import HeaderBurgerMenu from '../headerBurgerMenu';
import {UsersList} from '../User/UsersList';
import {ChangePassword} from '../User/ChangePassword';
import {UpdateUserForAdmin} from '../Admin/UpdateUserForAdmin';
import {ChatScreen} from '../Chat/Chat';
import {ForgotPassword} from '../Auth/ForgotPassword';

const Draw = createDrawerNavigator({
        Home: {screen: HomeScreen},
        Profile: {screen: UserProfile},
        Basket: {screen: Basket},
        AddProduct: {screen: CreateProduct},
        UpdateUser: {screen: UpdateUser},
        UsersList: {screen: UsersList},
        ChangePassword: {screen: ChangePassword},
        UpdateUserForAdmin: {screen: UpdateUserForAdmin},
        Chat: {screen: ChatScreen},
    },
    {
        contentComponent: SideMenu,
        drawerWidth: 200,
        drawerPosition: 'right',
        navigationOptions: {
            headerRight: (
                <HeaderBurgerMenu/>
            ),
        }
    });


const Stack = createStackNavigator(
    {
        Draw: {screen: Draw},
        Details: {screen: DetailsScreen},
        UpdateProduct: {screen: UpdateProduct},
        Filter: {screen: Filter},
    },
    {
        initialRouteName: 'Draw',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#42dcf7',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

const Authentication = createStackNavigator(
    {
        Login: {screen: Auth},
        Register: {screen: Register},
        ForgotPassword: {screen: ForgotPassword}
    },
    {
        initialRouteName: 'Login',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#42dcf7',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

const Switch = createSwitchNavigator({
    AuthScreen: {screen: Authentication},
    Main: {screen: Stack}
});

export const Routes = createAppContainer(Switch);
