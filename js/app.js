document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', { zoomControl: false }).setView([8.3675, 124.864], 12);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18
    });

    streetLayer.addTo(map);
    L.control.layers({
        Streets: streetLayer,
        Satellite: satelliteLayer
    }, null, { position: 'topright', collapsed: false }).addTo(map);

    let municipalBoundary;
    const boundaryUrl = 'https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&limit=1&q=Manolo%20Fortich%2C%20Bukidnon%2C%20Philippines';
    fetch(boundaryUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Unable to load the municipal boundary.');
            }
            return response.json();
        })
        .then((places) => {
            if (!places[0]?.geojson) {
                throw new Error('Municipal boundary geometry was not found.');
            }

            municipalBoundary = L.geoJSON(places[0].geojson, {
                style: {
                    color: '#246247',
                    dashArray: '8 7',
                    fillColor: '#8ebc8d',
                    fillOpacity: 0.08,
                    weight: 3
                }
            }).addTo(map);

            municipalBoundary.bindTooltip('Manolo Fortich municipal boundary', { direction: 'center' });
            map.fitBounds(municipalBoundary.getBounds().pad(0.06));
            municipalBoundary.bringToFront();
        })
        .catch((error) => console.warn(error.message));

    const selectedName = document.querySelector('#selected-name');
    const selectedCrop = document.querySelector('#selected-crop');
    const selectedArea = document.querySelector('#selected-area');
    const selectedYield = document.querySelector('#selected-yield');
    const selectedProduction = document.querySelector('#selected-production');

    function selectArea(cropArea) {
        selectedName.textContent = cropArea.name;
        selectedCrop.textContent = cropArea.crop;
        selectedArea.textContent = cropArea.area;
        selectedYield.textContent = cropArea.yield;
        selectedProduction.textContent = cropArea.production;
    }

    const barangayLayers = new Map();
    const barangayButtons = [...document.querySelectorAll('.barangay-filter')];

    function normalizeBarangayName(name) {
        return name.replace(/ \(Pob\.\)$/, '');
    }

    function focusBarangay(button) {
        document.querySelector('.barangay-filter.is-active')?.classList.remove('is-active');
        button.classList.add('is-active');

        const coordinates = [Number(button.dataset.lat), Number(button.dataset.lng)];
        map.setView(coordinates, 14);
        const layer = barangayLayers.get(button.dataset.name);
        layer?.openPopup();
        selectArea({
            name: `Barangay ${button.dataset.name}`,
            crop: 'Corn',
            area: '38 hectares',
            yield: '4.3 tons/ha',
            production: '163.4 tons'
        });
    }

    const barangayBoundaryLayer = L.geoJSON(null, {
        style: {
            color: '#166534',
            fillColor: '#22c55e',
            fillOpacity: 0.1,
            weight: 2
        },
        onEachFeature: (feature, layer) => {
            const name = normalizeBarangayName(feature.properties.ADM4_EN);
            layer.bindTooltip(name, { direction: 'center' });
            layer.bindPopup(`<strong>Barangay ${name}</strong><br>PSGC: ${feature.properties.ADM4_PCODE}`);
            layer.on('click', () => {
                const button = barangayButtons.find((item) => item.dataset.name === name);
                if (button) {
                    focusBarangay(button);
                }
            });
            barangayLayers.set(name, layer);
        }
    }).addTo(map);

    fetch('public/data/manolo-fortich-barangays.geojson')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Unable to load barangay boundaries.');
            }
            return response.json();
        })
        .then((data) => {
            barangayBoundaryLayer.addData(data);

            map.fitBounds(barangayBoundaryLayer.getBounds().pad(0.06));
            municipalBoundary?.bringToFront();
        })
        .catch((error) => console.warn(error.message));

    barangayButtons.forEach((button) => {
        button.addEventListener('click', () => {
            focusBarangay(button);
        });
    });

});
