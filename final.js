/*jslint browser: true*/
/*global $, jQuery*/

var departure_id_new, arrival_id_new, airline_id_new, joinedDate;
var rootUrl = "http://comp426.cs.unc.edu:3001/";

$(document).ready(function() {
    
    //puts value into joinedDate, depature_id_new, arrival_id_new
    $('#submitButton').on('click', function() {
        let fromAirport = $('#departAirport').val();
        let toAirport = $('#arriveAirport').val();
        
        let pickedAirline = $('#airlineType').val();
        
        let fromYear = $('#departYear').val();
        let fromMonth = $('#departMonth').val();
        let fromDay = $('#departDay').val();
        let fromTime = $('#departTime').val();
        joinedDate = fromYear + '-' + fromMonth + '-' + fromDay + 'T' + fromTime + ':00.000Z';
        
        //puts value into departure_id_new
        findAirportDepartureId(fromAirport);
        
        //puts value into arrival_id_new
        findAirportArrivalId(toAirport);
        
        //puts value into airline_id_new
        findAirlineId(pickedAirline);
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
let findAirportDepartureId = (aDI) => {
    $.ajax(rootUrl + 'airports?' + 'filter[name]=' + encodeURI(aDI), 
           {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                        departure_id_new = response[0].id;
                }
           });
}

//function returns airport arrival_id 
let findAirportArrivalId = (aAI) => {
    $.ajax(rootUrl + 'airports?' + 'filter[name]=' + encodeURI(aAI), 
           {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                        arrival_id_new = response[0].id;
                }
           });
}

//function returns airline_id_new
let findAirlineId = (alId) => {
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

//function to create confirmed flights; params id, arrive time
let createFlightPlan = (flightId, aT) => {
    $('#confirmationDiv').append("<p>" + aT + "</p>");
}
