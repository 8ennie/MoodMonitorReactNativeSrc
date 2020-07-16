import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';
import { Setting } from '../models/Setting';
import PreLoadedData from '../models/PreLoadData';
import Emotions from '../models/Emotions';
import CustomeButton from '../widgets/CustomeButton';



const Realm = require('realm');
class Settings extends Component {


    constructor(props) {
        super(props);
        let realm = new Realm({ schema: [Setting] });
        let moodResponseEnabled = true;
        if (realm.objectForPrimaryKey('Setting', 'moodResponseEnabled')) {
            moodResponseEnabled = realm.objectForPrimaryKey('Setting', 'moodResponseEnabled').value == 'true';
        }
        this.state = {
            moodResponseEnabled: moodResponseEnabled
        }
        realm.close();

    }

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

                    <Text
                        onPress={() => this.loadAllData()}
                        style={styles.menuItem}
                    >Add Preloaded Moods</Text>

                    <Text
                        onPress={() => this.addRandomeMoods()}
                        style={styles.menuItem}
                    >Add Random Moods</Text>
                </View>

                <View style={styles.menu}>
                    <Text
                        style={styles.header}

                    >Mood Response</Text>

                    <CustomeButton style={this.state.moodResponseEnabled ?
                        { backgroundColor: 'orange', borderWidth: 2, borderColor: 'orange' } :
                        { backgroundColor: 'white', borderWidth: 2, borderColor: 'orange' }}
                        textStyle={this.state.moodResponseEnabled ?
                            { color: 'white' } :
                            { color: 'black' }}
                        onPress={() => this.enableMoodResponse()}
                    >{this.state.moodResponseEnabled ?
                        "Disable Mood Response" :
                        "Enable Mood Response"}
                    </CustomeButton>
                </View>

            </View>
        )
    }

    enableMoodResponse() {
        const mRE = !this.state.moodResponseEnabled;

        let realm = new Realm({ schema: [Setting] });
        realm.write(() => {
            var prop = realm.objectForPrimaryKey('Setting', 'moodResponseEnabled');
            if (prop) {
                prop.value = mRE.toString();
            } else {
                realm.create('Setting', { property: 'moodResponseEnabled', value: mRE.toString() })
            }
        });

        this.setState({ moodResponseEnabled: mRE });

    }


    deleteAllMoods() {
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        realm.write(() => {
            realm.deleteAll()
        });
        console.log("All Moods Deleted");
    }

    loadAllData() {
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        let preMoods = PreLoadedData;
        let key = realm.objects('Mood').length;
        realm.write(() => {
            preMoods.forEach(mood => {
                realm.create('Mood', { ...mood, id: key + 1 });
                key++;
            });
        });
        console.log("Added all Preloaded Moods");
    }

    addRandomeMoods() {
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        let key = realm.objects('Mood').length + 1;
        realm.write(() => {
            for (i = 0; i < 10; i++) {
                realm.create('Mood', { id: key + i, mainMood: this.getRandomInt(1, 4), emotions: [Emotions[Math.random(Emotions.length)]], date: this.randomDate(new Date(2020, 5, 28), new Date()) });
            }
        });
        console.log("Randome Moods");
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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