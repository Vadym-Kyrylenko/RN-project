import React, {Component} from 'react';
import {View} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux-saga/store';
import {Routes} from './src/components/Routes/Routes';


export default class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <View style={{flex: 1}}>
                    <Routes/>
                </View>
            </Provider>
        )
    }

}
