<?php

declare(strict_types=1);

$pageTitle = 'Lambo | Agricultural Mapping';
$cropOptions = ['All crops', 'Corn', 'Rice', 'Cassava'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIINfQ3R8mZ4wY5M0gYyK2r1Y8n8L0pK1s=" crossorigin="">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="topbar">
        <a class="brand" href="index.php" aria-label="Lambo home">
            <span class="brand-mark">L</span>
            <span>Lambo</span>
        </a>
        <span class="location-label">Manolo Fortich Agricultural Map</span>
        <span class="status-badge"><span class="status-dot"></span>Data preview</span>
    </header>

    <main class="app-shell">
        <section class="page-heading">
            <div>
                <p class="eyebrow">Municipal agriculture</p>
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
                </div>
            </section>
        </section>
    </main>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="js/app.js"></script>
</body>
</html>
