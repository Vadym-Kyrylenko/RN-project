import React, {Component} from 'react';
import {connect} from 'react-redux'
import {View, ScrollView, FlatList, StyleSheet} from 'react-native';
import {ListItem, Button} from 'react-native-elements/src/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getBasketProducts} from '../../redux-saga/actions/item'
import {Text} from 'react-native-elements';

const config = require('../../../config').APPCONST;
const msg = require('../../i18n/en').msg;

class BasketScreenComponent extends Component {

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
        const arrProductsId = this.props.user.basket;
        if (arrProductsId.length > 0) this.props.dispatch(getBasketProducts(arrProductsId))
    };

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove())
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.basketProducts !== nextProps.basketProducts) {
            this.setState({data: nextProps.basketProducts})
        }
    }

    keyExtractor = (item) => item._id;

    renderItem = ({item}) => (
        <ListItem
            title={item.title}
            subtitle={item.category}
            leftAvatar={{
                rounded: false, source: {uri: `${config.imageURL}${item._id}?date=${new Date()}`},
                imageProps: {resizeMode: 'contain'}, overlayContainerStyle: {backgroundColor: 'white'}
            }}
            onPress={() => this.props.navigation.navigate('Details', Object.assign({}, item, {otherParam: item.title}))}
            style={{borderWidth: 1}}
            key={item._id}
            rightSubtitle={` ${item.price} ${msg.uah}`}
        />
    );

    priceSortUp = () => {
        let arr = this.state.data;
        const data = arr.sort((a, b) => a.price - b.price);
        this.setState({data})
    };

    priceSortDown = () => {
        let arr = this.state.data;
        const data = arr.sort((a, b) => b.price - a.price);
        this.setState({data})
    };

    titleSortUp = () => {
        let arr = this.state.data;
        const data = arr.sort((a, b) => {
            const titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
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
            const titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
            if (titleA > titleB)
                return -1;
            if (titleA < titleB)
                return 1;
            return 0
        });
        this.setState({data})
    };

    onRefresh = () => {
        const arrProductsId = this.props.user.basket;
        if (arrProductsId.length > 0) this.props.dispatch(getBasketProducts(arrProductsId))
    };

    render() {
        const {data} = this.state;

        return (
            <ScrollView style={styles.container}>
                <View style={styles.buttonGroup}>
                    <Button
                        icon={
                            <Icon
                                name='sort-numeric-asc'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        title='$ '
                        type='outline'
                        iconRight
                        containerStyle={styles.button}
                        onPress={() => this.priceSortUp()}
                    />
                    <Button
                        icon={
                            <Icon
                                name='sort-numeric-desc'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        iconRight
                        title='$ '
                        type='outline'
                        containerStyle={styles.button}
                        onPress={() => this.priceSortDown()}
                    />
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
                <Text>Products: {data && data.length}</Text>
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
    buttonGroup: {flexDirection: 'row', justifyContent: 'space-around', margin: 3},
    button: {width: 'auto', backgroundColor: '#e5e9ea'},
});

export const
    Basket = (connect((state) => ({
        basketProducts: state.item.basketProducts,
        token: state.auth.token,
        user: state.auth.user
    }))(BasketScreenComponent));
