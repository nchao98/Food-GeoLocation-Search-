$(document).ready(function () {
  getCity();
  load();

  $("#favBtn").on("click", function(){
    document.location.replace('./favorites.html')
  })

  $("#filterBtn").on("click", function (){
    $(".brewery-list").empty()
    var zip = $("#zip").value
    var name = $("#name").value
    var number1 = $("#number1").value
    var rbs = $('input[name="brewery"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
      }
  })


  function getCity() {
    var requestURL = "http://www.geoplugin.net/json.gp";
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        console.log(data.geoplugin_city, data.geoplugin_region);
        getBrewery(data.geoplugin_latitude, data.geoplugin_longitude)
        // (data.geoplugin_city, data.geoplugin_region);
      });
  }
  var userAnswer = {
    brewPub: false,
    micro: true,
    nano: false,
    regional: true
  }
  function getBrewery(lat,lon){
  // (geoplugin_city, geoplugin_region) {
    var requestURL = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${lon}&per_page=50`
    // `https://api.openbrewerydb.org/breweries?per_page=${7}&by_city=${geoplugin_city}&by_state=${geoplugin_region}`;
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // console.log(data)
        var results = []
        if (userAnswer.brewPub === true){
          var pubArray = data.filter(brewery => brewery.brewery_type === "brewpub");
          results = results.concat(pubArray)
        }

        if (userAnswer.micro === true){
          var microArray = data.filter(brewery => brewery.brewery_type === "micro")
          results = results.concat(microArray)
        }
        console.log(results)

        if (userAnswer.nano === true){
          var nanoArray = data.filter(brewery => brewery.brewery_type === "nano")
          results = results.concat(nanoArray)
        }

        if (userAnswer.regional === true){
          var regionalArray = data.filter(brewery => brewery.brewery_type === "regional")
          results = results.concat(regionalArray)
        }
        console.log(results);
        var filteredForWebsite = results.filter(result => result.website_url !== null);
        console.log(filteredForWebsite)
                for (var i = 0; i < filteredForWebsite.length; i++) {
          // console.log(data[i])
          var listItem = $("<div>")
            .addClass("brew")
            .attr("id", "brewery" + filteredForWebsite[i].id);
          var name = $("<h2>").addClass("name").text(filteredForWebsite[i].name);
          var street = $("<h3>").addClass("street").text(filteredForWebsite[i].street);
          var state = $("<h3>").addClass("state").text(filteredForWebsite[i].state);
          var city = $("<h3>").addClass("city").text(filteredForWebsite[i].city);
          var zip = $("<h3>").addClass("zip").text(parseInt((filteredForWebsite[i].postal_code).split("-")[0]));
          var url = $("<a>").attr('target', '_blank').attr("href", filteredForWebsite[i].website_url).addClass("url").text(filteredForWebsite[i].website_url);
          var phone = $("<a>").attr("href", "tel:"+filteredForWebsite[i].phone).addClass("phone").text(filteredForWebsite[i].phone);
          var button = $("<button>")
            .text("add to favorites")
            .addClass("saveButton");
          $(".brewery-list").append(
            listItem.append(name,street,city,state,zip,url,"</br>",phone,"</br>",button)
          );
          // console.log(data[i].name,data[i].street,data[i].state,data[i].postal_code,data[i].phone,data[i].website_url,data[i].brewery_type)
        }
        saveFavs();
      });
  }
  $(".brewery-list").on("click", ".saveButton", function () {
    var info = $(this).parent().attr("id");
    var content = {
      brewName: $(this).parent().children(".name").html(),
      brewStreet: $(this).parent().children(".street").html(),
      brewState: $(this).parent().children(".state").html(),
      brewCity: $(this).parent().children(".city").html(),
      brewZip: $(this).parent().children(".zip").html(),
      brewUrl: $(this).parent().children(".url").html(),
      brewPhone: $(this).parent().children(".phone").html(),
      brewId: parseInt($(this).parent().attr("id").split("y")[1]),
    };
    save(info, content);
  });
  function saveFavs() {}
  function save(infoP, contentP) {

      localStorage.setItem(infoP, JSON.stringify(contentP));
  }
  function load() {
    var content = [];
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
      content.push(JSON.parse(localStorage.getItem( localStorage.key( i ) )))
      console.log( localStorage.getItem( localStorage.key( i ) ) );
    } 
    console.log(content)
    showFavs(content);
  }
  function showFavs(favorites) {
    for (var i = 0; i < favorites.length; i++){
    console.log(favorites);
    var listItem = $("<div>").addClass("brew").attr("id", "brewery" + favorites[i].brewId);
    var name = $("<h2>").addClass("name").text(favorites[i].brewName);
    var street = $("<h3>").addClass("street").text(favorites[i].brewStreet);
    var state = $("<h3>").addClass("state").text(favorites[i].brewState);
    var city = $("<h3>").addClass("city").text(favorites[i].brewCity);
    var zip = $("<h3>").addClass("zip").text(parseInt((favorites[i].brewZip).split("-")[0]));
    var url = $("<a>").addClass("url").attr('target', '_blank').attr("href", favorites[i].brewUrl).text(favorites[i].brewUrl);
    var phone = $("<a>").attr("href", "tel:"+favorites[i].brewPhone).addClass("phone").text(favorites[i].brewPhone);
    var key = "brewery" + favorites[i].brewId
    console.log(name);
    var button = $("<button>").text("Clear Favorites").addClass("deleteButton")
    $(".saved-list").append(
      listItem.append(name,street,city,state,zip,url,"</br>",phone,"</br>",button)
    );
    }
    
    $(".saved-list").on("click", ".deleteButton", function () {
      window.localStorage.removeItem(key)
      location.reload();
    });
  }
});
$(document).foundation();

