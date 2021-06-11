$(document).ready(function () {
  getCity();
  load();

  $("#favBtn").on("click", function(){
    document.location.replace('./favorites.html')
  })

  // $("#filterBtn").on("click", function (){
  //   $(".brewery-list").empty()
  // })

  $("#sbmt").on("click",function(){
    var zip = $("#zip").val()
    var name = $("#name").val()
    var number1 = $("#number1").val()
    console.log(zip)
    var requestURL = `https://api.openbrewerydb.org/breweries?by_postal=${zip}&per_page=${number1}`
  //   if (name == ""){
  //     requestURL= `https://api.openbrewerydb.org/breweries/autocomplete?query=${name}&by_postal=${zip}&per_page=${number1}`
  // }  //else {requestURL= `https://api.openbrewerydb.org/breweries/autocomplete?query=${name}`}
  // // 
  $(".brewery-list").empty()
  updateFilters()
  console.log(requestURL)
  getBrewery(requestURL)
})


  function getCity() {
    var requestURL = "http://www.geoplugin.net/json.gp";
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        console.log(data.geoplugin_city, );
        
        // (data.geoplugin_city, data.geoplugin_region);
        var requestURL = `https://api.openbrewerydb.org/breweries?by_dist=${data.geoplugin_latitude},${data.geoplugin_longitude}&per_page=50`
        getBrewery(requestURL)
      });
  }
  
  var micro1
  var nano1
  var regional1
  var brewpub1
  var userAnswer
  updateFilters()
  function updateFilters(){
     micro1 = $("#brewery1").is(":checked") ? true : false
     nano1 = $("#brewery2").is(":checked") ? true : false
     regional1 = $("#brewery3").is(":checked") ? true : false
     brewpub1 = $("#brewery4").is(":checked") ? true : false
     userAnswer = {
      brewPub: brewpub1,
      micro: micro1,
      nano: nano1,
      regional: regional1
    }
  }
  $('#btn').on("click", function (){
    updateFilters()
    $(".brewery-list").empty()
    getCity()
  })

  function getBrewery(requestURL){
  // (geoplugin_city, geoplugin_region) {
    
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

