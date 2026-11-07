/**
 * Salaya & Phutthamonthon Carbon Credit & Green Zone Engine
 * Main Application Logic & Real-Time GIS Controller
 */

class SalayaCarbonEngine {
    constructor() {
        this.gisData = SALAYA_GIS_DATA;
        this.map = null;
        this.activeBasemap = 'dark';
        this.tileLayers = {};
        this.geojsonLayer = null;
        this.sensorsLayerGroup = null;
        this.simulatedZonesGroup = null;
        
        // Simulation state
        this.isLiveMode = true;
        this.simulatedHour = 12.0; // noon by default when simulating
        this.currentSolarFlux = 0.85; // 0.0 to 1.0 multiplier
        this.baseAbsorptionHourlyKg = 2410.0; // Base total kg CO2/hr for all Salaya zones
        this.todayAccumulatedTons = 38.452;
        this.ytdAccumulatedTons = 18492.5;
        this.virtualZones = [];
        this.selectedFeature = null;

        // UI Element bindings
        this.initElements();
        this.initMap();
        this.initLayers();
        this.initRealtimeClock();
        this.bindEvents();
        this.updateTelemetryMetrics();
    }

    initElements() {
        this.el = {
            liveRateKg: document.getElementById('metric-live-rate'),
            todayCredits: document.getElementById('metric-today-credits'),
            todayValueThb: document.getElementById('metric-today-value'),
            totalGreenRai: document.getElementById('metric-total-rai'),
            totalGreenHa: document.getElementById('metric-total-ha'),
            avgNdvi: document.getElementById('metric-avg-ndvi'),
            timeDisplay: document.getElementById('time-display'),
            timeSlider: document.getElementById('time-slider'),
            liveModeToggle: document.getElementById('live-mode-toggle'),
            layerZonesToggle: document.getElementById('layer-zones-toggle'),
            layerHeatmapToggle: document.getElementById('layer-heatmap-toggle'),
            layerSensorsToggle: document.getElementById('layer-sensors-toggle'),
            inspectorPanel: document.getElementById('inspector-panel'),
            inspectorContent: document.getElementById('inspector-content'),
            treeSelect: document.getElementById('tree-species-select'),
            plantingRaiInput: document.getElementById('planting-rai-input'),
            plantingTreesVal: document.getElementById('planting-trees-val'),
            btnPlantSimulate: document.getElementById('btn-plant-simulate'),
            btnExportAudit: document.getElementById('btn-export-audit'),
            auditModal: document.getElementById('audit-modal'),
            btnCloseAuditModal: document.getElementById('btn-close-audit-modal')
        };
    }

