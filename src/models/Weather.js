class Weather {
    id;
    clouds;
    rain;
    icon;
    description;
    temperatur;
    sunrise;
    sunset;
}

Weather.schema = {
    name: 'Weather',
    primaryKey: 'id',
    properties: {
        id: 'int',
        clouds: 'int',
        rain: 'float?',
        icon: 'string',
        description: 'string',
        temperatur: 'int',
        sunrise: 'date',
        sunset: 'date'
    }
};

export default Weather