
const locationValue = document.querySelector("#locationValue")

let map = L.map('map').setView([20, 77], 5);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);


    function setViewByLocation(location) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            let lat = data[0].lat;
            let lon = data[0].lon;
            map.setView([lat, lon], 12);

            L.marker([lat, lon]).addTo(map)
              .bindPopup(`<b>${location}</b>`)
              .openPopup();
          } else {
            alert("Location not found!");
          }
        })
        .catch(err => console.error(err));
    }


    setViewByLocation(locationValue.value);