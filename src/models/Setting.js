class Setting {
    
}

Setting.schema = {
    name: 'Setting',
    primaryKey: 'property',
    properties: {
        property: 'string',
        value: 'string'
    }
};

export default Setting