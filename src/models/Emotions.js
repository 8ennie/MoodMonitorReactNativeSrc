


export default Emotions = [
    {
        name: "Angry",
        iconSource: require("../resources/images/angry_icon.png"),
        desc: "",
        response: (args) => {
            return args.mainMood
        }
    },
    {
        name: "Happy",
        iconSource: require("../resources/images/happy_smiley_icon.jpg"),
        desc: "",
        response: (args) => {
            console.log(args);
            
            return args.mainMood;
        }
    },
    {
        name: "Scared",
        iconSource: require("../resources/images/scared_icon.png"),
        desc: "",
        response: (args) => {
            return args.mood.mainMood
        }
    },
    {
        name: "Tired",
        iconSource: require("../resources/images/tired_icon.jpg"),
        desc: "",
        response: (args) => {
            if(args.mood.date.getHours() > 17){
                return "You are nearly ther, you survived most of the Day, just a little longer, you can do this!"
            }
        }
    },
    {
        name: "Sad",
        iconSource: require("../resources/images/sad_crying_icon.jpg"),
        desc: "",
        response: (args) => {
            return args.mainMood
        }
    },
    {
        name: "Stressed",
        iconSource: require("../resources/images/stressed_icon.jpg"),
        desc: "",
        response: (args) => {
            return args.mainMood
        }
    },
]
