  $(document).ready(function () {
    getCity();
  });

  $(".saved-list").hide()

  function getCity() {
    var requestURL = "http://www.geoplugin.net/json.gp";
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data.geoplugin_city,data.geoplugin_region);
        getBrewery(data.geoplugin_city,data.geoplugin_region)
      });
  }

  function getBrewery(geoplugin_city,geoplugin_region) {
    var requestURL = `https://api.openbrewerydb.org/breweries?per_page=${7}&by_city=${geoplugin_city}&by_state=${geoplugin_region}`;
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i])
          var listItem = $("<div>").addClass("Something").attr("id","brewery"+data[i].id)
          var name = $("<h2>").addClass("name").text(data[i].name);
          var street = $("<h2>").addClass("street").text(data[i].street);
          var state = $("<h2>").addClass("state").text(data[i].state);
          var city = $("<h2>").addClass("city").text(data[i].city);
          var zip = $("<h2>").addClass("zip").text(data[i].postal_code);
          var url = $("<h2>").addClass("url").text(data[i].website_url);
          var phone = $("<h2>").addClass("phone").text(data[i].phone);
          var button = $("<button>").text("add to favorites").addClass("saveButton")
          $(".brewery-list").append(listItem.append(name,street,city,state,zip,url,phone,button))   
          // console.log(data[i].name,data[i].street,data[i].state,data[i].postal_code,data[i].phone,data[i].website_url,data[i].brewery_type)
        }
        saveFavs();
      });
    }

    function saveFavs() {
    $(".saveButton").on("click", function() {
    var info = $(this).parent().attr("id");
    var content = {
     brewName: $(this).parent().children(".name").html(),
     brewStreet: $(this).parent().children(".street").html(),
     brewState: $(this).parent().children(".state").html(),
     brewCity: $(this).parent().children(".city").html(),
     brewZip: $(this).parent().children(".zip").html(),
     brewUrl: $(this).parent().children(".url").html(),
     brewPhone: $(this).parent().children(".phone").html(),
     brewId: parseInt($(this).parent().attr("id").split("y")[1])
    }
    
    localStorage.setItem(info, JSON.stringify(content));
    // var favorites = JSON.parse(localStorage.getItem("brewery"+content.brewId)) || [];
    // console.log(favorites)
    // var listItem = $("<div>").attr("id","brewery"+favorites.brewId)
    //     var name = $("<h2>").text(favorites.brewName);
    //     var street = $("<h2>").text(favorites.brewStreet);
    //     var state = $("<h2>").text(favorites.brewState);
    //     var city = $("<h2>").text(favorites.brewCity);
    //     var zip = $("<h2>").text(favorites.brewZip);
    //     var url = $("<h2>").text(favorites.brewUrl);
    //     var phone = $("<h2>").text(favorites.brewPhone);
    //     // var button = $("<button>").text("add to favorites").addClass("saveButton")
    //     $(".saved-list").append(listItem.append(name,street,city,state,zip,url,phone))
  });
    }

$(document).foundation();

