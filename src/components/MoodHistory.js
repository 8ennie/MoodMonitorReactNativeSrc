import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import Mood from '../models/Mood';
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import CustomeDate from '../widgets/CustomeDate';



class MoodHistory extends Component {
    realm = Mood.getRealm();
    constructor(props) {
        super(props);

        this.state = {
            moods: this.realm.objects('Mood').sorted('date', true),
            startDate: null,
            endDate: null,
            displayedDate: moment()
        };
        this.realm.addListener('change', () => {
            this.setState({ moods: realm.objects('Mood').sorted('date', true) });
        });
       
    }

    setDates = dates => {
        console.log(dates);
        this.setState({
            ...dates
        });

        if (this.state.startDate && dates.endDate) {
            const startDate = this.state.startDate.toDate();
            this.setState({ moods: this.realm.objects('Mood').filtered('date > $0  AND date < $1', startDate, dates.endDate.toDate()).sorted('date', true) });
        }
    };

    componentWillUnmount() {
        this.realm.close();
    }



    render() {
        const { startDate, endDate, displayedDate } = this.state;
        const { navigation } = this.props;
        return (
            <View>
                <View style={{ alignItems: 'center' }}>
                    <DateRangePicker
                        onChange={this.setDates}
                        endDate={endDate}
                        startDate={startDate}
                        displayedDate={displayedDate}
                        range
                        maxDate={new Date()}
                    >
                        <View style={{ padding: 5 }}>
                            {(this.state.startDate ?
                                <View flexDirection="row">
                                    <Text style={styles.text}>Start Date:  </Text>
                                    {startDate ? <CustomeDate date={startDate.toDate()} style={styles.text}></CustomeDate> : null}
                                </View>
                                : null)
                            }
                            {(this.state.endDate ?
                                <View flexDirection="row">
                                    <Text style={styles.text}>End Date:  </Text>
                                    {endDate ? <CustomeDate date={endDate.toDate()} style={styles.text}></CustomeDate> : null}
                                </View>
                                : null)
                            }
                            {(!this.state.endDate || !this.state.startDate ?
                                <View flexDirection="row">
                                    <Text style={styles.changeDate}>Change Date</Text>
                                </View>
                                : null)
                            }
                        </View>

                    </DateRangePicker>
                </View>


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
            <CustomeDate date = {mood.date} style={styles.dateText} time/>
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
    },
    changeDate: {
        backgroundColor: "darkorange",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    dateText:{
        fontWeight:'normal',
        fontSize: 20
    }
})

export default MoodHistory;