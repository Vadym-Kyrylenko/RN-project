import React from 'react';
import {StyleSheet, Image} from 'react-native';

class CustomMarker extends React.Component {

    render() {
        return (
            <Image
                style={styles.image}
                source={
                    this.props.pressed ? require('../../images/bike3.png') : require('../../images/bike2.png')
                }
                resizeMode='contain'
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 40,
        width: 40,
    },
});

export default CustomMarker;