import React, {PureComponent} from 'react';
import {ScrollView, Text, TouchableOpacity, View, RefreshControl, Alert, StyleSheet} from 'react-native';
import {AirbnbRating, Button, Image} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteItem, getOneItem, setRatingProduct} from '../../redux-saga/actions/item';
import {addProductToBasket, delProductFromBasket} from '../../redux-saga/actions/auth';
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';
import Comments from 'react-native-comments'
import {saveComment, getComments, deleteComment} from '../../redux-saga/actions/comments';
import moment from 'moment';

const config = require('../../../config').APPCONST;
const msg = require('../../i18n/en').msg;

class DetailsScreenComponent extends PureComponent {
    static navigationOptions = ({navigation, navigationOptions}) => {
        console.log(navigationOptions);
        return {
            title: navigation.getParam('otherParam', 'A Nested Details Screen'),
            headerStyle: {
                backgroundColor: navigationOptions.headerTintColor,
            },
            headerTintColor: navigationOptions.headerStyle.backgroundColor,
        };
    };

    constructor(props) {
        super(props);
        this.scrollIndex = 0
    }

    state = {
        product: {},
        message: '',

        bool: true,
        defaultRating: 0,

        refreshing: false,
        comments: [],
        loadingComments: true,
        lastCommentUpdate: null,
        review: this.props.review ? this.props.review : null,
        owner: this.props.user.email
    };


