/*jslint browser: true*/
/*global $, jQuery*/

//var departure_id_new=0;
// arrival_id_new=0, airline_id_new=0, joinedDate=0;
var rootUrl = "http://comp426.cs.unc.edu:3001/";
var city;


$(document).ready(function() {

  function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          console.log(val);
          console.log(arr[i]);
          if (arr[i].toLowerCase().includes(val.toLowerCase())) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  var airports =[];
  $.ajax(rootUrl + 'airports?',
         {
              type: 'GET',
              dataType: 'json',
              xhrFields: {withCredentials: true},
              success: (response) => {
                     //console.log(response);
                    for(var a =0; a<response.length;a++){
                      airports[a]=response[a].name + ' (' + response[a].code + ')';
                    }
                    console.log(airports);
                      autocomplete(document.getElementById("departAirport"), airports);
                        autocomplete(document.getElementById("arriveAirport"), airports);
              }
         });


  /*An array containing all the country names in the world:*/


  /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/

  $('#infoDiv').hide();
  $('select').formSelect();
  $('#submitButton').on('click', function(e) {
    e.preventDefault();
    console.log("aaaaa");
    let first_name = $('#first_name').val();
    let last_name = $('#last_name').val();
    let age = $('#age').val();
    let gender= $("input[name='gender']:checked").attr('id');


    $.ajax(rootUrl + 'tickets?' + 'first_name=' +  encodeURI(first_name)+ '&last_name=' + encodeURI(last_name) + '&age=' + encodeURI(age) + '&gender=' + encodeURI(gender),
       {
            type: 'POST',
            dataType: 'json',
            data: {
    "ticket": {
        "first_name": first_name,
        "last_name": last_name,
        "age": parseInt(age),
        "gender": gender,
        "is_purchased": "true",
    }
},

            xhrFields: {withCredentials: true},
            success: (response) => {
                    console.log('success!');
                    $('#infoDiv').hide();

                    $.get("http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=962b8524d03d93b4c38d49b00d0002cf",function(data){

                       //{
                          //  type: 'GET',
                          //  dataType: 'json',
                          //  xhrFields: {withCredentials: true},
                          //  success: (response) => {
                          console.log(data);
                          var city = data.name;
                          //((K-273.15)*1.8)+32
var temp = Math.round(((data.main.temp -273.15) / 1.8) + 32);
$('#confirmationDiv').append("Your trip is booked! We hope you have a great vacation!");
$(weatherDiv).append('city:'+city + ' ' + 'temp: ' + temp);
$(weatherDiv).append(' <div class="row"> <div class="col s12 m6">  <div class="card blue-grey darken-1"> <div class="card-content white-text"> <span class="card-title">Current Weather Conditions</span>'
        + '<p>The current weather at your destination is: '+ temp +' degrees F </p>  </div> </div> </div> </div>');

                                console.log('hello');
                          //  }
                    //   });

          //  }
       });
       }

  });
});
    //puts value into joinedDate, depature_id_new, arrival_id_new

    $('#searchButton').on('click', function() {
        let fromAirport = $('#departAirport').val();
        var abbreviation = fromAirport.split('(');
        fromAirport = abbreviation[1].substring(0,3);
        console.log(fromAirport);
        let toAirport = $('#arriveAirport').val();
        var abbreviation1 = toAirport.split('(');
        toAirport = abbreviation1[1].substring(0,3);
        let pickedAirline = $('#airlineType').val();
        console.log("FROM: " + fromAirport);
          console.log("TO: " +toAirport);
        // let fromYear = $('#departYear').val();
        // let fromMonth = $('#departMonth').val();
        // let fromDay = $('#departDay').val();
        // let fromTime = $('#departTime').val();
      //  console.log(toAirport);
      //  console.log(fromAirport);
        // joinedDate = fromYear + '-' + fromMonth + '-' + fromDay + 'T' + fromTime + ':00.000Z';

        //puts value into departure_id_new
        findAirportDepartureId(fromAirport,toAirport);

        //console.log(departure_id_new);
        //puts value into arrival_id_new
        //findAirportArrivalId(toAirport);

        //puts value into airline_id_new
        //findAirlineId(pickedAirline);
        //  console.log("done");
      //  console.log("here: " + departure_id_new);

      //  insertIntoResultsDiv(departure_id_new);

    });

    //leads to confirmation page, create flight options
    $('#continueButton').on('click', function() {
        $('#reserveDiv').hide();

        $.ajax(rootUrl + 'flights?' + 'filter[departs_at]=' + encodeURI(joinedDate) + '&filter[departure_id]=' + encodeURI(departure_id_new) + '&filter[arrival_id]=' + encodeURI(arrival_id_new) + '&filter[airline_id]=' + encodeURI(airline_id_new),
           {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                        for(var i = 0; i < response.length; i++) {
                            createFlightPlan(response[i].id, response[i].arrives_at);
                        }
                }
           });

    });
});

