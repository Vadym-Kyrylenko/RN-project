import React, {Component} from 'react';
import {connect} from 'react-redux'
import {View, ScrollView, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {ListItem, Button} from 'react-native-elements/src/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUsers} from '../../redux-saga/actions/auth'
import {Text} from 'react-native-elements';

const config = require('../../../config').APPCONST;

class UsersListScreenComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus)
        ]
    }

    componentWillFocus = () => {
        this.props.dispatch(getUsers())
    };

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove())
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.usersList !== nextProps.usersList) {
            this.setState({data: nextProps.usersList})
        }
    }

    keyExtractor = (item) => item._id;

    renderItem = ({item}) => (
        <ListItem
            title={`${item.firstName} ${item.lastName}`}
            subtitle={item.role}
            leftAvatar={{
                rounded: true, source: {uri: `${config.avatarURL}${item._id}?date=${new Date()}`},
                imageProps: {resizeMode: 'contain'}, overlayContainerStyle: {backgroundColor: 'white'}
            }}
            onPress={() => this.props.navigation.navigate('UpdateUserForAdmin', Object.assign({}, item,
                {otherParam: `${item.firstName} ${item.lastName}`}))}
            style={styles.listItem}
            key={item._id}
        />
    );

    titleSortUp = () => {
        let arr = this.state.data;
        const data = arr.sort((a, b) => {
            const titleA = a.lastName.toLowerCase(), titleB = b.lastName.toLowerCase();
            if (titleA < titleB)
                return -1;
            if (titleA > titleB)
                return 1;
            return 0
        });
        this.setState({data})
    };

    titleSortDown = () => {
        let arr = this.state.data;
        const data = arr.sort((a, b) => {
            const titleA = a.lastName.toLowerCase(), titleB = b.lastName.toLowerCase();
            if (titleA > titleB)
                return -1;
            if (titleA < titleB)
                return 1;
            return 0
        });
        this.setState({data})
    };

    onRefresh = () => {
        this.props.dispatch(getUsers())
    };

    render() {
        const {data} = this.state;

        return (
            <ScrollView style={styles.container}>
                <View style={styles.buttonGroup}>

                    <Button
                        icon={
                            <Icon
                                name='sort-alpha-asc'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        title=' '
                        type='outline'
                        iconLeft
                        containerStyle={styles.button}
                        onPress={() => this.titleSortUp()}
                    />
                    <Button
                        icon={
                            <Icon
                                name='sort-alpha-desc'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        iconLeft
                        title=' '
                        type='outline'
                        containerStyle={styles.button}
                        onPress={() => this.titleSortDown()}
                    />
                </View>
                <Text>Users: {data && data.length}</Text>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={data}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {paddingBottom: 35},
    listItem: {borderWidth: 1},
    buttonGroup: {flexDirection: 'row', justifyContent: 'space-around', margin: 3},
    button: {width: 'auto', backgroundColor: '#e5e9ea'}
});

export const
    UsersList = (connect((state) => ({
        usersList: state.auth.usersList
    }))(UsersListScreenComponent));