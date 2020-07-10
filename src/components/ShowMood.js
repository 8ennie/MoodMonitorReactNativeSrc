import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';
import CustomeDate from '../widgets/CustomeDate';
import ExpandPanel from '../widgets/ExpandPanel';
import MapView, { Marker } from 'react-native-maps';
import Emotions from '../models/Emotions';
import MenuButton from '../widgets/MenuButton';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const Realm = require('realm');

class ShowMood extends Component {

    state = {
        date: new Date(),
        mainMood: 3,
        emotions: [],
        note: "",
        location: {},
        weather: {},
    }

    constructor(props) {
        super(props);
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        let mood = realm.objectForPrimaryKey('Mood', props.route.params.moodId);
        this.state = {
            date: mood.date,
            mainMood: mood.mainMood,
            emotions: mood.emotions.map(e => e),
            note: mood.note,
            location: mood.location,
            weather: mood.weather
        };
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <CustomeDate date={this.state.date} time></CustomeDate>
                <Text style={styles.heading}>How did You Feel:</Text>
                <View style={styles.imgMainMoodGroup}>
                    < Image
                        style={styles.imgMainMood}
                        source={this.mainMoodImg()}
                    />
                </View>
                {this.emotions()}
                <SafeAreaView style={styles.container}>
                    <ScrollView style={styles.scrollView}>
                        <View>
                            {this.location()}
                            {this.weather()}
                            {this.note()}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View >
        );
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

    emotions() {
        if (this.state.emotions.length > 0) {
            let data = [];
            this.state.emotions.forEach(e => {
                data.push(Emotions.find(em => em.name == e));
            });
            return (
                <ExpandPanel title="Emotions">
                    <View style={{ alignItems: 'center' }}>
                        <FlatList
                            data={data}
                            style={{ maxHeight: 200 }}
                            renderItem={({ item }) =>
                                <MenuButton
                                    lable={item.name}
                                    imageSource={item.iconSource}
                                    style={{ width: 90, height: 90 }}
                                    imageStyle={{ borderRadius: 90 }}
                                    textStyle={{ fontSize: 18, color: 'black', fontWeight: 'normal' }}
                                />
                            }
                            keyExtractor={item => item.name}
                            horizontal={false}
                            numColumns={3}
                        />
                    </View>
                </ExpandPanel>
            );
        }
    }


    location() {
        if (this.state.location) {
            return (

                <ExpandPanel title="Location">
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>{this.state.location.city}, {this.state.location.country}</Text>
                        <View style={{ height: 300, marginHorizontal: 15 }}>
                            <MapView
                                initialRegion={{
                                    latitude: parseFloat(this.state.location.latitude),
                                    longitude: parseFloat(this.state.location.longitude),
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                style={{ ...StyleSheet.absoluteFillObject }}>
                                <Marker
                                    coordinate={{ latitude: parseFloat(this.state.location.latitude), longitude: parseFloat(this.state.location.longitude) }}>
                                    <Image
                                        style={styles.moodImg}
                                        source={this.getMapIcon()}
                                    />
                                </Marker>
                            </MapView>
                        </View>
                    </View>
                </ExpandPanel>

            );
        }
    }

    getMapIcon() {
        if (this.state.emotions.length > 0) {
            return Emotions.find(emotion => this.state.emotions[0] == emotion.name).iconSource;
        } else {
            return this.mainMoodImg();
        }
    }

    weather() {
        if (this.state.weather) {
            return (
                <ExpandPanel title="Weather">
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15, alignItems: 'center' }}>
                            <Image style={{ width: 70, height: 70, backgroundColor: '#C0C0C0', borderRadius: 90, borderWidth: 1, borderColor: 'black' }}
                                source={this.getWeatherIcon()}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20 }}>Temp: {this.state.weather.temperatur} C</Text>
                                <Text style={{ fontSize: 20 }}>Desc: {this.state.weather.description}</Text>
                                <Text style={{ fontSize: 20 }}>{this.state.weather.clouds} % Clouds</Text>
                            </View>
                        </View>
                    </View>
                </ExpandPanel>
            );
        }

    }

    getWeatherIcon() {
        const imgUrl = 'https://openweathermap.org/img/wn/' + this.state.weather.icon + '@2x.png'
        return { uri: imgUrl }
    }

    note() {
        if (this.state.note) {
            console.log(this.state.note);

            return (
                <ExpandPanel title="Note">
                    <View>
                        <Text style={{ margin: 10, marginHorizontal: 15 }}>{this.state.note}</Text>
                    </View>
                </ExpandPanel>
            );
        }
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
    moodImg: {
        width: 30,
        height: 30,
        borderRadius: 90,
        marginStart: 5
    },
})


export default ShowMood;