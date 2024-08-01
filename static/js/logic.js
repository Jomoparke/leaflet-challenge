let myMap = L.map("map", {
    center: [40, -90],
    zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(geoData).then(function (data) {

    function markerSize(mag) {
        return mag * 1000; // Adjust the multiplier as needed
    }

    data.features.forEach(function (earthquake) {
        let coordinates = earthquake.geometry.coordinates;
        let depth = coordinates[2];

        let color = depth > 100 ? "red" : depth > 50 ? "orange" : "yellow";

        L.circle([coordinates[1], coordinates[0]], {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            radius: markerSize(depth)
        }).bindPopup(`<b>Magnitude:</b> ${earthquake.properties.mag}<br><b>Depth:</b> ${depth}<br><b>Location:</b> Latitude ${coordinates[1]}, Longitude ${coordinates[0]}`).addTo(myMap);
    });

    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend");
        div.innerHTML = `
            <h4>Earthquake Depth Legend</h4>
            <div>
                <span style="background: red"></span> >100 km
            </div>
            <div>
                <span style="background: orange"></span> 50-100 km
            </div>
            <div>
                <span style="background: yellow"></span> <50 km
            </div>
        `;
        return div;
    };

    legend.addTo(myMap);
});