//helper functions --------------------------------------------

//function returns airport departure_id
function findAirportDepartureId(aDI,aAI) {
  //console.log("start");
  var dID = 0;
  var aID = 0;
  if(aDI.length!=3){

//console.log("lengthjfdsl");
    $.ajax(rootUrl + 'airports?' + 'filter[name]=' + encodeURI(aDI),
           {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                       console.log(response);

                }
           });
         }
         else{

           //return 10;
           aDI = aDI.toUpperCase();
          // console.log(aDI);
           $.ajax(rootUrl + 'airports?' + 'filter[code]=' + encodeURI(aDI),
                  {
                       type: 'GET',
                       dataType: 'json',
                       xhrFields: {withCredentials: true},
                       success: (response) => {
                          //     console.log("depature id: " + response[0].id);
                              // console.log(response[0].id);
                               dID =  response[0].id;
                               aAI = aAI.toUpperCase();
                               $.ajax(rootUrl + 'airports?' + 'filter[code]=' + encodeURI(aAI),
                                      {
                                           type: 'GET',
                                           dataType: 'json',
                                           xhrFields: {withCredentials: true},
                                           success: (response) => {
                                             console.log(response.length);
                                                if(response === undefined || response.length == 0){
                                                    $('#resultsDiv').empty();
                                                      $('#resultsDiv').append("No Results");
                                                      return;
                                                }
                                                   aID =  response[0].id;
                                                   city =response[0].city;


                                           },


                                      }).then(function(response){
                                        console.log("aid: " + aID);
                                        console.log("did: " + dID);
                                        if(aID!=0 && dID !=0){
                                        insertIntoResultsDiv(dID,aID);
                                      }

                                        return;
                                      });

                       }
                  }).then(function(response) {



  }


                  );
         }


      //   return id;
}

//function returns airport arrival_id
let findAirportArrivalId = (aAI) => {
  if(aAI.length!=3){
    $.ajax(rootUrl + 'airports?' + 'filter[name]=' + encodeURI(aAI),
           {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                //  console.log(response);
                        arrival_id_new = response[0].id;
                }
           });
         }
         else{
           aAI = aAI.toUpperCase();
           $.ajax(rootUrl + 'airports?' + 'filter[code]=' + encodeURI(aAI),
                  {
                       type: 'GET',
                       dataType: 'json',
                       xhrFields: {withCredentials: true},
                       success: (response) => {
                      //   console.log("reeee");
                        //       console.log(response);
                               arrival_id_new = response[0].id;
                       }
                  });
         }
}

