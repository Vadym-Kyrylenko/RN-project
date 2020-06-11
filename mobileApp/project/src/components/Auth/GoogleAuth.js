import React, {Component} from 'react';
import {
    Linking,
    StyleSheet,
    Platform,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const config = require('../../../config').APPCONST;

export default class App extends Component {

    state = {
        user: undefined, // user has not logged in yet
    };

    // Set up Linking
    componentDidMount() {
        // Add event listener to handle OAuthLogin:// URLs
        Linking.addEventListener('url', this.handleOpenURL);
        // Launched from an external URL
        Linking.getInitialURL().then((url) => {
            if (url) {
                this.handleOpenURL({url});
            }
        });
    };

    componentWillUnmount() {
        // Remove event listener
        Linking.removeEventListener('url', this.handleOpenURL);
    };

    handleOpenURL = ({url}) => {
        // Extract stringified user string out of the URL
        const [, user_string] = url.match(/user=([^#]+)/);
        this.setState({
            // Decode the user string and parse it into JSON
            user: JSON.parse(decodeURI(user_string))
        });
        if (Platform.OS === 'ios') {
            SafariView.dismiss();
        }
    };

    // Handle Login with Google button tap
    loginWithGoogle = () => this.openURL(`${config.URL}/auth/google`);

    // Open URL in a browser
    openURL = (url) => {
        Linking.openURL(url);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <Icon.Button
                        name='google'
                        backgroundColor='#DD4B39'
                        onPress={this.loginWithGoogle}
                        {...iconStyles}
                    >
                        Login with Google
                    </Icon.Button>
                </View>
            </View>
        );
    }
}

const iconStyles = {
    borderRadius: 10,
    iconStyle: {paddingVertical: 5},
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        margin: 20,
    },
    avatarImage: {
        borderRadius: 50,
        height: 100,
        width: 100,
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    text: {
        textAlign: 'center',
        color: '#333',
        marginBottom: 5,
    },
    buttons: {
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 20,
        marginBottom: 30,
    },
});
