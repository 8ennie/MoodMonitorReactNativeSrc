


export default Emotions = [
    {
        name: "Angry",
        iconSource: require("../resources/images/angry_icon.png"),
        desc: "",
        response: (args) => {
            if (Math.random() >= 0.5) {
                return "When you are Angry count to 10. If your very Angry count to 100. Then try it again."
            } else {
                return "In anger, humans lose all intelligents."
            }
        }
    },
    {
        name: "Happy",
        iconSource: require("../resources/images/happy_smiley_icon.jpg"),
        desc: "",
        response: (args) => {
            if (Math.random() >= 0.5) {
                return "Nothing in the world is as contagious as, happienes and laughter."
            } else {
                return "Be so happy that even others look at you, they also become happy."
            }
        }
    },
    {
        name: "Scared",
        iconSource: require("../resources/images/scared_icon.png"),
        desc: "",
        response: (args) => {
            if (Math.random() >= 0.5) {
                return "Scared? Good we don't grow when we stay inside our comfored zone."
            } else {
                return "It's ok to be scared. Being scared means you're about to do something really, really brave."
            }
        }
    },
    {
        name: "Tired",
        iconSource: require("../resources/images/tired_icon.jpg"),
        desc: "",
        response: (args) => {
            if (args.mood.date.getHours() > 17) {
                return "You are nearly there, you survived most of the Day, just a little longer, you can do this!"
            } else {
                return "Dont Stop when you're tired. Stop when you are DONE."
            }
        }
    },
    {
        name: "Sad",
        iconSource: require("../resources/images/sad_crying_icon.jpg"),
        desc: "",
        response: (args) => {
            if (Math.random() >= 0.5) {
                return "Every challenging situation you solve now, you dont have to face in the future."
            } else {
                return "Life is simple, if you are sad, smile. And if your happy, keep laughing."
            }
        }
    },
    {
        name: "Stressed",
        iconSource: require("../resources/images/stressed_icon.jpg"),
        desc: "",
        response: (args) => {
            if (args.mood.date.getHours() > 17) {
                return "Nothing brings us closer to our goals, then a break."
            } else {
                return "Best way to treat stress has two letters: NO."
            }
        }
    },
]
