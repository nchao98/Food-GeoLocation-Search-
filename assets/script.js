$(document).ready(function () {
  $(document).ready(function () {
    getCity();
  });

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
          console.log(data[i])
          var listItem = $("<div>").addClass("Something").attr("id","brewery"+data[i].id)
          var name = $("<h2>").text(data[i].name);
          var street = $("<h2>").text(data[i].street);
          var state = $("<h2>").text(data[i].state);
          var city = $("<h2>").text(data[i].city);
          var zip = $("<h2>").text(data[i].postal_code);
          var url = $("<h2>").text(data[i].website_url);
          var phone = $("<h2>").text(data[i].phone);
          var button = $("<button>").text("add to favorites").addClass("saveButton")
          $(".brewery-list").append(listItem.append(name,street,city,state,zip,url,phone,button))   
          console.log(data[i].name,data[i].street,data[i].state,data[i].postal_code,data[i].phone,data[i].website_url,data[i].brewery_type)
       
        }
          $(button).on("click", function(){
          var content = $(this).children()
          })
      });
  }
});

$(document).foundation();

