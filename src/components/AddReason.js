import React, { Component } from 'react';
import { NavigationActions, StackActions } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';
import CustomeButton from '../widgets/CustomeButton';
import CustomeDate from '../widgets/CustomeDate';
import MapView, { Marker } from 'react-native-maps';
import ExpandPanel from '../widgets/ExpandPanel';
const Realm = require('realm');

class AddReason extends Component {
    watchID = null;
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(props.route.params.mood.date),
            mainMood: props.route.params.mood.mainMood,
            moods: props.route.params.mood.moods,
        };
        Geolocation.getCurrentPosition(info => {
            var location = {};
            location.longitude = info.coords.longitude.toString();
            location.latitude = info.coords.latitude.toString();
            this.setState({ location: location })
            this.fetchWeather()
        }, error => {
            console.log(error);
        },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
    }

    componentWillUnmount() {
        this.watchID != null && Geolocation.clearWatch(this.watchID);
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


    render() {
        return (
            <View style={{ flex: 1 }}>
                <CustomeDate date={this.state.date}></CustomeDate>
                <View style={styles.topBar}>
                    <Text style={styles.topBarText}>Main Feeling:</Text>
                    <Image
                        style={styles.moodImg}
                        source={this.mainMoodImg()}
                    />
                    {this.allMoods()}
                </View>
                <ExpandPanel title="Location">
                    {this.location()}
                </ExpandPanel>
                <ExpandPanel title="Weather">
                    {this.weather()}
                </ExpandPanel>



                <View style={styles.bottomView}>
                    <CustomeButton onPress={() => this.onSaveMood()}>Save Your Mood</CustomeButton>
                </View>
            </View>
        )
    }
    getCoordinate() {
        return { lat: parseFloat(this.state.location.latitude), lng: parseFloat(this.state.location.longitude) }
    }

    location() {
        if (this.state.location && this.state.location.longitude && this.state.location.latitude) {
            return (
                <View >
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
                                coordinate={{ latitude: parseFloat(this.state.location.latitude), longitude: parseFloat(this.state.location.longitude) }}
                                style={styles.mainMoodImg}>
                                <Image
                                    style={styles.moodImg}
                                    source={this.mainMoodImg()}
                                />
                            </Marker>
                        </MapView>
                    </View>


                </View>

            );
        }

    }

    getWeatherIcon() {
        const imgUrl = 'https://openweathermap.org/img/wn/' + this.state.weather.icon + '@2x.png'
        return { uri: imgUrl }
    }

    weather() {
        if (this.state.weather) {
            return (
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

            );
        }

    }



    allMoods() {
        if (this.state.moods.length > 0) {
            const moods = [];
            moods.push(<Text key="Header" style={[styles.topBarText, { marginStart: 15 }]}>Moods:</Text>);
            this.state.moods.forEach(mood => {
                moods.push(this.displayMood(mood));
            });
            return moods;
        }
    }

    displayMood(mood) {
        let imgUrl;
        if (mood == 1) {
            imgUrl = require('../resources/images/angry_icon.png');
        }
        if (mood == 2) {
            imgUrl = require('../resources/images/sad_crying_icon.jpg');
        }
        if (mood == 3) {
            imgUrl = require('../resources/images/happy_smiley_icon.jpg');
        }
        if (mood == 4) {
            imgUrl = require('../resources/images/tired_icon.jpg');
        }
        if (mood == 5) {
            imgUrl = require('../resources/images/scared_icon.png');
        }
        if (mood == 6) {
            imgUrl = require('../resources/images/loved_icon.jpg');
        }

        return (
            <Image
                key={mood}
                style={styles.moodImg}
                source={imgUrl}
            />
        );
    }

    fetchWeather() {
        const API_KEY = "b884c72a7f69d65a331f083948fa44e6";
        fetch(
            `http://api.openweathermap.org/data/2.5/weather?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&APPID=${API_KEY}&units=metric`
        )
            .then(res => res.json())
            .then(weatherData => {
                var location = this.state.location;
                location.city = weatherData.name;
                location.country = weatherData.sys.country;
                this.setState({ location: location });

                var weather = new Weather
                weather.temperatur = weatherData.main.temp;
                weather.clouds = weatherData.clouds.all;
                if (weatherData.rain) {
                    //TODO: get Rain
                }
                weather.description = weatherData.weather[0].description;
                weather.icon = weatherData.weather[0].icon;
                weather.sunrise = weatherData.sys.sunrise;
                weather.sunset = weatherData.sys.sunset;
                this.setState({ weather: weather });
            });
    }


    onSaveMood() {
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        realm.write(() => {
            let mood = realm.create('Mood', { id: realm.objects('Mood').length + 1, mainMood: this.state.mainMood, moods: this.state.moods, note: this.state.note, date: this.state.date });
            mood.location = realm.create('Location', { ...this.state.location, id: realm.objects('Location').length + 1 });
        });
        realm.close();
        this.props.navigation.navigate('Home');
    }

}

const styles = StyleSheet.create({
    topBarText: {
        fontSize: 20
    },
    topBar: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    moodImg: {
        width: 30,
        height: 30,
        borderRadius: 90,
        marginStart: 5
    },
    imgExpand: {
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },
    catagoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingStart: 15,
        paddingEnd: 15
    },
    bottomView: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        paddingEnd: 20,
        paddingStart: 20,
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
    heading: {
        textAlign: 'center',
        fontSize: 20,
    },
})

export default AddReason;