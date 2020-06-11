import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView, Alert} from 'react-native';
import {Button, CheckBox, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from '../CustomMarker';
import {getItemsWithParams} from '../../redux-saga/actions/item';
import {connect} from 'react-redux';

const msg = require('../../i18n/en').msg;

class FilterScreenComponent extends Component {
    static navigationOptions = {
        title: msg.filter,
    };

    constructor(props) {
        super(props);
        const min = this.props.navigation.state.params.minPrice;
        const max = this.props.navigation.state.params.maxPrice;
        this.state = {
            data: [],
            search: '',
            multiSliderValue: [min, max],
            category: {
                baby: false,
                city: false,
                gravel: false,
                mountain: false,
                runbike: false,
                road: false,
                scooter: false,
                bmx: false,
            },
            categorySend: []
        }
    }

    categoryHandler = async () => {
        const arr = [];
        const {category} = this.state;
        await Object.keys(category).forEach(function (key) {
            if (this[key]) {
                arr.push(key)
            }
        }, category);
        await this.setState({categorySend: arr})
    };

    updateSearch = search => {
        this.setState({search});
    };

    multiSliderValuesChange = values => {
        this.setState({
            multiSliderValue: values,
        });
    };

    handlerSubmit = async () => {
        await this.categoryHandler();
        const params = `?searchText=${this.state.search}&minPrice=${this.state.multiSliderValue[0]}&maxPrice=${this.state.multiSliderValue[1]}&category=${this.state.categorySend}`
        await this.props.dispatch(getItemsWithParams(params))
    };

    async componentWillReceiveProps(nextProps) {
        if (this.props.filterItems !== nextProps.filterItems) {
            if (nextProps.filterItems.length === 0 && this.state.data.length === 0) {
                Alert.alert(
                    msg.filterMessage,
                    msg.nothingFound,
                    [
                        {
                            text: 'OK', onPress: () => {
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
            await this.setState({data: nextProps.filterItems});
            if (this.state.data.length > 0) {
                await this.props.navigation.navigate('Home')
            }
        }
    }

    render() {
        const {baby, city, gravel, mountain, runbike, road, scooter, bmx} = this.state.category;
        const minValue = this.props.navigation.state.params.minPrice;
        const maxValue = this.props.navigation.state.params.maxPrice;
        const {search} = this.state;
        return (
            <ScrollView>
                <Text style={styles.title}>Filters</Text>
                <Text style={{textAlign: 'center', fontSize: 22, marginTop: 15}}>Price range</Text>
                <View style={styles.container2}>
                    <View style={styles.sliderOne}>
                        <Text style={styles.text}>{this.state.multiSliderValue[0]} </Text>
                        <MultiSlider
                            values={[
                                this.state.multiSliderValue[0],
                                this.state.multiSliderValue[1]
                            ]}
                            sliderLength={200}
                            onValuesChange={this.multiSliderValuesChange}
                            min={minValue}
                            max={maxValue + 2500}
                            step={1}
                            allowOverlap
                            snapped
                            customMarker={CustomMarker}

                        />
                        <Text style={styles.text}>{this.state.multiSliderValue[1]}</Text>
                    </View>
                </View>

                <View style={styles.checkBoxView}>
                    <CheckBox
                        title={msg.baby}
                        checked={baby}
                        onPress={() => this.setState({category: {...this.state.category, baby: !baby}})}
                        containerStyle={styles.checkBox}
                    />
                    <CheckBox
                        title={msg.city}
                        checked={city}
                        onPress={() => this.setState({category: {...this.state.category, city: !city}})}
                        containerStyle={styles.checkBox}
                    />
                    <CheckBox
                        title={msg.gravel}
                        checked={gravel}
                        onPress={() => this.setState({category: {...this.state.category, gravel: !gravel}})}
                        containerStyle={styles.checkBox}
                    />
                    <CheckBox
                        title={msg.mountain}
                        checked={mountain}
                        onPress={() => this.setState({category: {...this.state.category, mountain: !mountain}})}
                        containerStyle={styles.checkBox}
                    />
                    <CheckBox
                        title={msg.runbike}
                        checked={runbike}
                        onPress={() => this.setState({category: {...this.state.category, runbike: !runbike}})}
                        containerStyle={styles.checkBox}
                    />
                    <CheckBox
                        title={msg.road}
                        checked={road}
                        onPress={() => this.setState({category: {...this.state.category, road: !road}})}
                        containerStyle={styles.checkBox}
                    />
                    <CheckBox
                        title={msg.scooter}
                        checked={scooter}
                        onPress={() => this.setState({category: {...this.state.category, scooter: !scooter}})}
                        containerStyle={styles.checkBox}
                    />
                    <CheckBox
                        title={msg.bmx}
                        checked={bmx}
                        onPress={() => this.setState({category: {...this.state.category, bmx: !bmx}})}
                        containerStyle={styles.checkBox}
                    />
                </View>

                <SearchBar
                    placeholder={msg.search}
                    onChangeText={this.updateSearch}
                    value={search}
                    lightTheme={true}
                />

                <Text>{'\n'}</Text>

                <View style={styles.buttonView}>
                    <Button
                        icon={
                            <Icon
                                name='sort'
                                size={15}
                                color='#42dcf7'
                            />
                        }
                        title={msg.show}
                        type='outline'
                        iconRight
                        containerStyle={styles.button}
                        onPress={() => this.handlerSubmit()}
                    />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 30,
    },
    container2: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderOne: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        alignSelf: 'center',
        paddingVertical: 20,
        margin: 10
    },
    checkBoxView: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'},
    checkBox: {flexBasis: '40%'},
    button: {width: 200, backgroundColor: '#e5e9ea'},
    buttonView: {flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25},
});

export const Filter = (connect((state) => ({
    filterItems: state.item.filterItems
}))(FilterScreenComponent));