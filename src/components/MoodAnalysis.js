import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Mood from '../models/Mood';
import ExpandPanel from '../widgets/ExpandPanel';
import Location from '../models/Location';
import Weather from '../models/Weather';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';



const Realm = require('realm');

class MoodAnalysis extends Component {


    constructor(props) {
        super(props);
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        this.state = {
            moods: realm.objects('Mood'),
        };
        realm.addListener('change', () => {
            this.setState({ moods: realm.objects('Mood') });
        });
        Geolocation.getCurrentPosition(info => {
            this.setState({ currentLocation: { latitude: info.coords.latitude, longitude: info.coords.longitude } });
        });
    }



    render() {
        return (
            <View>
                {this.location()}
            </View>
        );
    }

    location() {

        if (this.state.currentLocation && this.state.moods.length > 0) {
            return (
                <ExpandPanel title="Location Mood">

                    <View style={{ height: 300, marginHorizontal: 15 }}>
                        <MapView
                            initialRegion={{
                                latitude: parseFloat(this.state.currentLocation.latitude),
                                longitude: parseFloat(this.state.currentLocation.longitude),
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            style={{ ...StyleSheet.absoluteFillObject }}>
                            {this.state.moods.map(mood => {
                                if (mood.location) {
                                    return (<Marker key={mood.id}
                                        coordinate={{ latitude: parseFloat(mood.location.latitude), longitude: parseFloat(mood.location.longitude) }}
                                    />
                                    )
                                }
                            }
                            )}
                        </MapView>

                    </View>


                </ExpandPanel>
            )
        }
    }

}


const styles = StyleSheet.create({

})

export default MoodAnalysis;