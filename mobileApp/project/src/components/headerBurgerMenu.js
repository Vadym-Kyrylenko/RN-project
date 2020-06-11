import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Icon} from 'react-native-elements';


class HeaderBurgerMenu extends Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.toggleDrawer()}>
                <View style={styles.view}>
                    <Icon
                        name='menu'
                        size={25}
                        color='#fff'
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    view: {marginRight: 15, zIndex: 1},
});

export default withNavigation(HeaderBurgerMenu);