import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, LayoutAnimation, Platform, UIManager, FlatList } from 'react-native'
import Mood from '../models/Mood';
import Location from '../models/Location';
import Weather from '../models/Weather';
import CustomeButton from '../widgets/CustomeButton';
import CustomeDate from '../widgets/CustomeDate';
import MenuButton from '../widgets/MenuButton';
import Emotions from '../models/Emotions';
import { add } from 'react-native-reanimated';


const Realm = require('realm');

class MoodAdd extends Component {

    state = {
        date: new Date(),
        mainMood: 3,
        emotions: [],
        expandedMood: false,
        note: "",
    }

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expandedMood: !this.state.expandedMood });
    }


    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    onPressMainMood(newMood) {
        this.setState({
            mainMood: newMood
        })

    }


    onPressMood(emotion) {        
        var newEmotions = this.state.emotions;
        if (newEmotions.includes(emotion)) {
            newEmotions.splice(newEmotions.indexOf(emotion), 1);
        } else {
            newEmotions.push(emotion);
        }
        this.setState({
            emotions: newEmotions
        })
    }

    onSaveMood() {
        let realm = new Realm({ schema: [Mood, Location, Weather] });
        realm.write(() => {
            realm.create('Mood', { id: realm.objects('Mood').length + 1, mainMood: this.state.mainMood, emotions: this.state.emotions, note: this.state.note, date: this.state.date });
        });
        realm.close();
        this.props.navigation.navigate('Home')
    }

    onAddReasons() {
        this.props.navigation.navigate('AddReason', { mood: { mainMood: this.state.mainMood, emotions: this.state.emotions, date: this.state.date.getTime() } })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <CustomeDate date={this.state.date}></CustomeDate>
                <Text style={styles.heading}>How Are You Feeling?</Text>
                <View style={styles.imgMainMoodGroup}>
                    <TouchableOpacity onPress={() => this.onPressMainMood(1)}>
                        <Image
                            style={this.state.mainMood === 1 ? styles.imgMainMoodSelected : styles.imgMainMood}
                            source={require('../resources/images/sad_icon.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressMainMood(2)}>
                        <Image
                            style={this.state.mainMood === 2 ? styles.imgMainMoodSelected : styles.imgMainMood}
                            source={require('../resources/images/normal_icon.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPressMainMood(3)}>
                        <Image
                            style={this.state.mainMood === 3 ? styles.imgMainMoodSelected : styles.imgMainMood}
                            source={require('../resources/images/happy_icon.png')}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.heading, { marginTop: 25, marginBottom: 10 }]}>What Emotoion are you feeling?</Text>
                <View style={styles.emotionsList}>
                    <FlatList
                        data={Emotions}
                        style={{ height: 200 }}
                        renderItem={({ item }) =>
                            <MenuButton
                                lable={item.name}
                                imageSource={item.iconSource}
                                onPress={() => this.onPressMood(item.name)}
                                style={{ width: 90, height: 90}}
                                imageStyle={styles.imgEmotion}
                                textStyle={this.state.emotions.includes(item.name) ? { fontSize: 20, color: 'orange', fontWeight: 'normal' } : { fontSize: 20, color: 'black', fontWeight: 'normal' }}
                            />
                        } 
                        keyExtractor={item => item.name} 
                        horizontal={false}
                        numColumns={3}
                    />
                </View>

                <View style={styles.bottomView}>
                    <CustomeButton onPress={() => this.onAddReasons()} style={{ marginBottom: 5 }}>Add Reason</CustomeButton>
                    <CustomeButton onPress={() => this.onSaveMood()}>Save Your Mood</CustomeButton>
                </View>
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
    imgMainMoodSelected: {
        height: 120,
        width: 120,
        margin: 3,
        resizeMode: 'stretch',
        borderRadius: 90
    },
    emotionsList: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgEmotion: {
        borderRadius: 90,
    },
    bottomView: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        paddingEnd: 20,
        paddingStart: 20,
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
})


export default MoodAdd;