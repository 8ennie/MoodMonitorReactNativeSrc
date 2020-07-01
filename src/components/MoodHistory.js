import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import Mood from '../models/Mood';
import Weather from '../models/Weather';
import Location from '../models/Location';


class MoodHistory extends Component {
    realm = new Realm({ schema: [Mood, Location, Weather] });
    constructor(props) {
        super(props);
        
        this.state = {
            moods: this.realm.objects('Mood'),
        };
        this.realm.addListener('change', () => {
            this.setState({ moods: realm.objects('Mood') });
        });

    }

    componentWillUnmount(){
        this.realm.close();
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.menu}>
                <Text
                    style={styles.header}
                >Old Moods</Text>
                <FlatList
                    style={{ height: 150 }}
                    number={2}
                    data={this.state.moods}
                    renderItem={({ item }) => <ListItem mood={item} navigation={navigation} />}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        );
    }
}



function getMainMoodImage(mainMood) {
    if (mainMood == 1) {
        return require('../resources/images/sad_icon.png');
    } else if (mainMood == 2) {
        return require('../resources/images/normal_icon.png');
    } else if (mainMood == 3) {
        return require('../resources/images/happy_icon.png');
    }
}

function ListItem({ mood, navigation }) {

    return (
        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ShowMood', { moodId: mood.id })} >
            <Text style={styles.title}>{mood.date.getDate() + "/" + (mood.date.getMonth() + 1) + "/" + mood.date.getFullYear() +
                " (" + mood.date.getHours() + ":" + mood.date.getMinutes() + ")"}</Text>
            <Image
                style={styles.img}
                source={getMainMoodImage(mood.mainMood)}
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


    }
})

export default MoodHistory;