    componentDidMount() {
        this.bool();
        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus)
        ]
    }

    componentWillFocus = () => {
        const id = this.props.navigation.state.params._id;
        this.props.dispatch(getOneItem(id));
        this.getComment(id);
    };


    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove())
    }

    componentWillReceiveProps = async (nextProps) => {
        if (this.props.product !== nextProps.product) {
            await this.setState({product: nextProps.product});
            await this.handleDefaultRating()
        }
        if (this.props.comments !== nextProps.comments) {
            await this.setState({comments: nextProps.comments});
        }
        if (this.props.success !== nextProps.success) {
            if (nextProps.success.status === 11) {
                Alert.alert(
                    msg.productMessage,
                    msg.productDeleted,
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Home')
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
            if (nextProps.success.status === 5) {
                Alert.alert(
                    msg.userMessage,
                    msg.userBlocked,
                    [
                        {
                            text: 'OK', onPress: () => {
                                console.log('ok')
                            }
                        },
                    ],
                    {cancelable: false},
                );
            }
        }
    };

    handleDelete = (product) => {
        this.props.dispatch(deleteItem(product));
    };

    ratingHandler = (star) => {
        const rating = {
            userId: this.props.user._id,
            star
        };
        const data = {
            productId: this.state.product._id,
            rating
        };
        this.props.dispatch(setRatingProduct(data))
    };

    bool = () => {
        let role = this.props.user.role;
        if (role) {
            this.setState({bool: false})
        } else {
            this.setState({bool: true})
        }
    };

    calcAvgRating = () => {
        let sumStar = this.state.product.rating && this.state.product.rating.reduce((sum, current) => {
            return sum + current.star;
        }, 0);
        let arrLenght = this.state.product.rating && this.state.product.rating.length;
        let avg = sumStar / arrLenght;
        if (isNaN(avg)) {
            return msg.noRating
        } else {
            return (Math.round(avg * 100) / 100)
        }
    };

    handleDefaultRating = () => {
        this.state.product.rating && this.state.product.rating.map(item => {
            if (item.userId === this.props.user._id) {
                this.setState({defaultRating: item.star})
            }
        });
    };

    addToBasket = () => {
        const data = {
            userId: this.props.user._id,
            productId: this.state.product._id
        };
        this.props.dispatch(addProductToBasket(data))
    };

    delFromBasket = () => {
        const data = {
            userId: this.props.user._id,
            productId: this.state.product._id
        };
        this.props.dispatch(delProductFromBasket(data))
    };

    onRefresh = async () => {
        this.setState({refreshing: true});
        const id = this.props.navigation.state.params._id;
        await this.props.dispatch(getOneItem(id));
        const c = await this.props.dispatch(getComments(id));
        await this.setState({
            refreshing: false,
            comments: c,
            loadingComments: false,
            lastCommentUpdate: new Date().getTime()
        });
    };

    //COMMENTS
    getComment(id) {
        const c = this.props.dispatch(getComments(id));
        this.setState({
            comments: c,
            loadingComments: false,
            lastCommentUpdate: new Date().getTime()
        });
    }

    extractUsername(c) {
        try {
            return c.email && c.email !== '' ? c.email : null
        } catch (e) {
            console.log(e)
        }
    }

    extractBody(c) {
        try {
            return c.comment && c.comment !== '' ? c.comment : null
        } catch (e) {
            console.log(e)
        }
    }

    extractImage(c) {
        try {
            return c.userId && c.userId !== '' ? `${config.avatarURL}${c.userId}?date=${new Date()}` : null
        } catch (e) {
            console.log(e)
        }
    }

    extractChildrenCount(c) {
        try {
            return c.childrenCount || 0
        } catch (e) {
            console.log(e)
        }
    }

    extractEditTime(item) {
        try {
            return item.createdAt
        } catch (e) {
            console.log(e)
        }
    }

    extractCreatedTime(item) {
        try {
            return item.createdAt;
        } catch (e) {
            console.log(msg.errorWithTimeOfPost);
            console.log(e);
        }
    }

    isCommentChild(item) {
        return item.parentId !== null
    }


    saveComment = (text, parentCommentId) => {
        if (text) {
            console.log(text);
            let date = moment().format('YYYY-MM-DD H:mm:ss');
            const data = {
                text, parentCommentId, date,
                userId: this.props.user._id,
                email: this.props.user.email,
                productId: this.state.product._id,

            };
            this.props.dispatch(saveComment(data));
            this.getComment(this.state.product._id);
        } else {
            Alert.alert(
                msg.commentMessage,
                msg.emptyInputWriteComment,
                [
                    {
                        text: 'OK', onPress: () => { }
                    },
                ],
                {cancelable: false},
            );
        }

    };

    paginateComments(comments, from_commentId, direction, parent_commentId) {
        let sampleCommentsRaw = this.state.comments;
        sampleCommentsRaw.forEach(c => {
            if (c.children) {
                c.childrenCount = c.children.length
            }
        });
        const sampleComments = Object.freeze(sampleCommentsRaw);
        const c = [...sampleComments];

        if (!parent_commentId) {
            const lastIndex = sampleComments.findIndex((c) => {
                return c._id == from_commentId
            });
            if (direction === 'up') {
                comments = comments.concat(c.splice(lastIndex + 1, 5))

            } else {

                let start = lastIndex - 6 > 1 ? lastIndex - 6 : 0;

                let part = c.slice(start, lastIndex);
                console.log(start, lastIndex);
                comments = [...part, ...comments]

            }
        } else {
            const parentLastIndexDB = sampleComments.findIndex((c) => c._id == parent_commentId);
            const children = c[parentLastIndexDB].children;
            const target = children.findIndex((c) => c._id == from_commentId);
            const existingIndex = comments.findIndex((c) => c._id == parent_commentId);

            if (direction === 'up') {
                const append = children.slice(target + 1, 5);
                comments[existingIndex].children.concat(append)

            } else {
                let start = target - 6 >= 0 ? target : 0;
                const prepend = children.slice(start - 6, target);
                comments[existingIndex].children = [...prepend, ...comments[existingIndex].children]
            }

        }
        return comments
    }

    paginateAction(from_comment_id, direction, parent_comment_id) {
        let newComments = this.paginateComments(
            this.state.comments,
            from_comment_id,
            direction,
            parent_comment_id
        );

        this.setState({
            comments: newComments
        });
        let self = this;

        setTimeout(function () {
            if (direction == 'up') {
                self.refs.scrollView.scrollTo({
                    x: 0,
                    y: 500,
                    animated: true
                });
            } else {
                self.refs.scrollView.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true
                });
            }
        }, 1000);
    }

    forAdminEdit(username) {
        if (this.props.user.role === 'admin') {
            this.setState({owner: username})
        }
    }

    render() {
        const comments = this.state.comments;
        const {product} = this.state;
        const {_id, title, price, article, description} = product;
        const role = this.props.user.role;

        return (
            <Swiper>
                <ScrollView style={styles.content}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}/>
                            }
                >
                    {(role === 'admin') &&
                    <View style={styles.buttonGroup}>
                        <Button
                            icon={
                                <Icon
                                    name='pencil'
                                    size={15}
                                    color='#42dcf7'
                                />
                            }
                            title={msg.edit}
                            type='outline'
                            containerStyle={styles.button}
                            onPress={() => this.props.navigation.navigate('UpdateProduct', (product))}
                        />
                        <Button
                            icon={
                                <Icon
                                    name='times-circle'
                                    size={15}
                                    color='#42dcf7'
                                />
                            }
                            title={msg.delete}
                            type='outline'
                            containerStyle={styles.button}
                            onPress={() => {
                                this.handleDelete(this.state.product);
                            }}
                        />
                    </View>
                    }

                    <Text style={styles.textTitle}>
                        {title}
                    </Text>
                    <View style={styles.imageView}>
                        <Image
                            source={{uri: `${config.imageURL}${_id}?date=${new Date()}`}}
                            style={styles.image}
                            resizeMode={'contain'}
                            key={new Date()}
                        />
                    </View>
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.textContainer}>
                                <Text style={styles.text}>Price:</Text> {price} {msg.uah}{'\n'}
                                <Text style={styles.text}>Article:</Text> {article}{'\n'}
                                <Text style={styles.text}>AvgRating:</Text> {this.calcAvgRating()}{'\n'}
                            </Text>
                        </View>
                        {this.props.user.role ?
                            <View style={styles.touchImageView}>
                                {this.props.user.basket && this.props.user.basket.filter(item => item === _id).length > 0 ?
                                    <TouchableOpacity onPress={this.delFromBasket}>
                                        <Image source={require('../../../images/delBasket.png')}
                                               style={styles.basketImage}/>
                                    </TouchableOpacity> : <TouchableOpacity onPress={this.addToBasket}>
                                        <Image source={require('../../../images/addBasket.png')}
                                               style={styles.basketImage}/>
                                    </TouchableOpacity>
                                }
                            </View> : null}
                    </View>
                </ScrollView>

                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}/>
                }>

                    {description ?
                        <Text style={styles.descriptionContainer}>
                            <Text style={styles.text}>Description:</Text>
                            <Text style={styles.textDescription}> {description}</Text>
                        </Text>
                        :
                        <Text style={styles.textCenter}>No description</Text>
                    }
                </ScrollView>

                <ScrollView
                    keyboardShouldPersistTaps='always'
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}/>
                    }
                    onScroll={event => {
                        this.scrollIndex = event.nativeEvent.contentOffset.y;
                    }}
                    ref={'scrollView'}
                >
                    {role ? null : <Text style={styles.textCenter}>You must login to vote</Text>}
                    <AirbnbRating
                        ratingCount={5}
                        defaultRating={this.state.defaultRating}
                        showRating={!this.state.bool}
                        isDisabled={this.state.bool}
                        onFinishRating={this.ratingHandler}
                        fractions={1}
                    />

                    <Comments
                        usernameTapAction={username => {
                            this.forAdminEdit(username);
                        }}
                        data={comments}
                        keyExtractor={item => item._id}
                        usernameExtractor={item => this.extractUsername(item)}
                        viewingUserName={this.state.owner}
                        editMinuteLimit={0}
                        createdTimeExtractor={item => this.extractCreatedTime(item)}
                        editTimeExtractor={item => this.extractEditTime(item)}
                        bodyExtractor={item => this.extractBody(item)}
                        imageExtractor={item => this.extractImage(item)}
                        saveAction={(text, parentCommentId) => {
                            this.saveComment(text, parentCommentId)
                        }}
                        editAction={(text, comment) => {
                            this.props.actions.edit(this.props.id, comment, text)
                        }}
                        likesExtractor={item => item}
                        childrenCountExtractor={item => this.extractChildrenCount(item)}
                        replyAction={offset => {
                            this.refs.scrollView.scrollTo({
                                x: null,
                                y: this.scrollIndex + offset - 300,
                                animated: true
                            });
                        }}
                        childPropName={'children'}
                        isChild={item => this.isCommentChild(item)}

                        deleteAction={async comment => {
                            await this.props.dispatch(deleteComment(comment));
                            await this.props.dispatch(getComments(this.state.product._id));
                        }}

                        paginateAction={(from_comment_id, direction, parent_comment_id) => {
                            this.paginateAction(from_comment_id, direction, parent_comment_id)
                        }}

                        parentIdExtractor={item => item.parentId}
                    />
                </ScrollView>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    content: {marginBottom: 60, paddingBottom: 50},
    buttonGroup: {flexDirection: 'row', justifyContent: 'space-around', margin: 3},
    button: {width: 'auto', backgroundColor: '#e5e9ea'},
    textTitle: {padding: 15, fontWeight: 'bold', color: 'black'},
    imageView: {justifyContent: 'center', alignItems: 'center'},
    image: {width: 250, height: 250},
    container: {display: 'flex', flexDirection: 'row'},
    textContainer: {padding: 15},
    text: {fontWeight: 'bold'},
    basketImage: {width: 30, height: 30},
    touchImageView: {width: 'auto', padding: 15, marginLeft: 'auto'},
    descriptionContainer: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    textDescription: {
        justifyContent: 'space-between',
        color: 'green'
    },
    textCenter: {textAlign: 'center', margin: 15}


});

export const DetailsScreen = (connect((state) => ({
    product: state.item.product,
    user: state.auth.user,
    comments: state.comment.comments,
    success: state.auth.success
}))(DetailsScreenComponent));
