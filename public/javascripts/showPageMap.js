
mapboxgl.accessToken = mapToken
const coordinates = campground.geometry.coordinates
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: coordinates , // starting position [lng, lat]
    zoom: 9 // starting zoom
});
new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4>${campground.title}</h4>
            <p>${campground.location}</p>`
        )
    )
    .addTo(map)