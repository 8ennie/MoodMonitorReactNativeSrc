import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";


const MenuButton = props => {
    return (
        <View style={{...styles.view, ...props.style}}>
            <TouchableOpacity onPress={props.onPress} style={styles.touch}>
                <Image
                    source={props.imageSource}
                    style={{...styles.img, ...props.imageStyle}} />
                <Text style={{...styles.lable, ...props.textStyle}}>{props.lable}</Text>
            </TouchableOpacity>
        </View>

    )
};


const styles = StyleSheet.create({
    view: {
        borderRadius: 30,
        width: 150,
        height: 150,
        margin:5
    },
    touch:{
        alignItems: 'center',
    },
    lable: {
        textAlign: 'center',
        color: 'orange',
        fontSize: 25,
        fontWeight: 'bold',
    },
    img: {
        height: '75%',
        width: '75%',
        borderRadius:90,
        resizeMode:'contain'
    }
})
export default MenuButton;