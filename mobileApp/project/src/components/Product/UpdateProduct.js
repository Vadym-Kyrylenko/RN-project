import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {Button, Image, Input} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {updateItem} from '../../redux-saga/actions/item';
import {connect} from 'react-redux';

const config = require('../../../config').APPCONST;
const msg = require('../../i18n/en').msg;

const options = {
    title: msg.selectImage
};

class UpdateProductScreenComponent extends Component {
    state = {
        product: {},
        message: '',
    };

    componentDidMount() {
        const product = this.props.navigation.state.params;
        this.setState({product})
    }

    handleImg = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            const image = {uri: response.uri, imageBase64: response.data};
            this.setState({product: {...this.state.product, ['img']: image}});
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log('1')
            }
        });
    };

    handleInput = (name, value) => {
        this.setState({product: {...this.state.product, [name]: value}})
    };

    handleSubmit = () => {
        let product = this.state.product;

        this.props.dispatch(updateItem(product))
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 9) {
                Alert.alert(
                    msg.productMessage,
                    msg.productEdited,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Details',
                                    Object.assign({}, this.props.updateProduct, {otherParam: this.props.updateProduct.title}))
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
        }
    }

    render() {
        const {product} = this.state;
        const {_id, title, price, article, description} = product;
        return (
            <ScrollView>
                <View style={styles.imageView}>
                    <TouchableOpacity onPress={this.handleImg}>
                        <Image
                            style={styles.image}
                            source={{uri: product.img ? product.img.uri : `${config.imageURL}${_id}?date=${new Date()}`}}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                </View>

                <Text>Title</Text>
                <Input
                    placeholder={msg.title}
                    value={title}
                    onChangeText={(value) => this.handleInput('title', value)}
                    returnKeyType='next'
                    selectTextOnFocus
                />

                <Text>Price</Text>
                <Input
                    placeholder={msg.price}
                    keyboardType='numeric'
                    value={`${price}`}
                    selectTextOnFocus
                    onChangeText={(value) => this.handleInput('price', value)}
                    returnKeyType='next'
                />

                <Text>Article</Text>
                <Input
                    placeholder={msg.article}
                    value={article}
                    onChangeText={(value) => this.handleInput('article', value)}
                    returnKeyType='next'
                    selectTextOnFocus
                />

                <Text>Description</Text>
                <Input
                    placeholder={msg.description}
                    value={description}
                    onChangeText={(value) => this.handleInput('description', value)}
                    returnKeyType='done'
                    multiline={true}
                    numberOfLines={3}
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
    image: {width: 200, height: 200}
});

export const UpdateProduct = (connect((state) => ({
    updateProduct: state.item.updateProduct,
    success: state.auth.success
}))(UpdateProductScreenComponent));
