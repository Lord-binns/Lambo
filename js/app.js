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
    const municipalGeometryPromise = fetch(boundaryUrl)
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
                },
                interactive: false
            }).addTo(map);

            municipalBoundary.bindTooltip('Manolo Fortich municipal boundary', { direction: 'center' });
            map.fitBounds(municipalBoundary.getBounds().pad(0.06));
            municipalBoundary.bringToFront();

            return places[0].geojson;
        })
        .catch((error) => {
            console.warn(error.message);
            return null;
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

    const barangayLayers = new Map();
    const barangayButtons = [...document.querySelectorAll('.barangay-filter')];

    function normalizeBarangayName(name) {
        return name.replace(/ \(Pob\.\)$/, '');
    }

    function setBarangayHighlight(selectedLayer) {
        barangayLayers.forEach((layer) => {
            layer.setStyle(layer === selectedLayer ? {
                color: '#b0673b',
                fillColor: '#d8a276',
                fillOpacity: 0.42,
                weight: 4
            } : {
                color: '#166534',
                fillColor: '#22c55e',
                fillOpacity: 0.04,
                weight: 1
            });
        });
        municipalBoundary?.bringToFront();
        selectedLayer?.bringToFront();
    }

    function activateBarangay(name, layer, button) {
        document.querySelector('.barangay-filter.is-active')?.classList.remove('is-active');
        button?.classList.add('is-active');

        if (layer) {
            setBarangayHighlight(layer);
            map.fitBounds(layer.getBounds().pad(0.15));
            layer.bringToFront();
            layer.openPopup();
        }
        selectArea({
            name: `Barangay ${name}`,
            crop: 'Corn',
            area: '38 hectares',
            yield: '4.3 tons/ha',
            production: '163.4 tons'
        });
    }

    function focusBarangay(button) {
        const layer = barangayLayers.get(button.dataset.name);
        if (layer) {
            activateBarangay(button.dataset.name, layer, button);
            return;
        }

        button.classList.add('is-active');
        map.setView([Number(button.dataset.lat), Number(button.dataset.lng)], 14);
    }

    const barangayBoundaryLayer = L.geoJSON(null, {
        style: {
            color: '#166534',
            fillColor: '#22c55e',
            fillOpacity: 0.1,
            weight: 2,
            className: 'barangay-polygon'
        },
        onEachFeature: (feature, layer) => {
            const name = normalizeBarangayName(feature.properties.ADM4_EN);
            layer.bindTooltip(name, { direction: 'center' });
            layer.bindPopup(`<strong>Barangay ${name}</strong><br>PSGC: ${feature.properties.ADM4_PCODE}`);
            layer.on('mouseover', () => {
                if (!layer.getPopup()?.isOpen()) {
                    layer.setStyle({ weight: 3, fillOpacity: 0.16 });
                }
                layer.bringToFront();
            });
            layer.on('mouseout', () => {
                if (!layer.getPopup()?.isOpen()) {
                    const isActive = document.querySelector('.barangay-filter.is-active')?.dataset.name === name;
                    layer.setStyle(isActive ? {
                        color: '#b0673b',
                        fillColor: '#d8a276',
                        fillOpacity: 0.42,
                        weight: 4
                    } : {
                        color: '#166534',
                        fillColor: '#22c55e',
                        fillOpacity: 0.04,
                        weight: 1
                    });
                }
            });
            layer.on('click', () => {
                const button = barangayButtons.find((item) => item.dataset.name === name);
                activateBarangay(name, layer, button);
            });
            barangayLayers.set(name, layer);
        }
    }).addTo(map);

    Promise.all([
        municipalGeometryPromise,
        fetch('public/data/manolo-fortich-barangays.geojson')
    ])
        .then(([municipalGeometry, response]) => {
            if (!response.ok) {
                throw new Error('Unable to load barangay boundaries.');
            }
            return response.json().then((data) => ({ data, municipalGeometry }));
        })
        .then(({ data, municipalGeometry }) => {
            const municipalFeature = municipalGeometry ? turf.feature(municipalGeometry) : null;
            const clippedFeatures = municipalFeature
                ? data.features.map((feature) => {
                    const clippedFeature = turf.intersect(turf.featureCollection([feature, municipalFeature]));
                    return clippedFeature ? { ...clippedFeature, properties: feature.properties } : feature;
                })
                : data.features;
            const clippedData = { ...data, features: clippedFeatures };
            barangayBoundaryLayer.addData(clippedData);

            map.fitBounds(barangayBoundaryLayer.getBounds().pad(0.06));

        })
        .catch((error) => console.warn(error.message));

    barangayButtons.forEach((button) => {
        button.addEventListener('click', () => {
            focusBarangay(button);
        });
    });

});
