// Table and Form Functionality
var countrySelection = '';
var check = localStorage.getItem('city');
var rowCount = 0;
var bgArray = [];
var condition = '';

// Variables for subscribe
var fName = "";
var lName = "";
var uName = "";
var pass = "";
var email = "";
var validated = false;

if (check !== null) {
	reload();
}

$(document).ready(function () {
    $('.modal').modal();
	countryQuery();
	
});

function countryQuery() {
var queryCountry = 'https://api.airvisual.com/v2/countries?key=428d055e-12ec-4114-a299-ccbc373d0057';

	$.ajax({
		url: queryCountry,
		method: 'GET'
	}).then(function (respond) {
		var selectCountry = $("<option>").html("Select a country");
		var countryOptions = respond.data;
		for (var i = 0; i < respond.data.length; i++) {	
			var option = $("<option>").html(countryOptions[i].country);
			$('#country').append(selectCountry, option);
		}
	});
}

$('#country').on('click', function () {
	countrySelection = $('#country').val();
	$('#state').empty();
	$('#city').empty();

	var queryState =
		'https://api.airvisual.com/v2/states?country=' + countrySelection + '&key=428d055e-12ec-4114-a299-ccbc373d0057';

	$.ajax({
		url: queryState,
		method: 'GET'
	}).then(function (responss) {
		var selectState = $("<option>").html("Select a state/province");
		var stateOptions = responss.data;
		for (var j = 0; j < responss.data.length; j++) {
			var newOption = $("<option>").html(stateOptions[j].state);
			$('#state').append(selectState, newOption);
		}
	});
});

$('.subBtn').on('click', function(){
	fName = $('#first_name').val();
	lName = $('#last_name').val();
	uName = $('#username').val();
	pass = $('#password').val();
	email = $('#email').val();

	if (fName !== "" && lName !== "" && uName !== "" && pass !== "" && email !== "" && email.includes("@")) {
		$(".subBtn").attr("href", "#thanks");
		$(".subBtn").addClass("modal-close modal-trigger");
	};
});


$('#state').on('click', function () {
	var stateSelection = $('#state').val();
	$('#city').empty();
	var queryCity =
		'https://api.airvisual.com/v2/cities?state=' +
		stateSelection +
		'&country=' +
		countrySelection +
		'&key=428d055e-12ec-4114-a299-ccbc373d0057';

	$.ajax({
		url: queryCity,
		method: 'GET'
	}).then(function (re) {
		var selectCity = $("<option>").html("Select a city");
		var cityOptions = re.data;
		for (var k = 0; k < re.data.length; k++) {
			var newOptions = $("<option>").html(cityOptions[k].city);
			$('#city').append(selectCity, newOptions);
		}
	});
});

$('button').on('click', function (event) {
	event.preventDefault();
	var city = $('#city').val();
	var state = $('#state').val();
	var country = $('#country').val().toUpperCase();

	localStorage.setItem('city', city);
	localStorage.setItem('country', country);

	var queryURL =
		'https://api.airvisual.com/v2/city?city=' +
		city +
		'&state=' +
		state +
		'&country=' +
		country +
		'&key=428d055e-12ec-4114-a299-ccbc373d0057';
	var query2URL =
		'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8d0f0eb81eaa0bc62985265eed8c324c';

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).then(function (response) {
		var aqi = response.data.current.pollution.aqius;
		var tempC = response.data.current.weather.tp;
		var tempF = Math.round(tempC * 1.8 + 32);

		if (aqi > 150) {
			condition = 'Run for your life!';
		} else if (aqi <= 150 && aqi > 100) {
			condition = 'Bad';
		} else if (aqi <= 100 && aqi > 50) {
			condition = 'Fair';
		} else {
			condition = 'Good!';
		}
		localStorage.setItem('pollution', aqi);
		localStorage.setItem('temperature', tempF);
		localStorage.setItem('condition', condition);
	});

	$.ajax({
		url: query2URL,
		method: 'GET'
	}).then(function (resp) {
		var weatherDesc = resp.weather[0].description;
		var weather = resp.weather[0].icon;

		localStorage.setItem('weather', weatherDesc);
		localStorage.setItem('icon', weather);
	});
	setTimeout(reload, 1000);
});

function reload() {
	var weatherIcon = $('<img>').attr(
		'src',
		`https://openweathermap.org/img/wn/${localStorage.getItem('icon')}@2x.png`
	);

	bgArray.unshift(rowCount);
	rowCount++;

	var newRow = $(`<tr style="background-color: #bbdefb">`).append(
		$('<td>').css('textTransform', 'capitalize').text(localStorage.getItem('city')),
		$('<td>').text(localStorage.getItem('country')),
		$('<td>').text(localStorage.getItem('temperature')),
		$('<td>').text(localStorage.getItem('weather')),
		$('<td>').append(weatherIcon),
		$('<td>').text(localStorage.getItem('pollution')),
		$(`<td id=row${bgArray[0]}>`).text(localStorage.getItem('condition'))
	);

	$('#display').append(newRow);

	var storageAqi = localStorage.getItem('pollution');

	if (storageAqi > 150) {
		$(`#row${bgArray[0]}`).css('background-color', '#c62828');
	} else if (storageAqi <= 150 && storageAqi > 100) {
		$(`#row${bgArray[0]}`).css('background-color', '#ffb74d');
	} else if (storageAqi <= 100 && storageAqi > 50) {
		$(`#row${bgArray[0]}`).css('background-color', '#ffeb3b');
	} else {
		$(`#row${bgArray[0]}`).css('background-color', '#8bc34a');
	};
	$("#country").empty();
	$('#state').empty();
	$('#city').empty();
	countryQuery();
};
