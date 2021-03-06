import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import Mood from '../models/Mood';
import { Setting } from '../models/Setting';
import CustomeButton from '../widgets/CustomeButton';
import CustomeDate from '../widgets/CustomeDate';
import MapView, { Marker } from 'react-native-maps';
import ExpandPanel from '../widgets/ExpandPanel';
import Emotions from '../models/Emotions';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModalSelector from 'react-native-modal-selector'
import DialogInput from 'react-native-dialog-input';
import { Reason } from '../models/Reason';

const Realm = require('realm');

class AddReason extends Component {
    watchID = null;
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(props.route.params.mood.date),
            mainMood: props.route.params.mood.mainMood,
            emotions: props.route.params.mood.emotions,
            reasonsDialogVisible: false,
            addReasonDialogVisible: false,
            reasons: [],
        };
        Geolocation.getCurrentPosition(info => {
            var location = {};
            location.longitude = info.coords.longitude.toString();
            location.latitude = info.coords.latitude.toString();
            this.setState({ location: location })
            this.fetchWeather()
        }, error => {console.log("No Location Data");
        });
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
                    {this.allEmotions()}
                </View>
                <SafeAreaView style={{ height: '70%' }}>
                    <ScrollView nestedScrollEnabled>
                        {this.location()}
                        {this.weather()}
                        {this.reason()}
                        {this.notes()}
                    </ScrollView>
                </SafeAreaView>

                <View style={styles.bottomView}>
                    <CustomeButton onPress={() => this.onSaveMood()}>Save Your Mood</CustomeButton>
                </View>
            </View>
        )
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

    allEmotions() {
        if (this.state.emotions.length > 0) {
            return (
                <View style={{ flexDirection: 'row' }} >
                    <Text key="Header" style={[styles.topBarText, { marginStart: 15 }]}>{this.state.emotions.length > 1 ? "Emotions:" : "Emotion:"}</Text>
                    {this.state.emotions.map(feeltEmotion =>
                        <Image
                            key={feeltEmotion}
                            style={styles.moodImg}
                            source={Emotions.find(emotion => emotion.name == feeltEmotion).iconSource}
                        />)
                    }
                </View>
            );
        }
    }

    location() {
        if (this.state.location && this.state.location.longitude && this.state.location.latitude) {
            return (
                <ExpandPanel title="Location">
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

    getCoordinate() {
        return { lat: parseFloat(this.state.location.latitude), lng: parseFloat(this.state.location.longitude) }
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

                var weather = {};
                weather.temperatur = weatherData.main.temp;
                weather.clouds = weatherData.clouds.all;
                weather.description = weatherData.weather[0].description;
                weather.icon = weatherData.weather[0].icon;
                weather.sunrise = new Date(weatherData.sys.sunrise);
                weather.sunset = new Date(weatherData.sys.sunset);
                this.setState({ weather: weather });
            });
    }

    reason() {
        let data = Mood.getRealm().objects('Reason').map(r => {
            return { key: r.name, label: r.name, component: this.getReasonComponent(r) }
        });
        data.push({ key: 'Add', label: 'Add', component: this.addReason() });
        const { reasons } = this.state;
        return (
            <View>
                <ExpandPanel title="Reasons">
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            {reasons.map(r => {
                                return (
                                    <Text style={{ fontSize: 20 }} key={r}>
                                        {r}
                                    </Text>);
                            })}
                        </View>
                        <ModalSelector
                            data={data}
                            initValue={this.state.reasons.length > 0 ? "Add a Resoan" : "Select a Reason!"}
                            onChange={(option) => this.reasonChange(option)}
                            closeOnChange={false}
                            cancelText="Close"
                        />
                    </View>
                </ExpandPanel>


            </View>

        );
    }

    addReason() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ addReasonDialogVisible: true })} >
                    <Text style= {{color:'green', textAlign: 'center'}}>Add other</Text>
                </TouchableOpacity>
                <DialogInput isDialogVisible={this.state.addReasonDialogVisible}
                    title={"Add new Reason"}
                    message={"Pleas enter the Reason for your Mood"}
                    hintInput={"Reason"}
                    submitInput={(inputText) => { this.saveNewReason(inputText) }}
                    closeDialog={() => this.setState({ addReasonDialogVisible: false })}>
                </DialogInput>
            </View>

        );
    }

    saveNewReason(reason) {
        Reason.save(reason);
        this.reasonChange({key: reason, label: reason});
        this.setState({ addReasonDialogVisible: false })
    }

    reasonChange(option) {
        if (option.key != 'Add') {
            let { reasons } = this.state;
            if (reasons.includes(option.key)) {
                reasons.splice(reasons.indexOf(option.key), 1);
            } else {
                reasons.push(option.key);
            }
            this.setState({ reasons: reasons })
        }
    }

    getReasonComponent(reason) {
        return (
            <View>
                <Text style={(this.state.reasons.includes(reason.name) ? { color: 'blue', textAlign: 'center'}  :  {color: 'black', textAlign: 'center'})}>
                    {reason.name}
                </Text>
            </View>
        );
    }

    getReasonDialog() {

        return (
            <View>
                <Text>This is the Options</Text>
                {
                    this.state.reasons.forEach(r => {
                        return (
                            <Text> Test {r.name}</Text>
                        );
                    })
                }
            </View>
        );
    }
    notes() {
        return (
            <ExpandPanel title="Notes">
                <View>
                    <TextInput
                        style={{ borderColor: 'gray', borderWidth: 1, margin: 10, textAlignVertical: 'top' }}
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => this.setState({ note: text })}
                    />
                </View>
            </ExpandPanel>
        );
    }

    onSaveMood() {
        let realm = Mood.getRealm();
        const moodId = realm.objects('Mood').length + 1;
        realm.write(() => {
            let mood = realm.create('Mood', { id: moodId, mainMood: this.state.mainMood, emotions: this.state.emotions, note: this.state.note, date: this.state.date });
            mood.location = realm.create('Location', { ...this.state.location, id: realm.objects('Location').length + 1 });
            mood.weather = realm.create('Weather', { ...this.state.weather, id: realm.objects('Weather').length + 1 });
            let realmReasons = [];
            this.state.reasons.forEach(r => {
                realmReasons.push(realm.objectForPrimaryKey('Reason', r));
            });
            mood.reasons = realmReasons;
        });
        realm.close();
        realm = new Realm({ schema: [Setting] });
        if (realm.objectForPrimaryKey('Setting', 'moodResponseEnabled').value == 'true' && this.state.emotions.length > 0) {
            this.props.navigation.navigate('MoodResponse', { emotions: this.state.emotions, moodId: moodId });
        } else {
            this.props.navigation.navigate('Home');
        }
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