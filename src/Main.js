import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import MoodAdd from './components/MoodAdd';
import MoodHistory from './components/MoodHistory';
import Settings from './components/Settings';
import ShowMood from './components/ShowMood';
import AddReason from './components/AddReason';
import MoodAnalysis from './components/MoodAnalysis';
import MoodResponse from './components/MoodResponse';

const Stack = createStackNavigator();

class Main extends Component {

    Main() {
        Stack = createStackNavigator();
    }
    

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName='Home'
                    screenOptions={{
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: 'orange',
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
                        options={{ title: 'Mood Monitor' }}
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
                    <Stack.Screen
                        name="MoodAnalysis"
                        component={MoodAnalysis}
                        options={{ title: 'Moods Analysis' }}
                    />
                    <Stack.Screen
                        name="MoodResponse"
                        component={MoodResponse}
                        options={{ title: 'Moods Response', headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>

        );
    }
}


export default Main;