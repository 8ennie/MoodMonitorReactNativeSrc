class Mood {
    
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
    }
};

export default Mood