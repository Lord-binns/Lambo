<?php

declare(strict_types=1);

$pageTitle = 'Lambo | Agricultural Mapping';
$cropOptions = ['All crops', 'Corn', 'Rice', 'Cassava'];
$sentinelHubUrl = getenv('SENTINEL_HUB_WMS_URL') ?: '';
$sentinelHubToken = getenv('SENTINEL_HUB_TOKEN') ?: '';
$barangays = [
    ['name' => 'Agusan Canyon', 'lat' => 8.3231476, 'lng' => 124.8098936],
    ['name' => 'Alae', 'lat' => 8.4226348, 'lng' => 124.8142500],
    ['name' => 'Dahilayan', 'lat' => 8.2194543, 'lng' => 124.8518877],
    ['name' => 'Dalirig', 'lat' => 8.3761865, 'lng' => 124.9020104],
    ['name' => 'Damilag', 'lat' => 8.3532435, 'lng' => 124.8130550],
    ['name' => 'Diclum', 'lat' => 8.3662163, 'lng' => 124.8640582],
    ['name' => 'Guilang-guilang', 'lat' => 8.4576456, 'lng' => 125.0414649],
    ['name' => 'Kalugmanan', 'lat' => 8.2775977, 'lng' => 124.8609549],
    ['name' => 'Lindaban', 'lat' => 8.2896129, 'lng' => 124.8468613],
    ['name' => 'Lingion', 'lat' => 8.4030713, 'lng' => 124.8890161],
    ['name' => 'Lunocan', 'lat' => 8.4321330, 'lng' => 124.8397476],
    ['name' => 'Maluko', 'lat' => 8.3752947, 'lng' => 124.9557620],
    ['name' => 'Mambatangan', 'lat' => 8.4680463, 'lng' => 124.7902289],
    ['name' => 'Mampayag', 'lat' => 8.2621814, 'lng' => 124.8309946],
    ['name' => 'Mantibugao', 'lat' => 8.4584139, 'lng' => 124.8237712],
    ['name' => 'Minsuro', 'lat' => 8.5102873, 'lng' => 124.8308165],
    ['name' => 'San Miguel', 'lat' => 8.3892787, 'lng' => 124.8354203],
    ['name' => 'Sankanan', 'lat' => 8.3169107, 'lng' => 124.8583317],
    ['name' => 'Santiago', 'lat' => 8.4366987, 'lng' => 124.9961035],
    ['name' => 'Santo Niño', 'lat' => 8.4306977, 'lng' => 124.8643613],
    ['name' => 'Tankulan', 'lat' => 8.3662163, 'lng' => 124.8640582],
    ['name' => 'Ticala', 'lat' => 8.3404235, 'lng' => 124.8922333],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="topbar">
        <a class="brand" href="index.php" aria-label="Lambo home">
            <span class="brand-mark">L</span>
            <span>Lambo</span>
        </a>
        <span class="location-label">Smart Agricultural Map</span>
        <span class="status-badge"><span class="status-dot"></span>Data preview</span>
    </header>

    <main class="app-shell">
        <section class="page-heading">
            <div>
                <p class="eyebrow">Created by Lord-binns</p>
                <h1>Know what is growing.<br><em>Plan what comes next.</em></h1>
                <p class="intro">Explore crop areas across Manolo Fortich and review the current yield outlook.</p>
            </div>
            <div class="year-control">
                <label for="year">Forecast year</label>
                <select id="year" name="year">
                    <option>2026</option>
                    <option>2025</option>
                </select>
            </div>
        </section>

        <section class="monitoring-bar" aria-label="Satellite monitoring controls">
            <div>
                <p class="eyebrow">Satellite monitoring</p>
                <strong>Sentinel-2 field observation</strong>
                <span id="sentinel-status">Configure Sentinel Hub to load imagery and NDVI.</span>
            </div>
            <div class="monitoring-controls">
                <label for="satellite-month">Observation month</label>
                <select id="satellite-month" name="satellite-month">
                    <option value="2026-06-01/2026-06-30">June 2026</option>
                    <option value="2026-07-01/2026-07-31">July 2026</option>
                    <option value="2026-08-01/2026-08-31">August 2026</option>
                    <option value="2026-09-01/2026-09-30">September 2026</option>
                </select>
                <button id="ndvi-toggle" class="monitoring-button" type="button" disabled>Show NDVI</button>
            </div>
        </section>

        <section class="dashboard-grid" aria-label="Agricultural map dashboard">
            <aside class="sidebar">
                <div class="panel-section">
                    <div class="section-heading">
                        <h2>Crop layers</h2>
                        <span class="layer-count">3 crops</span>
                    </div>
                    <div class="crop-filters" role="group" aria-label="Filter map by crop">
                        <?php foreach ($cropOptions as $index => $crop): ?>
                            <button class="crop-filter<?= $index === 0 ? ' is-active' : '' ?>" type="button" data-crop="<?= htmlspecialchars($crop, ENT_QUOTES, 'UTF-8') ?>">
                                <span class="crop-swatch crop-swatch--<?= strtolower(str_replace(' ', '-', $crop)) ?>"></span>
                                <?= htmlspecialchars($crop, ENT_QUOTES, 'UTF-8') ?>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="panel-section barangay-section">
                    <div class="section-heading">
                        <h2>Barangays</h2>
                        <span class="layer-count"><?= count($barangays) ?> areas</span>
                    </div>
                    <div class="barangay-filters" role="group" aria-label="Filter map by barangay">
                        <?php foreach ($barangays as $barangay): ?>
                            <button class="barangay-filter" type="button" data-name="<?= htmlspecialchars($barangay['name'], ENT_QUOTES, 'UTF-8') ?>" data-lat="<?= $barangay['lat'] ?>" data-lng="<?= $barangay['lng'] ?>">
                                <span class="barangay-marker"></span>
                                <?= htmlspecialchars($barangay['name'], ENT_QUOTES, 'UTF-8') ?>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="panel-section summary-section">
                    <p class="eyebrow">2026 overview</p>
                    <div class="metric"><strong>2,510</strong><span>hectares mapped</span></div>
                    <div class="metric"><strong>9,400</strong><span>estimated tons</span></div>
                    <div class="metric"><strong>3</strong><span>tracked crops</span></div>
                </div>

                <div class="panel-section selected-area" id="area-details">
                    <p class="eyebrow">Selected area</p>
                    <h2 id="selected-name">Barangay Dalirig</h2>
                    <dl>
                        <div><dt>Crop</dt><dd id="selected-crop">Corn</dd></div>
                        <div><dt>Area</dt><dd id="selected-area">38 hectares</dd></div>
                        <div><dt>Predicted yield</dt><dd id="selected-yield">4.3 tons/ha</dd></div>
                        <div><dt>Production</dt><dd id="selected-production">163.4 tons</dd></div>
                    </dl>
                </div>
            </aside>

            <section class="map-panel">
                <div id="map" aria-label="Interactive crop map of Manolo Fortich"></div>
                <div class="map-overlay map-title">
                    <span class="map-pin">+</span>
                    <div><strong>Manolo Fortich</strong><small>Bukidnon, Philippines</small></div>
                </div>
                <div class="map-overlay map-legend">
                    <strong>Estimated production</strong>
                    <span><i class="legend-dot legend-dot--excellent"></i>80+ tons</span>
                    <span><i class="legend-dot legend-dot--moderate"></i>50-79 tons</span>
                    <span><i class="legend-dot legend-dot--low"></i>20-49 tons</span>
                    <span><i class="legend-line"></i>Manolo Fortich boundary</span>
                    <span><i class="legend-line legend-line--barangay"></i>Barangay boundaries</span>
                </div>
            </section>
        </section>
    </main>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js"></script>
    <script>
        window.sentinelHubConfig = <?= json_encode([
            'url' => $sentinelHubUrl,
            'token' => $sentinelHubToken,
        ], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
    </script>
    <script src="js/app.js"></script>
</body>
</html>
