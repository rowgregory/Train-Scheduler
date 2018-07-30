
$(document).ready(function(){

var config = {
    apiKey: "AIzaSyDQzW_C0Rc1C-DB_cYeHOYxwJ7FzxSnjD4",
    authDomain: "my-first-project-1b19c.firebaseapp.com",
    databaseURL: "https://my-first-project-1b19c.firebaseio.com",
    projectId: "my-first-project-1b19c",
    storageBucket: "my-first-project-1b19c.appspot.com",
    messagingSenderId: "46693555852"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

$('.formInput').hide();

    $('#updateTrain').on('click', function() {

        $(".formInput").addClass('animated zoomOut');
        $('.formInput').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('.formInput').removeClass('animated zoomOut');
            $('.formInput').hide();
            
        });
    
        var newTrainSchedule = {
            trainName: $('#train-input').val(),
            trainDestination: $('#destination-input').val(),
            firstTrain: $('#first-train-input').val(),
            frequency: $('#frequency-input').val(),
        };
    database.ref('/new-train').push(newTrainSchedule);
    console.log(newTrainSchedule);

    $('#train-input').val('');
    $('#destination-input').val('');
    $('#first-train-input').val('');
    $('#frequency-input').val('');

    return false;

    
    })


  database.ref('/new-train').on("child_added", function(childSnapshot) {
    
    var name = childSnapshot.val().trainName;
    var dest = childSnapshot.val().trainDestination;
    var time = childSnapshot.val().firstTrain;
    var freq = childSnapshot.val().frequency;

    
    // convert the users frequency to an integer
    var freq = parseInt(freq); 
    // current time     
    var currentTime = moment().format("HH:mm")
    console.log("CURRENT TIME: " + currentTime)

    // converts the user's first train time input back one year to come before current time
    var dConvert = moment(time, 'HH:mm').subtract(1, 'years');
    console.log("DATE CONVERTED: " + dConvert);

    // saving format into new variable
    var trainTime = moment(dConvert).format('HH:mm');
    console.log("TRAIN TIME : " + trainTime);

    var tConvert = moment(trainTime, 'HH:mm').subtract(1, 'years');
    var tDiff = moment().diff(moment(tConvert), 'minutes');
    console.log("DIFFERENCE IN TIME: " + tDiff);

    // remainder
    var tRemainder = tDiff % freq;
    console.log("TIME REMAINING: " + tRemainder);

    // minutes until next train
    var minsAway = freq - tRemainder;
    console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);

    
    var nextTrain = moment().add(minsAway, 'minutes');
    console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));


	 		


    $("#full-schedule-list").append("<tr id='trainInfo'><td class='trainName'> " + name + "</td>" +
            "<td class='trainDestination'> " + dest + "</td>" +
            "<td class='frequency'> " + freq + " </td>" +
            "<td class='nextArrival'> " + moment(nextTrain).format('HH:mm A') + " </td>" + 
            "<td class='minutesAway'> " + minsAway + " </td>" + 
            "<td>" + "<input type='submit' value='remove' class='remove-train'>" + "</tr>");


  }), function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }


  $("#add-train-btn").on("click", function(event) {

	event.preventDefault();

	//$(".formInput").css('display', 'initial');
	$(".formInput").slideToggle();

});

$("body").on("click", ".remove-train", function(){
    
    $(this).closest ('tr').remove();
    getKey = $(this).parent().parent().attr('id');
    database.ref(getKey).remove();
    // $(this)
    //     .find('[data-fa-i2svg]')
    //     .toggleClass('fa-angle-down')
    //     .toggleClass('fa-angle-right');
});
})



  

  