import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native'
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';


const Realm = require('realm');

class ShowMood extends Component {

    state = {
        date: new Date(),
        mainMood: 3,
        moods: [],
        expandedMood: false,
        note: "",
        location: {},
        weather: {},
    }

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expandedMood: !this.state.expandedMood });
    }


    constructor(props) {
        super(props);
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        let mood = realm.objectForPrimaryKey('Mood', props.route.params.moodId);
        this.state = {
            date: mood.date,
            mainMood: mood.mainMood,
            moods: mood.moods.map(m => m),
            note: mood.note,
            location: mood.location,
            weather: mood.weather
        };
        console.log(mood);
        
        console.log(this.state);
        
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    onPressMainMood(newMood) {
        if (this.state.edit) {
            this.setState({
                mainMood: newMood
            })
        }
    }
    changeLocationLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expandedLocation: !this.state.expandedLocation });
    }

    location() {
        if (this.state.location) {
            return (
                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.changeLocationLayout} style={styles.catagoryHeader}>
                        <Text style={styles.heading}>Location</Text>
                        <Image style={styles.imgExpand}
                            source={this.state.expandedLocation ? require('../resources/images/expand_less_18dp.png') : require('../resources/images/expand_more_18dp.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ height: this.state.expandedLocation ? null : 0, overflow: 'hidden' }}>
                        <Text>{this.state.location.city}</Text>
                        <Text>{this.state.location.country}</Text>
                    </View>
                </View>
            );
        }

    }

    onPressMood(mood) {
        if (this.state.edit) {
            var newMoods = this.state.moods;
            if (newMoods.includes(mood)) {
                newMoods.splice(newMoods.indexOf(mood), 1);
            } else {
                newMoods.push(mood);
            }
            this.setState({
                moods: newMoods
            })
        }
    }

    displayMainMood() {
        if (this.state.mainMood == 1) {
            return (
                < Image
                    style={styles.imgMainMood}
                    source={require('../resources/images/sad_icon.png')}
                />
            );
        } else if (this.state.mainMood == 2) {
            return (
                < Image
                    style={styles.imgMainMood}
                    source={require('../resources/images/normal_icon.png')}
                />
            );
        } else if (this.state.mainMood == 3) {
            return (
                < Image
                    style={styles.imgMainMood}
                    source={require('../resources/images/happy_icon.png')}
                />
            );
        }
    }


    displayMood(mood) {
        if (mood == 1) {
            return (
                <View>
                    <Image
                        style={styles.imgMood}
                        source={require('../resources/images/angry_icon.png')}
                    />
                    <Text style={styles.moodDesc}>Angry</Text>
                </View>
            );
        }
        if (mood == 2) {
            return (
                <View>
                    <Image
                        style={styles.imgMood}
                        source={require('../resources/images/sad_crying_icon.jpg')}
                    />
                    <Text style={styles.moodDesc}>Sad</Text>
                </View>
            );
        }
        if (mood == 3) {
            return (
                <View>
                    <Image
                        style={styles.imgMood}
                        source={require('../resources/images/happy_smiley_icon.jpg')}
                    />
                    <Text style={styles.moodDesc}>Happy</Text>
                </View>
            );
        }
        if (mood == 4) {
            return (
                <View>
                    <Image
                        style={styles.imgMood}
                        source={require('../resources/images/tired_icon.jpg')}
                    />
                    <Text style={styles.moodDesc}>Tired</Text>
                </View>
            );
        }
        if (mood == 5) {
            return (
                <View>
                    <Image
                        style={styles.imgMood}
                        source={require('../resources/images/scared_icon.png')}
                    />
                    <Text style={styles.moodDesc}>Scared</Text>
                </View>
            );
        }
        if (mood == 6) {
            return (
                <View>
                    <Image
                        style={styles.imgMood}
                        source={require('../resources/images/loved_icon.jpg')}
                    />
                    <Text style={styles.moodDesc}>Loved</Text>
                </View>
            );
        }
    }

    displayAllMood() {
        if(this.state.moods.length != 0){
            return (
                <View>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.catagoryHeader}>
                        <Text style={styles.heading}>In what Mood are you?</Text>
                        <Image style={styles.imgExpand}
                            source={this.state.expandedMood ? require('../resources/images/expand_less_18dp.png') : require('../resources/images/expand_more_18dp.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ height: this.state.expandedMood ? null : 0, overflow: 'hidden' }}>
                        <View style={[styles.imgMoodGroup]}>
                            {this.state.moods.includes(1) ? this.displayMood(1) : null}
                            {this.state.moods.includes(2) ? this.displayMood(2) : null}
                            {this.state.moods.includes(3) ? this.displayMood(3) : null}
                            {this.state.moods.includes(4) ? this.displayMood(4) : null}
                            {this.state.moods.includes(5) ? this.displayMood(5) : null}
                            {this.state.moods.includes(6) ? this.displayMood(6) : null}
                        </View>
                    </View>
                </View>
            );
        }
        
    }

    render() {
        const { navigation } = this.props;
        const { date } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Text style={[styles.heading, { fontSize: 30, fontWeight: 'bold' }]}>{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() +
                    " (" + date.getHours() + ":" + date.getMinutes() + ")"}</Text>
                <Text style={styles.heading}>How did You Feeling:</Text>
                <View style={styles.imgMainMoodGroup}>
                    {this.displayMainMood()}
                </View>
                    {this.displayAllMood()}
                <View style={styles.bottomView}>
                    <Button title="Go Back" style={styles.saveButton} onPress={() => navigation.navigate('Home')}></Button>
                </View>
                {this.location()}
            </View >
        );
    }
}




const styles = StyleSheet.create({
    heading: {
        textAlign: 'center',
        fontSize: 20,
    },
    imgMainMoodGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgMainMood: {
        height: 100,
        width: 100,
        margin: 3,
        resizeMode: 'stretch',
        borderRadius: 90,

    },
    imgMoodGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 15,
    },
    imgMood: {
        height: 50,
        width: 50,
        margin: 3,
        resizeMode: 'stretch',
        borderRadius: 90,
        borderColor: 'red',
        borderWidth: 0,
        marginEnd: 10,
        marginStart: 10,
    },
    moodDesc: {
        textAlign: 'center'
    },
    imgExpand: {
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },
    saveButton: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36
    },
    bottomView: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        paddingEnd: 20,
        paddingStart: 20,
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
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


export default ShowMood;