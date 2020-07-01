import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import MoodAdd from './components/MoodAdd';
import MoodHistory from './components/MoodHistory';
import Mood from './models/Mood';
import Settings from './components/Settings';
import ShowMood from './components/ShowMood';
import AddReason from './components/AddReason';
import Location from './models/Location';
import Weather from './models/Weather';


const Realm = require('realm');
const Stack = createStackNavigator();


class Main extends Component {


    Main(){
        Stack = createStackNavigator();
    }
    constructor() {
        super();
        this.state = { realm: null };
    }

    componentWillUnmount() {
        // Close the realm if there is one open.
        const { realm } = this.state;
        if (realm !== null && !realm.isClosed) {
            realm.close();
        }
    }
    componentDidMount() {
        Realm.open({
            schema: [Mood, Location, Weather]
        }).then(realm => {
            this.setState({ realm });
        });
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName='Home'
                    screenOptions={{
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: '#621FF7',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ title: 'Home' }}
                    />
                    <Stack.Screen
                        name="MoodAdd"
                        component={MoodAdd}
                        options={{ title: 'Create New Mood' }}
                    />
                    <Stack.Screen
                        name="MoodHistory"
                        component={MoodHistory}
                        options={{ title: 'Mood History' }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={Settings}
                        options={{ title: 'Settings' }}
                    />
                    <Stack.Screen
                        name="ShowMood"
                        component={ShowMood}
                        options={{ title: 'Show Mood' }}
                    />
                    <Stack.Screen
                        name="AddReason"
                        component={AddReason}
                        options={{ title: 'Add Reasons' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>

        );
    }
}


export default Main;