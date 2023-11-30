
const getData = async () => {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const dataPromise = await fetch(url);
    data = await dataPromise.json();

    const url2 = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
    const dataPromise2 = await fetch(url2);
    arrivalData = await dataPromise2.json();

    const url3 = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
    const dataPromise3 = await fetch(url3);
    departureData = await dataPromise3.json();

    createMap(data, arrivalData, departureData);
}

const createMap = (data, arrivalData, departureData) => {

    let map = L.map('map', {
        minZoom: -3
    })
   
    let geoJSON = L.geoJSON(data, {
        weight: 2,
        onEachFeature: (feature, layer) => {
            if (!feature.properties.name) {
                console.log("Ei löydy nimeä...")
                return
            }
            const nimi = feature.properties.name;
            layer.bindTooltip(
                nimi
            )
            layer.bindPopup(
                `<ul>
                <li>Name: ${nimi}</li>
                <li>Arrivals: ${arrivalData.dataset.value[arrivalData.dataset.dimension.Tuloalue.category.index["KU" + feature.properties.kunta]]}</li>
                <li>Departures: ${departureData.dataset.value[departureData.dataset.dimension.Lähtöalue.category.index["KU" + feature.properties.kunta]]}</li>
            </ul>`
            )
        },
        style: (feature) => {
            let positive = arrivalData.dataset.value[arrivalData.dataset.dimension.Tuloalue.category.index["KU" + feature.properties.kunta]];
            let negative = departureData.dataset.value[departureData.dataset.dimension.Lähtöalue.category.index["KU" + feature.properties.kunta]]
            let hue = (positive / negative) * (positive / negative) * (positive / negative) * 60
            if (hue > 120) {
                hue = 120;
            }
            let colorx = `hsl(${hue}, 75%, 50%)`
            return {
                color: colorx
            }
        }
    }).addTo(map)

    let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map)

    map.fitBounds(geoJSON.getBounds())

}

const getFeatures = (feature, layer) => {
    if (!feature.properties.name) {
        console.log("Ei löydy nimeä...")
        return
    }
    const nimi = feature.properties.name;
    layer.bindTooltip(
        nimi
    )
    layer.bindPopup(
        `<ul>
        <li>Name: ${nimi}</li>
        <li>Arrivals: ${arrivalData.dataset.dimension.Tuloalue.category.index["KU" + feature.properties.kunta]}</li>
        <li>Departures: ${departureData.dataset.dimension.Lähtöoalue.category.index["KU" + feature.properties.kunta]}</li>
    </ul>`
    )
}


getData();