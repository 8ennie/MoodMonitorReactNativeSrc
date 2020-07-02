import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Image, Platform, UIManager } from "react-native";
import PropTypes from 'prop-types';

export default class ExpandPanel extends React.Component {

    constructor(props){
        super(props);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = {
            expanded: false,
        }
    }
    
    render() {
        return (

            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.catagoryHeader}>
                    <Text style={styles.heading}>{this.props.title}</Text>
                    <Image style={styles.imgExpand}
                        source={this.state.expanded ? require('../resources/images/expand_less_18dp.png') : require('../resources/images/expand_more_18dp.png')}
                    />
                </TouchableOpacity>
                <View style={{ height: this.state.expanded ? null : 0, overflow: 'hidden' }}>
                    {this.props.children}
                </View>
            </View>



        );
    }
    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded });
    }
}

ExpandPanel.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.element };


const styles = StyleSheet.create({
    imgExpand: {
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },
    heading: {
        textAlign: 'center',
        fontSize: 20,
    },
    catagoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingStart: 15,
        paddingEnd: 15
    },
})