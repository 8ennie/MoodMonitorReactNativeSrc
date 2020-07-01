class Location {
    id;
    latitude;
    longitude;
    city;
    country;
}

Location.schema = {
    name: 'Location',
    primaryKey: 'id',
    properties: {
        id: 'int',
        latitude: 'string',
        longitude: 'string',
        city: 'string',
        country: 'string'
    }
};

export default Location