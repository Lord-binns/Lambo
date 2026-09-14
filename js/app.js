document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', { zoomControl: false }).setView([8.3675, 124.864], 12);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

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
});