    initMap() {
        if (typeof L === 'undefined') {
            console.warn("Leaflet CDN is offline or unavailable. Initializing Vector SVG GIS fallback engine.");
            this.initSvgFallbackMap();
            return;
        }

        const center = this.gisData.metadata.center;
        const zoom = this.gisData.metadata.defaultZoom;

        // Initialize Leaflet Map
        this.map = L.map('map', {
            center: center,
            zoom: zoom,
            minZoom: 12,
            maxZoom: 18,
            zoomControl: false
        });

        // Add custom zoom control in bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        // Tile Providers
        this.tileLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
            maxZoom: 19
        });

        this.tileLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{m}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        });

        this.tileLayers.topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        });

        // Default to dark mode
        this.tileLayers.dark.addTo(this.map);
    }

    initSvgFallbackMap() {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, #0f172a 0%, #060b13 100%); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <svg id="svg-map-canvas" viewBox="100.27 13.75 0.11 0.08" style="width: 100%; height: 100%; transform: scaleY(-1);">
                    <defs>
                        <pattern id="grid" width="0.01" height="0.01" patternUnits="userSpaceOnUse">
                            <path d="M 0.01 0 L 0 0 0 0.01" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.0003"/>
                        </pattern>
                    </defs>
                    <rect x="100.27" y="13.75" width="0.11" height="0.08" fill="url(#grid)" />
                    <!-- Polygons will be rendered here -->
                    <g id="svg-zones-layer"></g>
                    <!-- Sensors will be rendered here -->
                    <g id="svg-sensors-layer"></g>
                </svg>
            </div>
        `;

        const zonesLayer = document.getElementById('svg-zones-layer');
        const sensorsLayer = document.getElementById('svg-sensors-layer');

        this.gisData.greenZones.features.forEach(f => {
            const coords = f.geometry.coordinates[0];
            const pointsStr = coords.map(c => `${c[0]},${c[1]}`).join(' ');
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', pointsStr);
            polygon.setAttribute('fill', f.properties.type === 'forest' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(6, 182, 212, 0.45)');
            polygon.setAttribute('stroke', '#34d399');
            polygon.setAttribute('stroke-width', '0.0006');
            polygon.setAttribute('style', 'cursor: pointer; transition: fill 0.2s;');
            polygon.addEventListener('click', () => this.inspectZone(f));
            zonesLayer.appendChild(polygon);
        });

        this.gisData.iotSensors.forEach(s => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', s.coordinates[1]);
            circle.setAttribute('cy', s.coordinates[0]);
            circle.setAttribute('r', '0.0015');
            circle.setAttribute('fill', '#06b6d4');
            circle.setAttribute('stroke', '#ffffff');
            circle.setAttribute('stroke-width', '0.0004');
            circle.setAttribute('style', 'cursor: pointer;');
            circle.addEventListener('click', () => {
                alert(`IoT Sensor Station: ${s.name}\nAmbient CO2: ${s.ambientCO2_ppm} ppm\nNet Ecosystem Exchange: ${s.netEcosystemExchange_umol} µmol/m²s`);
            });
            sensorsLayer.appendChild(circle);
        });
    }

    initLayers() {
        if (!this.map || typeof L === 'undefined') return;

        // 1. Green Zones GeoJSON Layer
        this.geojsonLayer = L.geoJSON(this.gisData.greenZones, {
            style: (feature) => this.getFeatureStyle(feature, false),
            onEachFeature: (feature, layer) => {
                // Hover tooltips
                const props = feature.properties;
                layer.bindTooltip(`
                    <div style="font-weight: 700; color: #10b981; font-size: 13px;">${props.nameEn}</div>
                    <div style="font-size: 11px; color: #cbd5e1;">${props.nameTh}</div>
                    <div style="margin-top: 4px; font-size: 11px;">
                        <span>Area: <b>${props.areaRai.toLocaleString()} Rai</b> (${props.areaHectares} ha)</span><br>
                        <span>Seq Rate: <b style="color: #34d399;">${props.carbonSeqRateTonsYear.toLocaleString()} tCO₂e/yr</b></span>
                    </div>
                `, { sticky: true, opacity: 0.95, className: 'zone-tooltip' });

                // Click event to inspect
                layer.on({
                    mouseover: (e) => {
                        const l = e.target;
                        l.setStyle({
                            weight: 3,
                            color: '#34d399',
                            fillOpacity: 0.65
                        });
                        l.bringToFront();
                    },
                    mouseout: (e) => {
                        this.geojsonLayer.resetStyle(e.target);
                    },
                    click: (e) => {
                        this.inspectZone(feature);
                        this.map.flyToBounds(e.target.getBounds(), { padding: [50, 50], duration: 1.2 });
                    }
                });
            }
        }).addTo(this.map);

        // 2. Real-Time IoT Sensors Group
        this.sensorsLayerGroup = L.layerGroup().addTo(this.map);
        this.renderSensors();

        // 3. Virtual Afforestation Group
        this.simulatedZonesGroup = L.layerGroup().addTo(this.map);
    }

    getFeatureStyle(feature, isHeatmapMode) {
        const props = feature.properties;

        if (isHeatmapMode) {
            // Color based on carbon sequestration density per hectare
            const seqDensity = props.carbonSeqRateTonsYear / props.areaHectares;
            let fillColor = '#84cc16';
            if (seqDensity >= 20.0) fillColor = '#059669'; // High emerald
            else if (seqDensity >= 15.0) fillColor = '#10b981';
            else if (seqDensity >= 10.0) fillColor = '#06b6d4';
            else fillColor = '#eab308';

            return {
                fillColor: fillColor,
                weight: 2,
                opacity: 0.9,
                color: '#ffffff',
                fillOpacity: 0.7
            };
        }

        // Standard Categorical Style
        const categoryColors = {
            'forest': { fill: '#059669', stroke: '#10b981' },
            'campus': { fill: '#0d9488', stroke: '#2dd4bf' },
            'wetland': { fill: '#0284c7', stroke: '#38bdf8' },
            'corridor': { fill: '#65a30d', stroke: '#a3e635' },
            'greenspace': { fill: '#16a34a', stroke: '#4ade80' }
        };

        const theme = categoryColors[props.type] || { fill: '#10b981', stroke: '#34d399' };

        return {
            fillColor: theme.fill,
            weight: 2,
            opacity: 0.85,
            color: theme.stroke,
            dashArray: '',
            fillOpacity: 0.42
        };
    }

    renderSensors() {
        this.sensorsLayerGroup.clearLayers();

        this.gisData.iotSensors.forEach(sensor => {
            const sensorIcon = L.divIcon({
                className: 'sensor-marker-wrapper',
                html: `<div class="sensor-marker-pin" title="${sensor.name}">
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const marker = L.marker(sensor.coordinates, { icon: sensorIcon });

            marker.bindPopup(`
                <div style="min-width: 240px; padding: 4px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 10px; background: rgba(6,182,212,0.2); color: #06b6d4; padding: 2px 6px; border-radius: 4px; font-weight: 700;">LIVE TELEMETRY</span>
                        <span style="font-size: 11px; color: #10b981;">● Online</span>
                    </div>
                    <div style="font-weight: 700; font-size: 13px; color: #f8fafc;">${sensor.name}</div>
                    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">Station Type: ${sensor.type}</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px;">
                        <div>
                            <span style="color: #94a3b8;">Ambient CO₂:</span><br>
                            <b style="color: #38bdf8; font-size: 13px;">${sensor.ambientCO2_ppm} ppm</b>
                        </div>
                        <div>
                            <span style="color: #94a3b8;">Net Flux (NEE):</span><br>
                            <b style="color: #34d399; font-size: 13px;">${sensor.netEcosystemExchange_umol} µmol/m²s</b>
                        </div>
                        <div>
                            <span style="color: #94a3b8;">Solar Radiation:</span><br>
                            <b>${sensor.solarRadiation_Wm2} W/m²</b>
                        </div>
                        <div>
                            <span style="color: #94a3b8;">Temp / RH:</span><br>
                            <b>${sensor.temperature_C}°C / ${sensor.humidity_RH}%</b>
                        </div>
                    </div>
                    <div style="margin-top: 8px; font-size: 10px; color: #64748b; text-align: right;">
                        Soil Carbon: ${sensor.soilCarbonGramsKg} g C/kg | Sync: Real-time
                    </div>
                </div>
            `);

            this.sensorsLayerGroup.addLayer(marker);
        });
    }

    initRealtimeClock() {
        // Ticking interval every 1.5 seconds
        setInterval(() => {
            let currentHour;
            let timeStr;

            if (this.isLiveMode) {
                const now = new Date();
                currentHour = now.getHours() + (now.getMinutes() / 60) + (now.getSeconds() / 3600);
                timeStr = now.toLocaleTimeString('en-US', { hour12: false });
                if (this.el.timeSlider) {
                    this.el.timeSlider.value = currentHour.toFixed(2);
                }
            } else {
                currentHour = parseFloat(this.el.timeSlider.value);
                const h = Math.floor(currentHour);
                const m = Math.floor((currentHour - h) * 60);
                timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00 (Simulated)`;
            }

            if (this.el.timeDisplay) {
                this.el.timeDisplay.innerText = timeStr;
            }

            // Calculate Solar Flux curve based on hour (bell curve peaking at 12:30 PM)
            // Sunrise ~ 06:00, Sunset ~ 18:30
            if (currentHour >= 5.8 && currentHour <= 18.5) {
                const peak = 12.25;
                const distance = Math.abs(currentHour - peak);
                // Gaussian curve
                this.currentSolarFlux = Math.max(0.08, Math.exp(-Math.pow(distance / 3.4, 2)));
            } else {
                // Night time: negative or minimal (respiration phase)
                this.currentSolarFlux = -0.05; 
            }

            // Live increment
            const virtualBonus = this.virtualZones.reduce((sum, z) => sum + z.hourlyAbsorptionKg, 0);
            const totalHourlyKg = (this.baseAbsorptionHourlyKg + virtualBonus) * Math.max(0.12, this.currentSolarFlux);
            
            // Add live carbon accumulation (each tick is 1.5s = 1.5 / 3600 hrs)
            const tickHours = 1.5 / 3600;
            const tonsCapturedThisTick = (totalHourlyKg * tickHours) / 1000.0;
            this.todayAccumulatedTons += tonsCapturedThisTick;
            this.ytdAccumulatedTons += tonsCapturedThisTick;

            // Micro-variations in sensors
            this.updateSensorsTelemetry(this.currentSolarFlux);

            // Update UI Counters
            this.updateTelemetryMetrics(totalHourlyKg);

        }, 1500);
    }

    updateSensorsTelemetry(solarFlux) {
        this.gisData.iotSensors.forEach(sensor => {
            const jitter = (Math.random() - 0.5) * 0.4;
            sensor.ambientCO2_ppm = +(sensor.ambientCO2_ppm + jitter).toFixed(1);
            sensor.solarRadiation_Wm2 = Math.max(0, Math.round(750 * Math.max(0, solarFlux) + (Math.random() * 20 - 10)));
            
            // If night, NEE becomes positive (respiration release), daylight it is strongly negative (uptake)
            if (solarFlux > 0.1) {
                sensor.netEcosystemExchange_umol = +(-1 * (6.0 + 9.5 * solarFlux) + jitter).toFixed(1);
            } else {
                sensor.netEcosystemExchange_umol = +(1.8 + Math.random() * 0.8).toFixed(1);
            }
        });
    }

    updateTelemetryMetrics(currentHourlyKg = 2410.0) {
        if (this.el.liveRateKg) {
            this.el.liveRateKg.innerText = `${currentHourlyKg.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg/h`;
        }

        if (this.el.todayCredits) {
            this.el.todayCredits.innerText = `${this.todayAccumulatedTons.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} tCO₂e`;
        }

        if (this.el.todayValueThb) {
            const valThb = this.todayAccumulatedTons * this.gisData.metadata.tverStandardPriceTHB;
            this.el.todayValueThb.innerText = `฿${valThb.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        }

        // Totals including simulated zones
        let totalRai = this.gisData.greenZones.features.reduce((sum, f) => sum + f.properties.areaRai, 0);
        let totalHa = this.gisData.greenZones.features.reduce((sum, f) => sum + f.properties.areaHectares, 0);

        this.virtualZones.forEach(z => {
            totalRai += z.areaRai;
            totalHa += z.areaHa;
        });

        if (this.el.totalGreenRai) this.el.totalGreenRai.innerText = `${totalRai.toLocaleString()} ไร่`;
        if (this.el.totalGreenHa) this.el.totalGreenHa.innerText = `${totalHa.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ha`;
        if (this.el.avgNdvi) this.el.avgNdvi.innerText = `0.742`;
    }

    inspectZone(feature) {
        this.selectedFeature = feature;
        const p = feature.properties;
        const dailyTons = (p.carbonSeqRateTonsYear / 365).toFixed(2);
        const dailyValThb = (dailyTons * this.gisData.metadata.tverStandardPriceTHB).toLocaleString(undefined, { maximumFractionDigits: 0 });
        const annualValThb = (p.carbonSeqRateTonsYear * this.gisData.metadata.tverStandardPriceTHB).toLocaleString(undefined, { maximumFractionDigits: 0 });

        const speciesHtml = p.dominantSpecies.map(s => `<span class="species-chip">${s}</span>`).join('');

        this.el.inspectorContent.innerHTML = `
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #10b981; font-weight: 700;">${p.category}</span>
                        <h2 style="font-size: 17px; font-weight: 800; color: #f8fafc; margin-top: 2px;">${p.nameEn}</h2>
                        <h3 style="font-size: 13px; color: #94a3b8; font-weight: 500;">${p.nameTh}</h3>
                    </div>
                    <button id="btn-close-inspector" style="background: transparent; border: none; color: #64748b; font-size: 20px; cursor: pointer;">✕</button>
                </div>
                <p style="font-size: 12px; color: #cbd5e1; margin-top: 10px; line-height: 1.5;">${p.description}</p>
            </div>

            <!-- Key Zone Metrics Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                <div class="glass-panel" style="padding: 10px; background: rgba(30,41,59,0.5);">
                    <div style="font-size: 11px; color: #94a3b8;">Total Area (พื้นที่)</div>
                    <div style="font-size: 16px; font-weight: 800; color: #f8fafc; margin-top: 2px;">${p.areaRai.toLocaleString()} ไร่</div>
                    <div style="font-size: 11px; color: #64748b;">${p.areaHectares} ha (${(p.areaSqm / 1000000).toFixed(2)} km²)</div>
                </div>

                <div class="glass-panel" style="padding: 10px; background: rgba(30,41,59,0.5);">
                    <div style="font-size: 11px; color: #94a3b8;">Est. Tree Count (ต้นไม้)</div>
                    <div style="font-size: 16px; font-weight: 800; color: #34d399; margin-top: 2px;">~${p.treeCountEst.toLocaleString()} ต้น</div>
                    <div style="font-size: 11px; color: #64748b;">Canopy: ${p.canopyDensityPct}%</div>
                </div>

                <div class="glass-panel" style="padding: 10px; background: rgba(30,41,59,0.5);">
                    <div style="font-size: 11px; color: #94a3b8;">Annual Carbon Sink</div>
                    <div style="font-size: 16px; font-weight: 800; color: #38bdf8; margin-top: 2px;">${p.carbonSeqRateTonsYear.toLocaleString()} <span style="font-size: 12px;">tCO₂e/yr</span></div>
                    <div style="font-size: 11px; color: #64748b;">~${(p.carbonSeqRateTonsYear / p.areaHectares).toFixed(1)} tCO₂e / ha / yr</div>
                </div>

                <div class="glass-panel" style="padding: 10px; background: rgba(30,41,59,0.5);">
                    <div style="font-size: 11px; color: #94a3b8;">Economic Value (มูลค่า)</div>
                    <div style="font-size: 16px; font-weight: 800; color: #f59e0b; margin-top: 2px;">฿${annualValThb}</div>
                    <div style="font-size: 11px; color: #64748b;">@ ฿${this.gisData.metadata.tverStandardPriceTHB}/tCO₂e T-VER</div>
                </div>
            </div>

            <!-- Botanical Profile & Dominant Species -->
            <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">Dominant Species & Vegetation (พันธุ์ไม้เด่น):</div>
                <div>${speciesHtml}</div>
            </div>

            <!-- T-VER Carbon Registry Specification -->
            <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(16,185,129,0.25); border-radius: 10px; padding: 12px; font-size: 11px;">
                <div style="color: #10b981; font-weight: 700; margin-bottom: 4px;">T-VER Standard Compliance (มาตรฐาน TGO)</div>
                <div style="color: #94a3b8; line-height: 1.4;">Methodology: <b style="color: #cbd5e1;">${p.methodology}</b></div>
                <div style="color: #94a3b8; margin-top: 4px;">NDVI Vegetation Index: <b style="color: #34d399;">${p.ndviIndex}</b> | Biomass: <b style="color: #34d399;">${p.biomassDensityTonsHa} tons/ha</b></div>
                <div style="color: #94a3b8; margin-top: 4px;">Verified Credits YTD: <b style="color: #38bdf8;">${p.tverCreditsYTD.toLocaleString()} tCO₂e</b></div>
            </div>

            <!-- Action buttons -->
            <div style="display: flex; gap: 8px; margin-top: 16px;">
                <button id="btn-zoom-zone" class="btn-cyan" style="flex: 1; padding: 8px; border-radius: 8px; border: none; cursor: pointer; font-size: 12px;">Zoom into Zone</button>
                <button id="btn-simulate-zone-tree" class="btn-emerald" style="flex: 1; padding: 8px; border-radius: 8px; border: none; cursor: pointer; font-size: 12px;">Plan Afforestation Here</button>
            </div>
        `;

        this.el.inspectorPanel.classList.remove('collapsed');

        // Bind inner buttons
        document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
            this.el.inspectorPanel.classList.add('collapsed');
        });

        document.getElementById('btn-zoom-zone')?.addEventListener('click', () => {
            if (this.map && typeof L !== 'undefined') {
                const bounds = L.geoJSON(feature).getBounds();
                this.map.fitBounds(bounds, { padding: [80, 80] });
            }
        });

        document.getElementById('btn-simulate-zone-tree')?.addEventListener('click', () => {
            // Scroll down to the simulator dock
            const simCard = document.getElementById('afforestation-card');
            simCard?.scrollIntoView({ behavior: 'smooth' });
            simCard?.classList.add('border-emerald-glow');
            setTimeout(() => simCard?.classList.remove('border-emerald-glow'), 2000);
        });
    }

    bindEvents() {
        // Basemap switches
        document.querySelectorAll('input[name="basemap"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const selected = e.target.value;
                Object.values(this.tileLayers).forEach(layer => this.map.removeLayer(layer));
                this.tileLayers[selected].addTo(this.map);
                this.activeBasemap = selected;
            });
        });

        // Layer toggles
        this.el.layerZonesToggle?.addEventListener('change', (e) => {
            if (e.target.checked) this.map.addLayer(this.geojsonLayer);
            else this.map.removeLayer(this.geojsonLayer);
        });

        this.el.layerSensorsToggle?.addEventListener('change', (e) => {
            if (e.target.checked) this.map.addLayer(this.sensorsLayerGroup);
            else this.map.removeLayer(this.sensorsLayerGroup);
        });

        this.el.layerHeatmapToggle?.addEventListener('change', (e) => {
            const isHeatmap = e.target.checked;
            this.geojsonLayer.eachLayer(layer => {
                layer.setStyle(this.getFeatureStyle(layer.feature, isHeatmap));
            });
        });

        // Diurnal Time Slider
        this.el.timeSlider?.addEventListener('input', () => {
            if (this.el.liveModeToggle) this.el.liveModeToggle.checked = false;
            this.isLiveMode = false;
        });

        this.el.liveModeToggle?.addEventListener('change', (e) => {
            this.isLiveMode = e.target.checked;
        });

        // Quick Zone Jump buttons
        document.querySelectorAll('.zone-quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-zone-id');
                if (targetId === 'all') {
                    this.map?.flyTo(this.gisData.metadata.center, this.gisData.metadata.defaultZoom);
                } else {
                    const feature = this.gisData.greenZones.features.find(f => f.id === targetId);
                    if (feature) {
                        this.inspectZone(feature);
                        if (this.map && typeof L !== 'undefined') {
                            const bounds = L.geoJSON(feature).getBounds();
                            this.map.flyToBounds(bounds, { padding: [60, 60] });
                        }
                    }
                }
            });
        });

        // Tree species selector and simulator
        this.populateTreeSpeciesDropdown();
        this.el.plantingRaiInput?.addEventListener('input', () => this.updatePlantingPreview());
        this.el.treeSelect?.addEventListener('change', () => this.updatePlantingPreview());

        this.el.btnPlantSimulate?.addEventListener('click', () => {
            this.executeVirtualPlanting();
        });

        // Audit Modal events
        this.el.btnExportAudit?.addEventListener('click', () => {
            this.openAuditModal();
        });

        this.el.btnCloseAuditModal?.addEventListener('click', () => {
            this.el.auditModal.style.display = 'none';
        });

        document.getElementById('btn-download-json')?.addEventListener('click', () => {
            this.downloadGeoJSON();
        });
    }

    populateTreeSpeciesDropdown() {
        if (!this.el.treeSelect) return;
        this.el.treeSelect.innerHTML = this.gisData.treeSpeciesCatalog.map(sp => `
            <option value="${sp.id}">${sp.nameEn} (${sp.nameTh}) - ${sp.annualSeqKg} kg CO₂/yr</option>
        `).join('');
        this.updatePlantingPreview();
    }

    updatePlantingPreview() {
        const speciesId = this.el.treeSelect?.value;
        const rai = parseFloat(this.el.plantingRaiInput?.value) || 10;
        const species = this.gisData.treeSpeciesCatalog.find(s => s.id === speciesId) || this.gisData.treeSpeciesCatalog[0];

        const estimatedTrees = Math.round(rai * species.treesPerRai);
        const annualSeqKg = estimatedTrees * species.annualSeqKg;
        const annualSeqTons = (annualSeqKg / 1000.0).toFixed(2);
        const annualRevenueThb = (annualSeqTons * this.gisData.metadata.tverStandardPriceTHB).toLocaleString(undefined, { maximumFractionDigits: 0 });

        if (this.el.plantingTreesVal) {
            this.el.plantingTreesVal.innerText = `${estimatedTrees.toLocaleString()} trees (~${annualSeqTons} tCO₂e/yr | ฿${annualRevenueThb})`;
        }
    }

    executeVirtualPlanting() {
        const speciesId = this.el.treeSelect?.value;
        const rai = parseFloat(this.el.plantingRaiInput?.value) || 10;
        const species = this.gisData.treeSpeciesCatalog.find(s => s.id === speciesId) || this.gisData.treeSpeciesCatalog[0];
        const ha = rai * 0.16; // 1 Rai = 0.16 ha
        const treeCount = Math.round(rai * species.treesPerRai);
        const annualSeqTons = (treeCount * species.annualSeqKg) / 1000.0;
        const hourlyKg = annualSeqTons * 1000.0 / (365 * 10); // daylight hours approx

        // Create virtual circle/polygon near Salaya north/west
        const centerLat = 13.8050 + (Math.random() - 0.5) * 0.02;
        const centerLng = 100.3200 + (Math.random() - 0.5) * 0.02;
        const radiusM = Math.sqrt(rai * 1600 / Math.PI);

        if (this.simulatedZonesGroup && typeof L !== 'undefined') {
            const circle = L.circle([centerLat, centerLng], {
                radius: radiusM,
                color: '#f59e0b',
                fillColor: '#10b981',
                fillOpacity: 0.6,
                weight: 3,
                dashArray: '5, 5'
            });

            circle.bindTooltip(`
                <div style="color: #f59e0b; font-weight: 800;">Simulated Afforestation Zone #${this.virtualZones.length + 1}</div>
                <div style="font-size: 11px;">Species: <b>${species.nameEn}</b></div>
                <div style="font-size: 11px;">Area: <b>${rai} Rai</b> (${treeCount.toLocaleString()} trees)</div>
                <div style="font-size: 11px; color: #34d399;">+${annualSeqTons.toFixed(1)} tCO₂e/yr</div>
            `);

            this.simulatedZonesGroup.addLayer(circle);
            this.map?.flyTo([centerLat, centerLng], 14.5, { duration: 1.0 });
        }

        this.virtualZones.push({
            id: `virtual-${Date.now()}`,
            species: species.nameEn,
            areaRai: rai,
            areaHa: ha,
            treeCount: treeCount,
            annualSeqTons: annualSeqTons,
            hourlyAbsorptionKg: hourlyKg
        });

        alert(`Successfully planned virtual afforestation in Salaya!\n\nSpecies: ${species.nameEn}\nArea: ${rai} Rai (${treeCount.toLocaleString()} trees)\nProjected Carbon Sequestration: +${annualSeqTons.toFixed(1)} tCO₂e/year\nEstimated Annual Value: ฿${(annualSeqTons * this.gisData.metadata.tverStandardPriceTHB).toLocaleString()} THB\n\nDynamic counters have been updated in real-time.`);
    }

    openAuditModal() {
        if (!this.el.auditModal) return;
        const totalRai = this.gisData.greenZones.features.reduce((sum, f) => sum + f.properties.areaRai, 0);
        const totalSeq = this.gisData.greenZones.features.reduce((sum, f) => sum + f.properties.carbonSeqRateTonsYear, 0);
        const totalVal = (totalSeq * this.gisData.metadata.tverStandardPriceTHB).toLocaleString();

        const tableRows = this.gisData.greenZones.features.map((f, i) => {
            const p = f.properties;
            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12px;">
                    <td style="padding: 8px 6px;">${i + 1}</td>
                    <td style="padding: 8px 6px; font-weight: 600; color: #f8fafc;">${p.nameEn}<br><span style="font-size: 10px; color: #94a3b8;">${p.nameTh}</span></td>
                    <td style="padding: 8px 6px;">${p.areaRai.toLocaleString()} ไร่</td>
                    <td style="padding: 8px 6px; color: #34d399; font-weight: 700;">${p.carbonSeqRateTonsYear.toLocaleString()}</td>
                    <td style="padding: 8px 6px; color: #f59e0b;">฿${(p.carbonSeqRateTonsYear * this.gisData.metadata.tverStandardPriceTHB).toLocaleString()}</td>
                    <td style="padding: 8px 6px; font-size: 11px; color: #cbd5e1;">${p.methodology.split(' ')[0]}</td>
                </tr>
            `;
        }).join('');

        document.getElementById('audit-table-body').innerHTML = tableRows;
        document.getElementById('audit-total-rai').innerText = `${totalRai.toLocaleString()} Rai`;
        document.getElementById('audit-total-co2').innerText = `${totalSeq.toLocaleString()} tCO₂e/yr`;
        document.getElementById('audit-total-value').innerText = `฿${totalVal} THB`;

        this.el.auditModal.style.display = 'flex';
    }

    downloadGeoJSON() {
        const exportObj = {
            metadata: this.gisData.metadata,
            generatedAt: new Date().toISOString(),
            greenZones: this.gisData.greenZones,
            sensors: this.gisData.iotSensors,
            simulatedAfforestation: this.virtualZones
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `Salaya_Carbon_Credit_Map_${new Date().toISOString().slice(0,10)}.geojson`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.carbonEngine = new SalayaCarbonEngine();
});
