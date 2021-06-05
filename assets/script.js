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
    var requestURL = `https://api.openbrewerydb.org/breweries?by_city=${geoplugin_city}&by_state=${geoplugin_region}`;
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        for (var i = 0; i < data.length; i++) {
          console.log(data[i])
          // console.log(data[i].name,data[i].street,data[i].state,data[i].postal_code,data[i].phone,data[i].website_url,data[i].brewery_type)
        }
      });
  }
});
