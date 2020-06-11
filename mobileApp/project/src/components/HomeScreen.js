import React, {Component} from 'react';
import {connect} from 'react-redux'
import {View, FlatList, StyleSheet} from 'react-native';
import {ListItem, Button} from 'react-native-elements/src/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getAllItem, cancelFilterItems} from '../redux-saga/actions/item'
import {Text} from 'react-native-elements';
// import InputAutoSuggest from 'react-native-autocomplete-search/src/InputAutoSuggest';

const config = require('../../config').APPCONST;
const msg = require('../i18n/en').msg;

class HomeScreenComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            visibleFilterDel: false
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus)
        ]
    }

    componentWillFocus = () => {
        this.props.dispatch(getAllItem())
    };

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove())
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.allItems !== nextProps.allItems) {
            this.setState({data: nextProps.allItems});
            if (this.props.filterItems && this.props.filterItems.length > 0) {
                this.setState({data: nextProps.filterItems, visibleFilterDel: true})
            }
        }
        if (this.props.filterItems !== nextProps.filterItems) {
            if (this.props.filterItems && nextProps.filterItems.length === 0) {
                this.setState({data: this.props.allItems, visibleFilterDel: false});
            }
        }
    }

    keyExtractor = (item) => item._id;

    renderItem = ({item}) => (
        <ListItem
            title={item.title}
            subtitle={`${msg.price}: ${item.price} ${msg.uah}`}
            leftAvatar={{
                rounded: false, source: {uri: `${config.imageURL}${item._id}?date=${new Date()}`},
                imageProps: {resizeMode: 'contain'}, overlayContainerStyle: {backgroundColor: 'white'}
            }}
            onPress={() => this.props.navigation.navigate('Details',
                Object.assign({}, item, {otherParam: item.title}))}
            style={{borderWidth: 1}}
            key={item._id}
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
        this.props.dispatch(getAllItem())
    };

    cancelFilterItems = () => {
        this.props.dispatch(cancelFilterItems())
    };

    render() {
        const {data} = this.state;
        const {allItems} = this.props;
        const minValueOfPrice = Math.min(...allItems.map(o => o.price));
        const maxValueOfPrice = Math.max(...allItems.map(o => o.price), 0);

        return (
            <View>
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
                        type='clear'
                        iconRight
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
                        type='clear'
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
                        type='clear'
                        iconLeft
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
                        type='clear'
                        onPress={() => this.titleSortDown()}
                    />
                    {this.state.visibleFilterDel ? <Button
                        icon={
                            <Icon
                                name='window-close'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        iconRight
                        title=' '
                        type='clear'
                        onPress={() => this.cancelFilterItems()}
                    /> : <Button
                        icon={
                            <Icon
                                name='filter'
                                size={15}
                                color='#268cdc'
                            />
                        }
                        iconRight
                        title=' '
                        type='clear'
                        onPress={() => this.props.navigation.navigate('Filter',
                            {minPrice: minValueOfPrice, maxPrice: maxValueOfPrice})}
                    />}

                </View>

                 {/*<InputAutoSuggest
                    style={{ flex: 1 }}
                    staticData={this.state.data}
                    itemFormat={{id: '_id', name: 'title'}}
                    flatListStyle={{height: 75}}
                    itemTextStyle={{fontSize: 12}}
                    onDataSelectedChange={data => console.log(data)}
                />*/}

                <Text>Products: {data.length}</Text>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={data}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonGroup: {flexDirection: 'row', justifyContent: 'space-around', margin: 3},
});

export const
    HomeScreen = (connect((state) => ({
        allItems: state.item.allItems,
        filterItems: state.item.filterItems,
        token: state.auth.token,
        user: state.auth.user
    }))(HomeScreenComponent));