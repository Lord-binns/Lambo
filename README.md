## Sentinel-2 monitoring

The map supports Sentinel Hub WMS layers for Sentinel-2 true-color imagery and NDVI observation windows.

Before starting PHP, set these environment variables:

```powershell
$env:SENTINEL_HUB_WMS_URL = 'https://services.sentinel-hub.com/ogc/wms/YOUR_INSTANCE_ID'
$env:SENTINEL_HUB_TOKEN = 'YOUR_SENTINEL_HUB_TOKEN'
php -S localhost:8000 -t .
```

The Sentinel Hub configuration must expose WMS layers named `TRUE_COLOR` and `NDVI`. The app then enables the month selector and NDVI toggle in the map. Without these variables, the roads, farmland, boundaries, and existing satellite basemap continue to work normally.

Sentinel-2 imagery indicates vegetation conditions; it does not by itself identify whether a field contains corn, rice, or cassava.
