import React from "react";
import { Text, StyleSheet } from "react-native";


const CustomeDate = props => {
    return (
        <Text style={{ ...styles.text, ...props.style }}>{
            props.date.getDate() + "/" + 
            (props.date.getMonth() + 1) + "/" + 
            props.date.getFullYear() + " (" + 
            (props.date.getHours() < 10 ? "0" + props.date.getHours() : props.date.getHours()) + ":" + 
            (props.date.getMinutes() < 10 ? "0" + props.date.getMinutes() : props.date.getMinutes()) + ")"
            }</Text>
    )
};


const styles = StyleSheet.create({
    text: {
        fontSize: 30, 
        fontWeight: 'bold',
        textAlign: 'center',
    }
})
export default CustomeDate;