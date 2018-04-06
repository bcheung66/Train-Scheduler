/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase

var config = {
  apiKey: "AIzaSyAr3UZarty1u-BaKTb4OENKVcJgE3kTePg",
  authDomain: "my-train-scheduler-c7592.firebaseapp.com",
  databaseURL: "https://my-train-scheduler-c7592.firebaseio.com",
  projectId: "my-train-scheduler-c7592",
  storageBucket: "my-train-scheduler-c7592.appspot.com",
  messagingSenderId: "1043749057677"
};

  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // Assume the following situations.
  
      // (TEST 1)
      // First Train of the Day is 3:00 AM
      // Assume Train comes every 3 minutes.
      // Assume the current time is 3:16 AM....
      // What time would the next train be...? (Use your brain first)
      // It would be 3:18 -- 2 minutes away
  
      // (TEST 2)
      // First Train of the Day is 3:00 AM
      // Assume Train comes every 7 minutes.
      // Assume the current time is 3:16 AM....
      // What time would the next train be...? (Use your brain first)
      // It would be 3:21 -- 5 minutes away
  
  
      // ==========================================================
  
      // Solved Mathematically
      // Test case 1:
      // 16 - 00 = 16
      // 16 % 3 = 1 (Modulus is the remainder)
      // 3 - 1 = 2 minutes away
      // 2 + 3:16 = 3:18
  
      // Solved Mathematically
      // Test case 2:
      // 16 - 00 = 16
      // 16 % 7 = 2 (Modulus is the remainder)
      // 7 - 2 = 5 minutes away
      // 5 + 3:16 = 3:21
  
      // Assumptions
      var tFrequency = 3;
  
      // Time is 3:30 AM
      var firstTime = "03:30";
  
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      //console.log(firstTimeConverted);
  
      // Current Time
      var currentTime = moment();
      //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      //console.log("DIFFERENCE IN TIME: " + diffTime);
  
      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      //console.log(tRemainder);
  
      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
  // 2. Button for adding Trains
  $("#add-train-btn").on("click", function (event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    //var trainFirstTrainStartTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
    var trainFirstTrainStartTime = $("#first-train-time-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      firstTrainTime: trainFirstTrainStartTime,
      frequency: trainFrequency
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);
  
    // Alert
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
  
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTrainStartTime = childSnapshot.val().firstTrainTime;
    var trainFrequency = childSnapshot.val().frequency;

    var trainArr =trainFirstTrainStartTime.split(':');
    var trainTime = moment().hours(trainArr[0]).minutes(trainArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    let tMinutes;
    let tArrival;

    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        let differentTimes = moment().diff(trainTime, "minutes");
        let tRamainder = differentTimes % trainFrequency;
        tMinutes = trainFrequency - tRemainder;
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
  
    // Prettify the train start time
    //  var trainStartPretty = moment.unix(trainFirstTrainStartTime).format("HH:mm");
    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var trainMonths = moment().diff(moment.unix(trainFirstTrainStartTime, "X"), "months");
    console.log(trainMonths);
  
    // Add each train's data into the table
   $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
    trainFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
  });
  