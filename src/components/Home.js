import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native'
import Mood from '../models/Mood';
import Weather from '../models/Weather';
import Location from '../models/Location';
import MenuButton from '../widgets/MenuButton';

const Realm = require('realm');

class Home extends Component {

    realm = new Realm({ schema: [Mood, Location, Weather] });
    constructor(props) {
        super(props);
        this.state = {
            moods: this.avgMoods(),
        };
        this.realm.addListener('change', () => {
            this.setState({ moods: this.avgMoods() });
        });

    }

    componentWillUnmount() {
        this.realm.close();
    }
    avgMoods() {
        let allMoods = this.realm.objects('Mood').sorted('date');
        let avgMoods = [];
        let oldDate = new Date().getTime();
        let count = 0;
        let avgMood = 0;
        allMoods.forEach(mood => {
            let date = mood.date.setHours(0, 0, 0, 0);
            if (oldDate == date) {
                avgMood = avgMood + mood.mainMood;
                count++;
            } else {
                if (count != 0) {
                    avgMoods.push({ date: new Date(oldDate), avgMood: (avgMood / count) });
                }
                avgMood = mood.mainMood;
                count = 1;
                oldDate = date;
            }
        });
        if (count != 0) {
            avgMoods.push({ date: new Date(oldDate), avgMood: (avgMood / count) });
        }
        return avgMoods;
    }

    render() {
        const { navigation } = this.props;
        return (
            <View >
                <View style= {{flexDirection:'row', justifyContent:'space-around', marginVertical:20}}>
                    <MenuButton
                        lable="Add Mood"
                        imageSource={require('../resources/images/add_mood.png')}
                        onPress={() => navigation.navigate('MoodAdd')}
                        imageStyle={{borderRadius:0}}
                    />
                    <MenuButton
                        lable="History"
                        imageSource={require('../resources/images/history_icon.png')}
                        onPress={() => navigation.navigate('MoodHistory')}
                    />
                </View>
                <View style= {{flexDirection:'row', justifyContent:'space-around'}}>
                <MenuButton
                        lable="Analysis"
                        imageSource={require('../resources/images/analysis_icon.png')}
                        onPress={() => navigation.navigate('MoodAnalysis')}
                    />
                    <MenuButton
                        lable="Settings"
                        imageSource={require('../resources/images/settings_icon.png')}
                        onPress={() => navigation.navigate('Settings')}
                    />
                </View>


                <View style={styles.menu}>
                    <Text
                        style={styles.header}
                    >Avg Moods last days</Text>
                    <FlatList
                        style={{ height: 150 }}
                        number={2}
                        data={this.state.moods}
                        renderItem={({ item }) => <ListItem mood={item} />}
                        keyExtractor={item => item.date.toString()}
                    />
                </View>
            </View>
        );
    }


}



function getMainMoodImage(avgMood) {
    if (avgMood <= 1 + (2 / 3)) {
        return require('../resources/images/sad_icon.png');
    } else if (avgMood <= 1 + 2 * (2 / 3)) {
        return require('../resources/images/normal_icon.png');
    } else if (avgMood <= 3) {
        return require('../resources/images/happy_icon.png');
    }
}

function ListItem({ mood }) {

    return (
        <TouchableOpacity style={styles.listItem}>
            <Text style={styles.title}>{mood.date.getDate() + "/" + (mood.date.getMonth() + 1) + "/" + mood.date.getFullYear()}</Text>
            <Text>{mood.avgMood}</Text>
            <Image
                style={styles.img}
                source={getMainMoodImage(mood.avgMood)}
            />
        </TouchableOpacity>
    );
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
    },
    img: {
        height: 25,
        width: 25,
        borderRadius: 90
    },
    listItem: {
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
        borderColor: 'gray',
        borderWidth: 1,
        flexDirection: 'row',


    },
})


export default Home;