import Location from './Location';
import Weather from './Weather';
import { Reason } from './Reason';

const Realm = require('realm');

class Mood {
    static getRealm(){
        return new Realm({ schema: [Mood, Location, Weather, Reason] });
    }
}

Mood.schema = {
    name: 'Mood',
    primaryKey: 'id',
    properties: {
        id: 'int',
        date: 'date',
        mainMood: 'int',
        emotions: 'string?[]',
        note: 'string?',
        location: 'Location?',
        weather: 'Weather?',
        reasons: {type: 'Reason[]'}
    }
};

export default Mood