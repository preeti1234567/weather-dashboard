// we create a constant for local_storage_key 
const LOCAL_STORAGE_KEY = 'cities';

// we create a const for API_KEY
const API_KEY = "73671fcb30692ec0371f08494dfbbe54";

// this code will run once the entire page is ready, not just the DOM only  
$(document).ready(function () {    

    // creating variable data for local storage
    var data;    

    // function searchCity is called on click event of searchBtn
    $("#searchBtn").on("click", searchCity);

    //  function searchCity is presented with list of instruction
    function searchCity() {
 
        // input from the search box is stored in a variable called city
        var city = $("#inputSearchBox").val().trim();
  
        //we creating a queryURL for the openweathermap.api for the city selected or from the input by a user
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + API_KEY;

        //called ajax to get the server side request        
        $.ajax({
                url: queryURL,
                method: "GET"
            })
 
            // it gives the response and pass as an argument in the function which do the rest of the instruction
            .then(function (response) {
  
                //created cityPresent variable as false
                var cityPresent = false;


                // creating a foreach loop to check wheather city already exists in the data
                data.forEach(element => {                    
                    if(element.city === response.name)
                        cityPresent = true;                    
                });

                //if no city is present
                if(!cityPresent){
 
                    //than add to the start of the array of list with unshift method
                    data.unshift({
                        city: response.name,
                        latitude: response.coord.lat,
                        longitude: response.coord.lon
                    });

                    // we are setting the localStorage item by giving the key as"LOCAL_STORAGE_KEY" and value as "data"
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
 
                    // calling the function which will render the document from the local storage 
                    AfterDocumentRendered();
                }

                // we are calling the function which will give the five day forecast of the city, selected from the list as well as by the input from the user
                // and also passing the argument for city name, longitude and latitude from the data response from the api-query
                fiveDayForecast(response.name, response.coord.lat, response.coord.lon);
            },

            //this part will function when wrong name of city was send by the user for query 
            function (response)
            {
                
                alert(response.responseJSON.message);
            });
    }
//we are creating a function for five day forecast with placeholder such as city, latitude, longitude 
    function fiveDayForecast(city, latitude, longitude) {
  
        // css style of weatherDashboard div is visible  and rendered in the front end
        $("#weatherDashboard").css("visibility", "visible");

        //calling another query for getting the daily temperature, humidity, weathericon for the city by giving latitude and longitude information 
        var queryURL = 'http://api.openweathermap.org/data/2.5/onecall?units=Imperial&lat=' + latitude + '&lon=' + longitude + '&appid=' + API_KEY;

                $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function (response) {
                
                //adding the city name with the span id cityName
                $("#cityName").text("    " + city);
   
                // we are creating an array for daily forecast
                var arr = response.daily;
   
                //we are defining length of the array and stored in the variable
                var len = arr.length;
   
                // we are limiting the search of daily forecast for only 5 days
                for (var i = 0; i < 6; i++) {
    
                    // we are incorporating the data according to the id of the span as temperature-0, humidity-0, weathericon-0 will be rendered in the current condition of the given city
                    $("#temperature-" + i).text("Temperature : " + arr[i].temp.day + " " + String.fromCharCode(176) + "F");
                    $("#humidity-" + i).text("Humidity : " + arr[i].humidity);
                    $("#weathericon-" + i).attr("src", "http://openweathermap.org/img/wn/" + arr[i].weather[0].icon + "@2x.png");
    
                    // one more condition is added that is if span id ==0 then we need to deliver some more data for windSpeed and uv index
                    if (i === 0) {
                        $("#windSpeed-" + i).text("Wind Speed : " + arr[i].wind_speed);
                        $("#uv_index-" + i).text(arr[i].uvi);
     
                        //creating a condition for uv index that if it is less than 3 which indicates no protection needed  than it will add green class,  
                        if (arr[i].uvi < 3)
                            $("#uv_index-" + i).addClass('green');
                        else if (arr[i].uvi < 6)
                        //if less than 6 moderate condition, add class yellow
                            $("#uv_index-" + i).addClass('yellow');
                        //if less than 8 is high, add class yellow
                        else if (arr[i].uvi < 8)
                            $("#uv_index-" + i).addClass('orange');
                            //less than 11 will be very high then add class red
                        else if (arr[i].uvi < 11)
                            $("#uv_index-" + i).addClass('red');
                        else
                        //else if it is 11 or above, it will be extreme, add class purple
                            $("#uv_index-" + i).addClass('purple');
                        // we are adding the date for the current moment
                        $("#date-" + i).text("(" + moment.unix(arr[i].dt).format("MM/DD/YYYY") + ")");
                    } else {
                        //this code will display the date of every five day in five day forecast 
                        $("#date-" + i).text(moment.unix(arr[i].dt).format("MM/DD/YYYY"));
                    }
                }
            })            
    }
//creating function when we click the list of previous searched city and present with the data of particular city,latitude and longitude information
//and even the five day forecast
    function populateCityData()
    {
        var index = $(this).attr('value');
        var city = data[index].city, latitude = data[index].latitude, longitude = data[index].longitude;
        fiveDayForecast(city,latitude,longitude);
    }
//create the function 
    function AfterDocumentRendered()
    {
        // we are getting the item from local storage key 
        data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        //if t is no data than return empty array
        if(data == null){
            data = [];
            return;
        }
        var div = $('#showCities');
        div.empty();
        var length = data.length;
        //we are storing the city in array form  
        for(var index = 0; index < length; index++)
        {

            // we are adding the city according to the index value in the class="list-group-item list-group-item-action and appending it to the div with <a> tag with href="#"
           div.append('<a href="#" class="list-group-item list-group-item-action" value=' + index + ' >' + data[index].city + '</a>')
        }
        //we are creating the click function on the list of previously searched city
        $(".list-group-item").on("click", populateCityData);
    }
//this function is called 
    AfterDocumentRendered();
});