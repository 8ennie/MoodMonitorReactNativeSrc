class Setting {
   
}
const Realm = require('realm');
Setting.schema = {
    name: 'Setting',
    primaryKey: 'property',
    properties: {
        property: 'string',
        value: 'string'
    }
};

function preloadSettings() {
    
    realm = new Realm({ schema: [Setting] });
    realm.write(() => {
        realm.create('Setting', {property: 'moodResponseEnabled', value: 'true'})
    });
} 

export {Setting, preloadSettings }