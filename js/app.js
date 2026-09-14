document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', { zoomControl: false }).setView([8.3675, 124.864], 12);
    map.createPane('tankulan-boundary');
    map.getPane('tankulan-boundary').style.zIndex = 650;

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

    let tankulanBoundary;
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
            }

            const boundary = L.geoJSON(places[0].geojson, {
                style: {
                    color: '#246247',
                    dashArray: '8 7',
                    fillColor: '#8ebc8d',
                    fillOpacity: 0.08,
                    weight: 3
                }
            }).addTo(map);

            boundary.bindTooltip('Manolo Fortich municipal boundary', { direction: 'center' });
            map.fitBounds(boundary.getBounds().pad(0.06));
            boundary.bringToFront();

            tankulanBoundary = L.geoJSON(places[0].geojson, {
                pane: 'tankulan-boundary',
                style: {
                    color: '#b0673b',
                    fillColor: '#d8a276',
                    fillOpacity: 0.08,
                    weight: 4
                }
            }).addTo(map);

            tankulanBoundary.bindTooltip('Tankulan boundary', { direction: 'center' });
            tankulanBoundary.bringToFront();
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

    document.querySelectorAll('.barangay-filter').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelector('.barangay-filter.is-active')?.classList.remove('is-active');
            button.classList.add('is-active');

            if (tankulanBoundary) {
                map.fitBounds(tankulanBoundary.getBounds().pad(0.12));
                tankulanBoundary.bringToFront();
                return;
            }

            map.setView([Number(button.dataset.lat), Number(button.dataset.lng)], 13);
        });
    });
});
