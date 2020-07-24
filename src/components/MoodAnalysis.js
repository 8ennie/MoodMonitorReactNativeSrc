import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native'
import Mood from '../models/Mood';
import ExpandPanel from '../widgets/ExpandPanel';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Emotions from '../models/Emotions';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import ModalSelector from 'react-native-modal-selector';
import { SafeAreaView } from 'react-native-safe-area-context';


class MoodAnalysis extends Component {

    realm = Mood.getRealm();
    constructor(props) {
        super(props);

        this.state = {
            moods: this.realm.objects('Mood'),
            reasonMoods: []
        };
        this.realm.addListener('change', () => {
            this.setState({ moods: this.realm.objects('Mood') });
        });
        Geolocation.getCurrentPosition(info => {
            this.setState({ currentLocation: { latitude: info.coords.latitude, longitude: info.coords.longitude } });
        });
    }

    componentWillUnmount() {
        this.realm.close();
    }
    render() {
        return (
            <View>
                <SafeAreaView>
                    <ScrollView>
                        {this.states()}
                        {this.location()}
                        {this.reasons()}
                    </ScrollView>
                </SafeAreaView>

            </View>
        );
    }

    avgMoods(allMoods) {
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

    mood() {
        
        var moods = this.avgMoods(this.realm.objects('Mood').sorted('date'));

        return (
            <View>
                <LineChart
                    data={{
                        labels: moods.map(m => (m.date.getDate() + "/" + (m.date.getMonth() + 1) + "/" + m.date.getFullYear())),
                        datasets: [
                            {
                                data: moods.map(m => m.avgMood)
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width - 20} // from react-native
                    height={220}
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginHorizontal: 10,
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>
        );
    }

    states() {
        const moods = this.state.moods;
        return (
            <ExpandPanel title="Statistics">
                <View style={{ alignItems: 'center' }}>
                    {this.moodStates()}
                    {this.emotionalStates()}
                </View>
            </ExpandPanel>
        )
    }

    moodStates() {
        const moods = this.state.moods;
        const data = [
            {
                name: "(" + (Math.round(((moods.filter(m => m.mainMood == 3).length) * 100) / moods.length) + "%)  Good"),
                population: moods.filter(m => m.mainMood == 3).length,
                color: "rgba(0, 179, 44, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "(" + (Math.round(((moods.filter(m => m.mainMood == 2).length) * 100) / moods.length) + "%)  Normal"),
                population: moods.filter(m => m.mainMood == 2).length,
                color: "rgba(217, 217, 33, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "(" + (Math.round(((moods.filter(m => m.mainMood == 1).length) * 100) / moods.length) + "%)  Bad"),
                population: moods.filter(m => m.mainMood == 1).length,
                color: "rgba(216, 31, 42, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        ]
        return (
            <View>
                <ExpandPanel title="Mood">
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            <Text>Total Amount of Moods: {moods.length}</Text>
                        </View>

                        <PieChart
                            data={data}
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            chartConfig={{
                                backgroundColor: "#e26a00",
                                backgroundGradientFrom: "#fb8c00",
                                backgroundGradientTo: "#ffa726",
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />

                    </View>

                </ExpandPanel>
            </View>
        );
    }

    emotionalStates() {
        const moods = this.state.moods;
        var emotionStates = []
        Emotions.forEach(em => {
            emotionStates.push({ name: em.name, amount: moods.filter(m => m.emotions.map(e => e).includes(em.name)).length });
        });
        const data = {
            labels: emotionStates.map(emS => emS.name),
            datasets: [
                {
                    data: emotionStates.map(emS => emS.amount)
                }
            ]
        };
        return (
            <View>
                <ExpandPanel title="Emotions">
                    <View>

                        {/* <View style={{ alignItems: 'center' }}>
                            {emotionStates.map(emS => {
                                return (
                                    <Text key={emS.name}>
                                        {emS.name}: {emS.amount}
                                    </Text>
                                )
                            })}
                        </View> */}

                        <BarChart
                            style={{ padding: 5 }}
                            data={data}
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            chartConfig={{
                                backgroundColor: "#e26a00",
                                backgroundGradientFrom: "#fb8c00",
                                backgroundGradientTo: "#ffa726",
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            }}
                        />
                    </View>
                </ExpandPanel>
            </View>
        );
    }

    location() {

        if (this.state.currentLocation && this.state.moods.length > 0) {
            return (
                <ExpandPanel title="Locations">
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
                                    return (
                                        <Marker
                                            key={mood.id}
                                            coordinate={{ latitude: parseFloat(mood.location.latitude), longitude: parseFloat(mood.location.longitude) }}
                                        >
                                            <Image
                                                style={styles.moodImg}
                                                source={this.mainMoodImg(mood.mainMood)}
                                            />
                                        </Marker>
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

    reasons() {
        let data = Mood.getRealm().objects('Reason').map(r => {
            return { key: r.name, label: r.name }
        });
        const moods = this.state.reasonMoods;
        const avgMoods = this.avgMoods(moods);
        let emotionData = [];
        if (moods.length > 0) {
            var emotionStates = []
            Emotions.forEach(em => {
                emotionStates.push({ name: em.name, amount: moods.filter(m => m.emotions.map(e => e).includes(em.name)).length });
            });
            emotionData = emotionStates.map(emotion => {
                return ({
                    name: emotion.name,
                    population: emotion.amount,
                    color: '#' + parseInt(Math.random() * 0xffffff).toString(16),
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                });
            });
        }

        return (
            <ExpandPanel title="Reasons">
                <View>
                    <ModalSelector
                        data={data}
                        initValue={"Select a Reason!"}
                        onModalClose={(item) => this.reasonChange(item)}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 20, borderWidth: 1, borderRadius: 15, marginHorizontal: 15, paddingVertical: 5 }}>{this.state.reason ? this.state.reason : "Choose a Reason"}</Text>
                    </ModalSelector>
                    {
                        (avgMoods.length > 0) ?
                            (
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Mood Avg</Text>
                                    <LineChart
                                        data={{
                                            labels: avgMoods.map(m => (m.date.getDate() + "/" + (m.date.getMonth() + 1) + "/" + m.date.getFullYear())),
                                            datasets: [
                                                {
                                                    data: avgMoods.map(m => m.avgMood)
                                                }
                                            ]
                                        }}
                                        width={Dimensions.get("window").width - 20} // from react-native
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: "#e26a00",
                                            backgroundGradientFrom: "#fb8c00",
                                            backgroundGradientTo: "#ffa726",
                                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                            style: {
                                                borderRadius: 16
                                            },
                                            propsForDots: {
                                                r: "6",
                                                strokeWidth: "2",
                                                stroke: "#ffa726"
                                            }
                                        }}
                                        bezier
                                        style={{
                                            marginHorizontal: 10,
                                            marginVertical: 8,
                                            borderRadius: 16
                                        }}
                                    />
                                </View>

                            )
                            : null
                    }
                    {
                        (moods.length > 0) ?
                            (
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Emotions</Text>
                                    <PieChart
                                        data={emotionData}
                                        width={Dimensions.get("window").width - 20} // from react-native
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: "#e26a00",
                                            backgroundGradientFrom: "#fb8c00",
                                            backgroundGradientTo: "#ffa726",
                                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        }}
                                        accessor="population"
                                        backgroundColor="transparent"
                                        paddingLeft="15"
                                        absolute
                                    />
                                </View>
                            )
                            : null
                    }
                </View>
            </ExpandPanel>
        );
    }
    reasonChange(reason) {
      
        if(reason.key){
            this.setState({ reasonMoods: this.realm.objectForPrimaryKey('Reason', reason.key).moods.sorted('date'), reason: reason.key })
        }
    }
    mainMoodImg(mood) {
        if (mood == 1) {
            return require('../resources/images/sad_icon.png');
        } else if (mood == 2) {
            return require('../resources/images/normal_icon.png');
        } else if (mood == 3) {
            return require('../resources/images/happy_icon.png');
        }
    }

}


const styles = StyleSheet.create({
    moodImg: {
        width: 30,
        height: 30,
        borderRadius: 90,
        marginStart: 5
    },
})

export default MoodAnalysis;