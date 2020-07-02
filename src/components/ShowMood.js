import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native'
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';
import CustomeDate from '../widgets/CustomeDate';
import MapView, { Marker } from 'react-native-maps';


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
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>{this.state.location.city}, {this.state.location.country}</Text>

                        <View style={{ height: 300, marginHorizontal: 15 }}>
                            <MapView
                                initialRegion={{
                                    latitude: parseFloat(this.state.location.latitude),
                                    longitude: parseFloat(this.state.location.longitude),
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                style={{ ...StyleSheet.absoluteFillObject }}
                            >
                                <Marker
                                    coordinate={{ latitude: parseFloat(this.state.location.latitude), longitude: parseFloat(this.state.location.longitude) }}
                                    style={styles.mainMoodImg}
                                >
                                    <Image
                                        style={styles.moodImg}
                                        source={this.mainMoodImg()}
                                    />
                                </Marker>
                            </MapView>
                        </View>
                    </View>
                </View>
            );
        }
    }

    mainMoodImg() {
        if (this.state.mainMood == 1) {
            return require('../resources/images/sad_icon.png')
        } else if (this.state.mainMood == 2) {
            return require('../resources/images/normal_icon.png')
        } else if (this.state.mainMood == 3) {
            return require('../resources/images/happy_icon.png')
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
        if (this.state.moods.length != 0) {
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
        return (
            <View style={{ flex: 1 }}>
                <CustomeDate date={this.state.date}></CustomeDate>
                <Text style={styles.heading}>How did You Feel:</Text>
                <View style={styles.imgMainMoodGroup}>
                    < Image
                        style={styles.imgMainMood}
                        source={this.mainMoodImg()}
                    />
                </View>
                {this.displayAllMood()}
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
    moodImg: {
        width: 30,
        height: 30,
        borderRadius: 90,
        marginStart: 5
    },
})


export default ShowMood;