//function returns airline_id_new
/*
let findAirlineId = (alId) => {
  console.log(alId);
  $.ajax(rootUrl + 'airlines?' + 'filter[name]=' + encodeURI(alId),
           {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                        airline_id_new = response[0].id;
                }
           });
}
*/
//function to create confirmed flights; params id, arrive time
let createFlightPlan = (flightId, aT) => {
    $('#confirmationDiv').append("<p>" + aT + "</p>");
}
function insertIntoResultsDiv(depart,arrive){

    var flightResults;
    console.log(depart);
    console.log(arrive);
  $.ajax(rootUrl + 'flights?' + 'filter[departure_id]=' + depart +'&filter[arrival_id]='+arrive ,
         {
              type: 'GET',
              dataType: 'json',
              xhrFields: {withCredentials: true},
              success: (response) => {
console.log('flights?filter[departure_id]=' + depart + 'filter[arrival_id]='+arrive);
                flightResults = response;
              //  console.log(response);

              //  console.log("ee");
              //  console.log(response[0]);
                    //  arrival_id_new = response[0].id;

                    $('#resultsDiv').empty();
                      $('#resultsDiv').append("<table id='flightTable'> <thead> <tr id='headerRow'>  <th>Which One?</th>    <th>Airline</th> <th>Flight Number</th> <th>Departure Time</th> <th>Arrival Time</th> <th>Plane Model</th> <th>View Seatmap</th> </tr> </thead> <tbody> </tbody> <table>");
                      for(var i=0;i<flightResults.length;i++){
                getAirline(parseInt(response[i].plane_id),flightResults,i);
              }
              //  var result = "<tr><td>"++"/td><td>" +  parseInt(flightResults[0].number)  + "</td><td>" +flightResults[0].departs_at.toString().substring(11,16)+ "</td><td>" + flightResults[0].arrives_at.toString().substring(11,16) + "</td></tr>";
              }
         }).then(function(){



            // $('#flightTable tbody').append(result);
         });
         /*


  $('#resultsDiv').append("<table id='flightTable'> <tr id='headerRow'> <th>Flights</th> <th>Departure Airport</th> <th>Arrival Airport</th> <th>Airline</th> </tr> <table>");
  $("  <tr> <td>Jill</td> <td>Smith</td>  <td>50</td> <td>50</td> </tr>").insertAfter($('#headerRow'));
    $("  <tr> <td>Jill</td> <td>Smith</td>  <td>50</td> <td>50</td> </tr>").insertAfter($('#headerRow'));

      $("  <tr> <td>Jill</td> <td>Smith</td>  <td>50</td> <td>50</td> </tr>").insertAfter($('#headerRow'));
        $("  <tr> <td>Jill</td> <td>Smith</td>  <td>50</td> <td>50</td> </tr>").insertAfter($('#headerRow'));
*/
}
function getPlane(){

}

function getAirline(airlineID,flightResults,number,planeID){
  //console.log("hhh");
  var pid=0;
  var seatLink;
  $.ajax(rootUrl + 'airlines?' + 'filter[id]=' + airlineID,
         {
              type: 'GET',
              dataType: 'json',
              xhrFields: {withCredentials: true},
              success: (response) => {
                $.ajax(rootUrl + 'planes?' + 'filter[id]=' + planeID,
                       {
                            type: 'GET',
                            dataType: 'json',
                            xhrFields: {withCredentials: true},
                            success: (response) => {

                              pid = response[number].name;
                              seatLink = response[number].seatmap_url;
                            }
                          }).then(function(){
                var result = "<tr class='z-depth-3'><td><button class='waves-effect waves-light btn-small' id='select_"+number+"' data-flightnum="+parseInt(flightResults[number].number) +" onclick='selectFlight("+number+")'>Select this one</button></td><td>"+response[number].name+"</td><td>" +  parseInt(flightResults[number].number)  + "</td><td>" +flightResults[number].departs_at.toString().substring(11,16)+ "</td><td>" + flightResults[number].arrives_at.toString().substring(11,16) + "</td><td>"+ pid+"</td><td>"+ "<a class='waves-effect waves-light modal-trigger' href='"+seatLink+"'><i class='material-icons'>airline_seat_legroom_normal</i></a>";
//<a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
                console.log("hi");
                 $('.modal').modal();
                 $('#flightTable tbody').append(result);
              //  console.log(response);

              //  console.log("ee");
              //  console.log(response[0]);
                    //  arrival_id_new = response[0].id;
            });

         }
       });
}
function selectFlight(flightNum){
  console.log(flightNum);
  console.log($('#select_'+flightNum).data("flightnum"));
 $('#reserveDiv').hide();
  $('#resultsDiv').hide();
  $('#myHeader').hide();
  $('#infoDiv').show();
}
