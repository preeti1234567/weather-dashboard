// function searchInitiate()
// {
// currentCity(city);

// }
// currentCity()
// {
$(document).ready(function () {
    $("#searchBtn").on("click", function () {
        var city = $("#inputSearchBox").val().trim();
        var APIKey = "73671fcb30692ec0371f08494dfbbe54";

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function (response) {
                fiveDayForecast( response.name,response.coord.lat,response.coord.lon);
            });
        
        function fiveDayForecast(city,latitude,longitude) {
            var queryURL = 'http://api.openweathermap.org/data/2.5/onecall?units=Imperial&lat='+ latitude + '&lon=' + longitude + '&appid=' + APIKey;
            var temperatureId = '#temperature-'
            $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function (response) {
                $("#cityName").text("    " + city);    
                var arr = response.daily;
                var len = arr.length;
                for(var i = 0; i < 6; i++)
                {
                    $("#temperature-" + i).text("    " + arr[i].temp.day + " " + String.fromCharCode(176) + "F");
                    $("#humidity-" + i).text("    " +  arr[i].humidity);
                    $("#weathericon-" + i).attr("src", "http://openweathermap.org/img/wn/" + arr[i].weather[0].icon + "@2x.png");
                    if(i === 0){
                        $("#windSpeed-" + i).text("    " + arr[i].wind_speed);
                        $("#uv_index-" + i).text("    " + arr[i].uvi);
                        if(arr[i].uvi < 3)
                            $("#uv_index-" + i).addClass('green');
                        else if(arr[i].uvi < 6)
                            $("#uv_index-" + i).addClass('yellow');
                        else if(arr[i].uvi < 8)
                            $("#uv_index-" + i).addClass('orange');
                        else if(arr[i].uvi < 11)
                            $("#uv_index-" + i).addClass('red');    
                        else
                            $("#uv_index-" + i).addClass('purple');    
                        $("#date-" + i).text("    (" + moment.unix(arr[i].dt).format("MM/DD/YYYY") + ")");     
                    }
                    else{
                        $("#date-" + i).text("    " + moment.unix(arr[i].dt).format("MM/DD/YYYY"));                        
                    }
                }
            })

        }

    })
})