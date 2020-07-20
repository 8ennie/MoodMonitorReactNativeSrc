import Mood from "./Mood";

class Reason {

    static initialResponses() {
        return [
            "Family",
            "Frends",
            "Read a book",
            "Watched a movie"
        ]
    }


    static loadInitalReasons() {
        let realm = Mood.getRealm();
        realm.write(() => {
            this.initialResponses().forEach(element => {
                realm.create('Reason', { name: element })
            });
        });
        realm.close();
    }

    static save(reason) {
        let realm = Mood.getRealm();
        if (!realm.objectForPrimaryKey('Reason', reason)) {
            realm.write(() => {
                realm.create('Reason', { name: reason })
            });
            console.log('Saved new Reason (' + reason + ')');
        }
        realm.close();
        
    }

}

Reason.schema = {
    name: 'Reason',
    primaryKey: 'name',
    properties: {
        name: 'string',
        description: 'string?',
        moods: { type: 'linkingObjects', objectType: 'Mood', property: 'reasons' }
    }
};



export { Reason }