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

// Create a variable to reference the database.
var database = firebase.database();
var trainRef = firebase.database().ref('/trainScheduler');

trainRef.on("value", function (snapshot) {
    $("#trainScheduleArea").empty();

    // Loops through all of the children of snapshot (the employee objects, named as unique sessions)
    snapshot.forEach(function (childSnapshot) {
        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var first = childSnapshot.val().firstTime;
        var frequency = childSnapshot.val().frequency;
        var currentTime = moment(moment()).format("hh:mm");

    
        var timeArr = first.split(":");
        var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
        var maxMoment = moment.max(moment(), trainTime);
        var tMinutes;
        var arrivalTime;
      
        // If the first train is later than the current time, sent arrival to the first train time
        if (maxMoment === trainTime) {
          arrivalTime = trainTime.format("hh:mm A");
          tMinutes = trainTime.diff(moment(), "minutes");
        } else {
      
          // Calculate the minutes until arrival using hardcore math
          // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
          // and find the modulus between the difference and the frequency.
          var differenceTimes = moment().diff(trainTime, "minutes");
          var tRemainder = differenceTimes % frequency;
          tMinutes = frequency - tRemainder;
          // To calculate the arrival time, add the tMinutes to the current time
          arrivalTime = moment().add(tMinutes, "m").format("hh:mm A");
        }
        console.log("tMinutes:", tMinutes);
        console.log("arrivalTime:", arrivalTime);

        // var nextTrainPretty = moment.unix(nextTrain).format("hh:mm A");

        var tableRow = $("<tr>");
        var tableRow = tableRow.append(
            "<td>" + name + "</td>" +
            "<td>" + destination + "</td>" +
            "<td>" + frequency + "</td>" +
            "<td>" + arrivalTime + "</td>" +
            "<td>" + tMinutes + "</td>"
        );
        $("#trainScheduleArea").append(tableRow);

    });

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#submitTrain").on("click", function (event) {
    // prevent form from submitting
    event.preventDefault();

    var trainName = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTime = $("#firstTime-input").val().trim();
    var frequency = parseInt($("#freq-input").val().trim());

    if (trainName && destination && firstTime && frequency) {
        var train = {
            name: trainName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        }
        trainRef.push(train);

        //Clear all inputs
        $("input[type='text']").val("");
    }
    else {
        alert("You must enter all fields to submit!");
    }
});

$("#reset").on("click", function (event) {
    // prevent form from submitting
    event.preventDefault();

    trainRef.remove();
});