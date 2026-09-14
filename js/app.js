document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', { zoomControl: false }).setView([8.3675, 124.864], 12);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

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
                throw new Error('Municipal boundary data was not found.');
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
        })
        .catch((error) => console.warn(error.message));

    let tankulanBoundary;
    const tankulanUrl = 'https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&limit=1&q=Tankulan%2C%20Manolo%20Fortich%2C%20Bukidnon%2C%20Philippines';
    fetch(tankulanUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Unable to load the Tankulan boundary.');
            }
            return response.json();
        })
        .then((places) => {
            if (!places[0]?.geojson) {
                throw new Error('Tankulan boundary data was not found.');
            }

            tankulanBoundary = L.geoJSON(places[0].geojson, {
                style: {
                    color: '#b0673b',
                    fillColor: '#d8a276',
                    fillOpacity: 0.16,
                    weight: 4
                }
            }).addTo(map);

            tankulanBoundary.bindTooltip('Tankulan barangay boundary', { direction: 'center' });
            tankulanBoundary.bringToFront();
        })
        .catch((error) => console.warn(error.message));

    const cropAreas = [
        { name: 'Barangay Dalirig', crop: 'Corn', center: [8.378, 124.86], radius: 850, color: '#d7a93b', area: '38 hectares', yield: '4.3 tons/ha', production: '163.4 tons' },
        { name: 'Barangay San Miguel', crop: 'Rice', center: [8.35, 124.88], radius: 700, color: '#7092aa', area: '26 hectares', yield: '4.0 tons/ha', production: '104 tons' },
        { name: 'Barangay Aglayan', crop: 'Cassava', center: [8.39, 124.83], radius: 950, color: '#a97b59', area: '44 hectares', yield: '3.8 tons/ha', production: '167.2 tons' }
    ];

    const markers = cropAreas.map((cropArea) => {
        const marker = L.circle(cropArea.center, {
            color: cropArea.color,
            fillColor: cropArea.color,
            fillOpacity: 0.52,
            radius: cropArea.radius,
            weight: 2
        }).addTo(map);

        marker.bindTooltip(cropArea.crop, { direction: 'top', opacity: 0.9 });
        marker.on('click', () => selectArea(cropArea));
        marker.cropName = cropArea.crop;
        return marker;
    });

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

    document.querySelectorAll('.crop-filter').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelector('.crop-filter.is-active').classList.remove('is-active');
            button.classList.add('is-active');

            const selectedCropName = button.dataset.crop;
            markers.forEach((marker) => {
                const isVisible = selectedCropName === 'All crops' || marker.cropName === selectedCropName;
                marker.setStyle({ fillOpacity: isVisible ? 0.52 : 0.08, opacity: isVisible ? 1 : 0.2 });
            });
        });
    });

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
