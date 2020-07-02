import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';



const Realm = require('realm');
class Settings extends Component {

    render() {
        return (
            <View>
                <View style={styles.menu}>
                    <Text
                        style={styles.header}

                    >Mood Settings</Text>

                    <Text
                        onPress={() => this.deleteAllMoods()}
                        style={styles.menuItem}
                    >Delete all Moods</Text>
                </View>

            </View>
        )
    }


    deleteAllMoods() {
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        realm.write (() =>{
            realm.deleteAll()
        });
        console.log("All Moods Deleted");
    }
}



const styles = StyleSheet.create({
    menuItem: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
        borderColor: 'gray',
        borderWidth: 1,

    },
    menu: {
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: 5
    },
    header: {
        borderRadius: 5,
        fontWeight: 'bold',
        fontSize: 25,
        backgroundColor: 'rgba(192,192,192, 0.8)',
        borderColor: 'black',
        borderWidth: 2,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    }
})

export default Settings;