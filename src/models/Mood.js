class Mood {
    
}

Mood.schema = {
    name: 'Mood',
    primaryKey: 'id',
    properties: {
        id: 'int',
        date: 'date',
        mainMood: 'int',
        moods: 'int?[]',
        note: 'string?',
        location: 'Location',
        weather: 'Weather',
    }
};

export default Mood