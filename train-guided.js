var firebaseConfig = {
    apiKey: "AIzaSyAN0rF4c98vEqv9OK7bp_7P_NA21HfvHnA",
    authDomain: "bootcamp-e2723.firebaseapp.com",
    databaseURL: "https://bootcamp-e2723-default-rtdb.firebaseio.com",
    projectId: "bootcamp-e2723",
    storageBucket: "bootcamp-e2723.appspot.com",
    messagingSenderId: "858706631830",
    appId: "1:858706631830:web:8f0d12fb557d910dd7f6b7",
    measurementId: "G-4ERS3TK9RL"
};

firebase.initializeApp(firebaseConfig);

var trainRef = firebase.database().ref('/trainScheduler-guided');

$("#submitTrain").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = moment($("#firstTime-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = parseInt($("#freq-input").val().trim());

    console.log(firstTrain);

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency
    };

    trainRef.push(newTrain);

    alert("Train Added!");

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTime-input").val("");
    $("#freq-input").val("");

    return false;
});

trainRef.on("child_added", function (snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var firstTrain = snapshot.val().firstTrain;
    var frequency = snapshot.val().frequency;

    var remainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, "m").format("hh:mm A");

    console.log(remainder);
    console.log(minutes);
    console.log(arrival);

    $("#trainScheduleArea").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");
});