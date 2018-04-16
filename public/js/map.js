const map = (function() {
  const apiKey = "YOURAPIKEY";
  let map;
  let marker;
  let markers = [];
  let mapDiv = document.getElementById("map");



  // Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
    const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
    let result = strings[0];
    for (let i = 1; i < arguments.length; i++) {
      result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
        return entities[char];
      });
      result += strings[i];
    }
    return result;
  }

  function showMapAndData(center, centerTitle) {
    map = new google.maps.Map(mapDiv, {
      zoom: 7,
      center: center
      // styles:mapStyles
    });
    currentLocationMarker = new google.maps.Marker({
      position: center,
      map: map,
      title: centerTitle
    });
    markers.push({ currentLocationMarker });
    map.data.loadGeoJson("/js/stores.json");

    map.data.setStyle(feature => {
      return {
        icon: {
          url: `img/icon_${feature.getProperty("category")}.png`,
          scaledSize: new google.maps.Size(64, 64)
        }
      };
    });
    //info window
    const infoWindow = new google.maps.InfoWindow(  );
    infoWindow.setOptions({
        pixelOffset:new google.maps.Size(0,-30)
    })
    map.data.addListener("click", event => {
      let category = event.feature.getProperty("category");
      let name = event.feature.getProperty("name");
      let description = event.feature.getProperty("description");
      let hours = event.feature.getProperty("hours");
      let phone = event.feature.getProperty("phone");
      let position = event.feature.getGeometry().get();
      let content = sanitizeHTML`
              <img style="float:left; width:200px; margin-top:30px" src="img/logo_${category}.png">
              <div style="margin-left:220px; margin-bottom:20px;">
                <h2>${name}</h2><p>${description}</p>
                <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
                <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
              </div>
            `;
      infoWindow.setContent(content);
      infoWindow.setPosition(position);
      infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
      infoWindow.open(map);
    });
  }

  /*
  ====================================    Public Functions   =====================================
  */
  function initMap() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log("position acquired");
        let center = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        c = { lat: 52.632469, lng: -1.689423 };
        showMapAndData(c, "Current Location");
      },
      err => {
        console.log(err); // {code:1,message:"User denied Geolocation"}
        center = {
          lat: 17.4427192,
          lng: 78.3973183
        };
        console.log(err.message);
        showMapAndData(center, "Some Location");
      }
    );
  }

  return {
    initMap: initMap,
    getMarkers: () => {
      return markers;
    },
    getMap: () => {
      return map;
    }
  };
})();
