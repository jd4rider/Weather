$(document).ready(function() {
  var geocoder;
  var celsius = false;
    
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      console.log(lat, long);
      codeLatLong(lat, long);
    });
  

  function codeLatLong(lat, lng) {
        var latlng = ""+lat+","+lng+"";
        var gurl = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&sensor=false'
        $.getJSON(gurl, function(results) {
            if (results.status == 'OK') {
                for (var i = 0; i < results.results[0].address_components.length; i++) {
                    var type = results.results[0].address_components[i].types;
                    if (type.indexOf("locality") !== -1) {
                        var city = results.results[0].address_components[i].short_name;
                    } else if (type.indexOf("administrative_area_level_1") !== -1) {
                        var state = results.results[0].address_components[i].short_name;
                    }
                }
               getWeather(state, city);
            } else {
                $("#main").after("API Error: " + results.status);
            } 
        });
    }

  function getWeather(state = 'HI', city = 'Honolulu'){
    $.ajax({
      url : "https://api.wunderground.com/api/3d93be77057f4427/geolookup/conditions/q/"+state+"/"+city+".json",
      dataType : "jsonp",
      success : function(parsed_json) {

        var location = parsed_json['location']['city'];
        var temp_f = parsed_json['current_observation']['temp_f'];
        var weatherout = parsed_json['current_observation']['weather'];
        var windMPH = parsed_json['current_observation']['wind_mph'];
        var temp_c = parsed_json['current_observation']['temp_c'];
        var icon = parsed_json['current_observation']['icon_url'];
        var myOutput = "\u00B0";
        $("#main").text(temp_f+""+myOutput+" F");
        $("#clicker").click(function(){
          celsius = !celsius;
          if(!celsius){
            $("#main").text(temp_f+""+myOutput+" F");
          }else{
            $("#main").text(temp_c+""+myOutput+" C");
          }
        })
        $("#city").text(city+", "+state);
        $("#weather").text(weatherout);
        $("#wind").text(windMPH+" MPH");
        $("#image").attr("src", icon);
      }
    });
  }
});
