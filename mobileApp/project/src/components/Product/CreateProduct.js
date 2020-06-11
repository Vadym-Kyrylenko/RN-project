import React, {Component} from 'react';
import {ScrollView, Text, View, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {Input, Button, Image} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {createItem} from '../../redux-saga/actions/item';
import {connect} from 'react-redux';
import {Picker} from 'native-base';

const msg = require('../../i18n/en').msg;

const options = {
    title: msg.selectImage
};

class CreateProductScreenComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: {
                title: '',
                price: 0,
                article: '',
                description: '',
                category: '',
                img: {uri: '', imageBase64: ''}
            },
            titleError: null,
            priceError: null,
            articleError: null,
            descriptionError: null
        };
    }

    handleInput = (name, value) => {
        this.setState({product: {...this.state.product, [name]: value}})
    };

    handleOnChange = (name, value) => {
        this.setState({product: {...this.state.product, [name]: value}})
    };

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

    handleSubmit = async () => {
        let product = this.state.product;

        let validation = async () => {
            if (product.title.trim() === '' && product.price !== 0 && product.article.trim() !== '') {
                this.setState(() => ({titleError: msg.enterTitle, priceError: null, articleError: null}));

            } else if (product.price === 0 && product.title.trim() !== '' && product.article.trim() !== '') {
                this.setState(() => ({priceError: msg.enterPrice, titleError: null, articleError: null}));

            } else if (product.article.trim() === '' && product.title.trim() !== '' && product.price !== 0) {
                this.setState(() => ({articleError: msg.enterArticle, priceError: null, titleError: null}));

            } else if (product.article.trim() === '' && product.title.trim() === '' && product.price !== 0) {
                this.setState(() => ({articleError: msg.enterArticle, titleError: msg.enterTitle, priceError: null}));

            } else if (product.title.trim() !== '' && product.article.trim() === '' && product.price === 0) {
                this.setState(() => ({articleError: msg.enterArticle, priceError: msg.enterPrice, titleError: null}));

            } else if (product.article.trim() === '' && product.title.trim() === '' && product.price === 0) {
                this.setState(() => ({
                    articleError: msg.enterArticle,
                    priceError: msg.enterPrice,
                    titleError: msg.enterTitle
                }));

            } else if (product.title.trim() !== '' && product.price !== 0 && product.article.trim() !== '') {
                this.setState(() => ({titleError: null, priceError: null, articleError: null}));
                this.props.dispatch(createItem(product))

            }
        };
        await validation();
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 6) {
                Alert.alert(
                    msg.productMessage,
                    msg.productSaved,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({
                                    product: {
                                        title: '',
                                        price: 0,
                                        article: '',
                                        description: '',
                                        category: '',
                                        img: {uri: '', imageBase64: ''}
                                    }
                                });
                                this.props.navigation.navigate('Details',
                                    Object.assign({}, this.props.product, {otherParam: this.props.product.title}))
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
        return (

            <ScrollView style={styles.container}>
                <Text style={styles.title}>Create Product Component</Text>
                <View style={styles.imageView}>
                    <TouchableOpacity onPress={this.handleImg} style={styles.touchImage}>
                        <Image
                            style={styles.image}
                            source={{uri: product.img.uri ? product.img.uri : null}}
                        />
                    </TouchableOpacity>
                </View>

                <Text>Title</Text>
                <Input
                    placeholder={msg.title}
                    value={product.title}
                    onChangeText={(value) => this.handleInput('title', value)}
                    returnKeyType='next'
                />
                {!!this.state.titleError && (
                    <Text style={styles.textError}>{this.state.titleError}</Text>
                )}

                <Text>Price</Text>
                <Input
                    placeholder={msg.price}
                    keyboardType='numeric'
                    value={`${product.price}`}
                    selectTextOnFocus
                    onChangeText={(value) => this.handleInput('price', value)}
                    returnKeyType='next'
                />
                {!!this.state.priceError && (
                    <Text style={styles.textError}>{this.state.priceError}</Text>
                )}

                <Text>Article</Text>
                <Input
                    placeholder={msg.article}
                    value={product.article}
                    onChangeText={(value) => this.handleInput('article', value)}
                    returnKeyType='next'
                />
                {!!this.state.articleError && (
                    <Text style={styles.textError}>{this.state.articleError}</Text>
                )}

                <Picker
                    placeholder={msg.category}
                    selectedValue={product.category}
                    onValueChange={(value) => this.handleOnChange('category', value)}
                >
                    <Picker.Item label={msg.pleaseChooseCategory} value=''/>
                    <Picker.Item label={msg.baby} value='baby'/>
                    <Picker.Item label={msg.cityCategory}value='city'/>
                    <Picker.Item label={msg.gravel} value='gravel'/>
                    <Picker.Item label={msg.mountain} value='mountain'/>
                    <Picker.Item label={msg.runbike} value='runbike'/>
                    <Picker.Item label={msg.road} value='road'/>
                    <Picker.Item label={msg.bmx} value='bmx'/>
                    <Picker.Item label={msg.scooter} value='scooter'/>
                </Picker>

                <Text>Description</Text>
                <Input
                    placeholder={msg.description}
                    value={product.description}
                    onChangeText={(value) => this.handleInput('description', value)}
                    returnKeyType='done'
                    multiline={true}
                    numberOfLines={3}
                />

                <Button
                    containerStyle={styles.button}
                    title={msg.createProduct}
                    onPress={() => this.handleSubmit()}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, marginBottom: 25},
    image: {width: 200, height: 200, backgroundColor: '#EDEDED'},
    title: {textAlign: 'center', margin: 10},
    imageView: {justifyContent: 'center', alignItems: 'center'},
    touchImage: {borderColor: 'black', borderWidth: 1},
    button:{marginTop: 10},
    textError: {
        color: 'red',
        marginLeft: 25
    }
});

export const CreateProduct = (connect((state) => ({
    product: state.item.product,
    success: state.auth.success
}))(CreateProductScreenComponent));
