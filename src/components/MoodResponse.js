import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native'
import Emotions from '../models/Emotions';
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';
import CustomeButton from '../widgets/CustomeButton';




class MoodResponse extends Component {


    constructor(props) {
        var realm = new Realm({ schema: [Mood, Location, Weather] });
        super(props);
        const emotions = props.route.params.emotions;
        const emotion = Emotions.find(e => e.name == emotions[this.getRandomInt(emotions.length)]);
        const mood = realm.objectForPrimaryKey('Mood', props.route.params.moodId);
        const response = emotion.response({ mood: mood });
        this.state = {
            mood: mood,
            emotion: emotion,
            responseMessage: response
        }
        realm.close();
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    render() {
        const { navigation } = this.props;
        //const width = Dimensions.get("window").width;
        return (
            <View style={{
                backgroundColor: 'orange',
                alignContent: 'center',
                flex: 1
            }}>
                <ImageBackground
                    source={require('../resources/images/speach_bubble.png')}
                    style={{
                        marginTop: 50,
                        height: 300,
                        justifyContent: "center",
                        alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 25, padding: 17, textAlign: 'center', marginBottom:50 }}>{this.state.responseMessage}</Text>
                </ImageBackground>

                <View style={{ width: 150 }}>
                    <Image source={this.state.emotion.iconSource}
                        style={{ borderRadius: 360, width: 150, height: 150, resizeMode: 'stretch', margin: 15 }}
                    />
                </View>
                <View style={styles.bottomView}>
                    <CustomeButton onPress={() => navigation.navigate('Home')} style={{ marginBottom: 5 }}>Done</CustomeButton>  
                </View>

            </View>
        )
    }



}



const styles = StyleSheet.create({
    bottomView: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        paddingEnd: 20,
        paddingStart: 20,
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
})

export default MoodResponse;