/*jslint browser: true*/
/*global $, jQuery*/

//var departure_id_new=0;
// arrival_id_new=0, airline_id_new=0, joinedDate=0;
var rootUrl = "http://comp426.cs.unc.edu:3001/";
var city;
$(document).ready(function() {
  $('#infoDiv').hide();
  $('#submitButton').on('click', function(e) {
    e.preventDefault();
    console.log("aaaaa");
    let first_name = $('#first_name').val();
    let last_name = $('#last_name').val();
    let age = $('#age').val();
    let gender= $('#gender').val();

    $.ajax(rootUrl + 'tickets?' + 'first_name=' +  encodeURI(first_name)+ '&last_name=' + encodeURI(last_name) + '&age=' + encodeURI(age) + '&gender=' + encodeURI(gender),
       {
            type: 'POST',
            //dataType: 'json',
            data: {
    "ticket": {
        "first_name": first_name,
        "last_name": last_name,
        "age": parseInt(age),
        "gender": gender,
        "is_purchased": true,
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
        let toAirport = $('#arriveAirport').val();

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
                      $('#resultsDiv').append("<table id='flightTable'> <thead> <tr id='headerRow'>  <th>Which One?</th>    <th>Airline</th> <th>Flight Number</th> <th>Departure Time</th> <th>Arrival Time</th> <th>Plane Model</th> </tr> </thead> <tbody> </tbody> <table>");
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
                            }
                          }).then(function(){
                var result = "<tr class='z-depth-3'><td><button class='waves-effect waves-light btn-small' id='select_"+number+"' data-flightnum="+parseInt(flightResults[number].number) +" onclick='selectFlight("+number+")'>Select this one</button></td><td>"+response[number].name+"</td><td>" +  parseInt(flightResults[number].number)  + "</td><td>" +flightResults[number].departs_at.toString().substring(11,16)+ "</td><td>" + flightResults[number].arrives_at.toString().substring(11,16) + "</td><td>"+ pid+"</td></tr>";
                console.log("hi");
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
