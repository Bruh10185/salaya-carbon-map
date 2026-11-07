/**
 * Salaya & Phutthamonthon Carbon Credit & Green Zone Geospatial Data
 * Location: Phutthamonthon District, Nakhon Pathom Province, Thailand
 * Coordinates Datum: WGS84
 * Standards: TGO (Thailand Greenhouse Gas Management Organization) T-VER & IPCC AFOLU Guidelines
 */

const SALAYA_GIS_DATA = {
    metadata: {
        region: "Salaya & Phutthamonthon (ศาลายา - พุทธมณฑล)",
        province: "Nakhon Pathom (นครปฐม)",
        country: "Thailand (ประเทศไทย)",
        center: [13.7850, 100.3200],
        defaultZoom: 14,
        tverStandardPriceTHB: 350.00, // THB per tCO2e (Thailand Voluntary Emission Reduction market average)
        usdExchangeRate: 36.50
    },

    // GeoJSON Feature Collection for Green Zones
    greenZones: {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": "zone-phutthamonthon-park",
                "properties": {
                    "nameEn": "Phutthamonthon Religious Forest & Park",
                    "nameTh": "สวนพุทธมณฑล และวนอุทยานพุทธศาสน์",
                    "category": "Protected Forest & Sanctuary",
                    "type": "forest",
                    "areaRai": 2500,
                    "areaHectares": 400.0,
                    "areaSqm": 4000000,
                    "treeCountEst": 215000,
                    "canopyDensityPct": 86.4,
                    "ndviIndex": 0.82,
                    "biomassDensityTonsHa": 142.5,
                    "carbonSeqRateTonsYear": 9200.0, // ~23.0 tCO2e/ha/yr
                    "tverCreditsYTD": 7820.5,
                    "dominantSpecies": [
                        "Hopea odorata (ตะเคียนทอง)",
                        "Dipterocarpus alatus (ยางนา)",
                        "Ficus religiosa (ต้นโพธิ์)",
                        "Samanea saman (จามจุรี)",
                        "Cassia fistula (ราชพฤกษ์)"
                    ],
                    "methodology": "T-VER-METH-FOR-01 (Large-scale Forest Conservation & Urban Carbon Sink)",
                    "description": "The largest ecological green lung in Western Bangkok and Nakhon Pathom. Features dense secondary tropical forest canopy, sacred groves, biodiversity corridors, and continuous lake retention basins."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [100.3120, 13.7815],
                        [100.3275, 13.7818],
                        [100.3282, 13.7740],
                        [100.3278, 13.7630],
                        [100.3125, 13.7628],
                        [100.3115, 13.7720],
                        [100.3120, 13.7815]
                    ]]
                }
            },
            {
                "type": "Feature",
                "id": "zone-mahidol-salaya",
                "properties": {
                    "nameEn": "Mahidol University Salaya Eco-Campus",
                    "nameTh": "มหาวิทยาลัยมหิดล ศาลายา (วิทยาเขตสีเขียว)",
                    "category": "Academic Urban Forest & Arboretum",
                    "type": "campus",
                    "areaRai": 1240,
                    "areaHectares": 198.4,
                    "areaSqm": 1984000,
                    "treeCountEst": 88400,
                    "canopyDensityPct": 71.2,
                    "ndviIndex": 0.76,
                    "biomassDensityTonsHa": 115.0,
                    "carbonSeqRateTonsYear": 3720.0, // ~18.75 tCO2e/ha/yr
                    "tverCreditsYTD": 3162.0,
                    "dominantSpecies": [
                        "Siri Rukkhachati Botanic Herbarium (พืชสมุนไพร)",
                        "Pterocarpus indicus (ประดู่)",
                        "Peltophorum dasyrrhachis (นนทรี)",
                        "Alstonia scholaris (พญาสัตบรรณ)",
                        "Tabebuia rosea (ชมพูพันธุ์ทิพย์)"
                    ],
                    "methodology": "T-VER-METH-FOR-02 (Urban Greening & Campus Eco-Forestry)",
                    "description": "Ranked among Thailand's greenest campuses (UI GreenMetric). Includes the BGCI-accredited Siri Rukkhachati Nature Park, Prince Mahidol Hall eco-basin, and continuous pedestrian shade canopies."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [100.3145, 13.8035],
                        [100.3315, 13.8038],
                        [100.3318, 13.7940],
                        [100.3305, 13.7885],
                        [100.3150, 13.7882],
                        [100.3142, 13.7960],
                        [100.3145, 13.8035]
                    ]]
                }
            },
            {
                "type": "Feature",
                "id": "zone-maha-sawat-agri",
                "properties": {
                    "nameEn": "Khlong Maha Sawat Agro-Tourism & Lotus Sanctuary",
                    "nameTh": "พื้นที่เกษตรกรรมชีวภาพและนาบัว คลองมหาสวัสดิ์",
                    "category": "Agroforestry & Wetland Carbon Sink",
                    "type": "wetland",
                    "areaRai": 1850,
                    "areaHectares": 296.0,
                    "areaSqm": 2960000,
                    "treeCountEst": 62000,
                    "canopyDensityPct": 68.5,
                    "ndviIndex": 0.72,
                    "biomassDensityTonsHa": 78.0,
                    "carbonSeqRateTonsYear": 3480.0, // ~11.75 tCO2e/ha/yr (wetland blue carbon & fruit trees)
                    "tverCreditsYTD": 2958.0,
                    "dominantSpecies": [
                        "Nelumbo nucifera (บัวหลวง / Lotus fields)",
                        "Citrus maxima (ส้มโอพันธุ์นครชัยศรี)",
                        "Mangifera indica (มะม่วง)",
                        "Musa acuminata (กล้วยหอมทอง)",
                        "Sonneratia caseolaris (ลำพู)"
                    ],
                    "methodology": "T-VER-METH-AGR-01 (Agro-ecological Biomass & Soil Organic Carbon)",
                    "description": "Traditional canal-based agro-ecosystem recognized by UN FAO GIAHS initiative. Combines permanent lotus wetlands, Pomelo orchards, and riparian organic agroforestry."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [100.2940, 13.8180],
                        [100.3380, 13.8185],
                        [100.3375, 13.8080],
                        [100.3150, 13.8070],
                        [100.2950, 13.8065],
                        [100.2940, 13.8180]
                    ]]
                }
            },
            {
                "type": "Feature",
                "id": "zone-utthayan-boulevard",
                "properties": {
                    "nameEn": "Utthayan Royal Avenue Green Corridor (Aksa)",
                    "nameTh": "ถนนอุทยาน (ถนนอักษะ) และแนวกันชนสีเขียว",
                    "category": "Linear Boulevard Urban Forest",
                    "type": "corridor",
                    "areaRai": 210,
                    "areaHectares": 33.6,
                    "areaSqm": 336000,
                    "treeCountEst": 14200,
                    "canopyDensityPct": 64.0,
                    "ndviIndex": 0.69,
                    "biomassDensityTonsHa": 92.0,
                    "carbonSeqRateTonsYear": 485.0, // ~14.4 tCO2e/ha/yr
                    "tverCreditsYTD": 412.0,
                    "dominantSpecies": [
                        "Roystonea regia (ปาล์มขวด)",
                        "Delonix regia (หางนกยูงฝรั่ง)",
                        "Samanea saman (จามจุรี)",
                        "Lagerstroemia speciosa (อินทนิลน้ำ)"
                    ],
                    "methodology": "T-VER-METH-FOR-02 (Linear Urban Canopy Buffer)",
                    "description": "Known as Thailand's most majestic boulevard. Wide landscaped median strips with multi-tier palm and flowering canopies connecting Phutthamonthon Sai 4 to Sai 3."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [100.3270, 13.7802],
                        [100.3640, 13.7785],
                        [100.3640, 13.7758],
                        [100.3272, 13.7775],
                        [100.3270, 13.7802]
                    ]]
                }
            },
            {
                "type": "Feature",
                "id": "zone-royal-gems",
                "properties": {
                    "nameEn": "Royal Gems Salaya Sanctuary & Eco-Fairways",
                    "nameTh": "เดอะรอยัลเจมส์ ศาลายา และพื้นที่ชุ่มน้ำกักเก็บคาร์บอน",
                    "category": "Managed Turf & Wooded Waterway",
                    "type": "greenspace",
                    "areaRai": 1150,
                    "areaHectares": 184.0,
                    "areaSqm": 1840000,
                    "treeCountEst": 42500,
                    "canopyDensityPct": 56.5,
                    "ndviIndex": 0.67,
                    "biomassDensityTonsHa": 65.0,
                    "carbonSeqRateTonsYear": 1640.0, // ~8.9 tCO2e/ha/yr
                    "tverCreditsYTD": 1394.0,
                    "dominantSpecies": [
                        "Bermuda Grass (Cynodon dactylon - Soil Carbon Sink)",
                        "Casuarina equisetifolia (สนทะเล)",
                        "Terminalia catappa (หูกวาง)",
                        "Corypha lecomtei (ลาน)"
                    ],
                    "methodology": "T-VER-METH-AGR-02 (Turfgrass & Water Retention Soil Sequestration)",
                    "description": "Extensive recreational green landscape featuring water hazard retention lakes, perimeter windbreaks, and well-managed organic turfgrass capturing substantial soil organic carbon."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [100.2860, 13.8210],
                        [100.3090, 13.8205],
                        [100.3095, 13.8055],
                        [100.2875, 13.8050],
                        [100.2860, 13.8210]
                    ]]
                }
            },
            {
                "type": "Feature",
                "id": "zone-thawi-watthana-canal",
                "properties": {
                    "nameEn": "Khlong Thawi Watthana Riparian Eco-Belt",
                    "nameTh": "แนวกันชนระบบนิเวศริมคลองทวีวัฒนา",
                    "category": "Riparian Wetland & Linear Forest",
                    "type": "corridor",
                    "areaRai": 480,
                    "areaHectares": 76.8,
                    "areaSqm": 768000,
                    "treeCountEst": 23600,
                    "canopyDensityPct": 67.8,
                    "ndviIndex": 0.71,
                    "biomassDensityTonsHa": 88.0,
                    "carbonSeqRateTonsYear": 1020.0, // ~13.28 tCO2e/ha/yr
                    "tverCreditsYTD": 867.0,
                    "dominantSpecies": [
                        "Sonneratia caseolaris (ลำพูริมน้ำ)",
                        "Bambusa vulgaris (ไผ่เหลือง)",
                        "Barringtonia acutangula (กระโดนน้ำ)",
                        "Pandanus amaryllifolius (เตยหอม)"
                    ],
                    "methodology": "T-VER-METH-FOR-02 (Riparian Wetland & Water Protection Forest)",
                    "description": "Critical biodiversity buffer along the Thawi Watthana water corridor filtering urban runoff while sequestering carbon in saturated organic soils and overhanging riverine trees."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [100.3450, 13.8180],
                        [100.3540, 13.8175],
                        [100.3510, 13.7550],
                        [100.3420, 13.7555],
                        [100.3450, 13.8180]
                    ]]
                }
            },
            {
                "type": "Feature",
                "id": "zone-salaya-west-community",
                "properties": {
                    "nameEn": "Salaya West Community Agro-Forest & Paddies",
                    "nameTh": "ป่าชุมชนและแปลงเกษตรอินทรีย์ ศาลายาฝั่งตะวันตก",
                    "category": "Community Woodlot & Eco-Paddy",
                    "type": "wetland",
                    "areaRai": 1360,
                    "areaHectares": 217.6,
                    "areaSqm": 2176000,
                    "treeCountEst": 49000,
                    "canopyDensityPct": 61.0,
                    "ndviIndex": 0.68,
                    "biomassDensityTonsHa": 72.0,
                    "carbonSeqRateTonsYear": 2110.0, // ~9.7 tCO2e/ha/yr
                    "tverCreditsYTD": 1793.5,
                    "dominantSpecies": [
                        "Oryza sativa (ข้าวหอมปทุม - alternate wetting and drying)",
                        "Azadirachta indica (สะเดา)",
                        "Pithecellobium dulce (มะขามเทศ)",
                        "Moringa oleifera (มะรุม)"
                    ],
                    "methodology": "T-VER-METH-AGR-03 (Low-Emission Rice & Agroforestry)",
                    "description": "Community-managed agro-landscape utilizing low-methane alternate wetting and drying (AWD) water management with boundary hardwood hedgerows."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [100.2920, 13.7820],
                        [100.3090, 13.7815],
                        [100.3085, 13.7620],
                        [100.2910, 13.7625],
                        [100.2920, 13.7820]
                    ]]
                }
            }
        ]
    },

    // Real-Time IoT Carbon Flux & Environmental Monitoring Stations
    iotSensors: [
        {
            "id": "sensor-ptm-core",
            "name": "Tower 01: Phutthamonthon Forest Flux Tower (PTM-01)",
            "zoneId": "zone-phutthamonthon-park",
            "coordinates": [13.7725, 100.3195],
            "type": "Eddy Covariance Tower",
            "status": "ONLINE",
            "batteryPct": 98,
            "ambientCO2_ppm": 394.2, // Clean air inside dense forest
            "temperature_C": 29.8,
            "humidity_RH": 74.2,
            "solarRadiation_Wm2": 680,
            "netEcosystemExchange_umol": -14.8, // Negative NEE indicates strong net CO2 uptake (photosynthesis > respiration)
            "soilMoisturePct": 42.1,
            "soilCarbonGramsKg": 38.6,
            "lastSync": "Just now"
        },
        {
            "id": "sensor-mahidol-eco",
            "name": "Tower 02: Mahidol Green Campus Station (MUD-02)",
            "zoneId": "zone-mahidol-salaya",
            "coordinates": [13.7965, 100.3235],
            "type": "Urban Canopy Monitor",
            "status": "ONLINE",
            "batteryPct": 94,
            "ambientCO2_ppm": 418.5,
            "temperature_C": 30.6,
            "humidity_RH": 69.5,
            "solarRadiation_Wm2": 710,
            "netEcosystemExchange_umol": -11.2,
            "soilMoisturePct": 36.8,
            "soilCarbonGramsKg": 32.1,
            "lastSync": "Just now"
        },
        {
            "id": "sensor-maha-sawat",
            "name": "Tower 03: Maha Sawat Wetland Eco-Sensor (MSW-03)",
            "zoneId": "zone-maha-sawat-agri",
            "coordinates": [13.8130, 100.3140],
            "type": "Blue Carbon Hydrological Station",
            "status": "ONLINE",
            "batteryPct": 89,
            "ambientCO2_ppm": 405.0,
            "temperature_C": 30.1,
            "humidity_RH": 78.4,
            "solarRadiation_Wm2": 695,
            "netEcosystemExchange_umol": -9.6,
            "soilMoisturePct": 68.2,
            "soilCarbonGramsKg": 44.2,
            "lastSync": "Just now"
        },
        {
            "id": "sensor-utthayan-corridor",
            "name": "Tower 04: Utthayan Boulevard Micro-Climate (UTY-04)",
            "zoneId": "zone-utthayan-boulevard",
            "coordinates": [13.7780, 100.3440],
            "type": "Roadside Canopy Air Quality Station",
            "status": "ONLINE",
            "batteryPct": 92,
            "ambientCO2_ppm": 435.6, // Higher due to vehicular proximity
            "temperature_C": 31.8,
            "humidity_RH": 65.0,
            "solarRadiation_Wm2": 725,
            "netEcosystemExchange_umol": -6.4,
            "soilMoisturePct": 31.5,
            "soilCarbonGramsKg": 26.4,
            "lastSync": "Just now"
        }
    ],

    // Tree Species Catalog for the Afforestation Simulator
    treeSpeciesCatalog: [
        {
            id: "sp-teak",
            nameEn: "Teak",
            nameTh: "ต้นสัก (Tectona grandis)",
            annualSeqKg: 28.5, // kg CO2 per tree per year
            growthRate: "Fast / Hardwood",
            idealSpacingMeters: 4.0,
            treesPerRai: 100,
            canopySpreadM: 8.0,
            tverFactor: 1.15
        },
        {
            id: "sp-rain-tree",
            nameEn: "Rain Tree",
            nameTh: "ต้นจามจุรี (Samanea saman)",
            annualSeqKg: 35.8,
            growthRate: "Very Fast / Massive Canopy",
            idealSpacingMeters: 8.0,
            treesPerRai: 25,
            canopySpreadM: 18.0,
            tverFactor: 1.30
        },
        {
            id: "sp-yang-na",
            nameEn: "Yang Na",
            nameTh: "ต้นยางนา (Dipterocarpus alatus)",
            annualSeqKg: 32.0,
            growthRate: "Moderate / Tall Emergent",
            idealSpacingMeters: 4.5,
            treesPerRai: 80,
            canopySpreadM: 10.0,
            tverFactor: 1.25
        },
        {
            id: "sp-rosewood",
            nameEn: "Siamese Rosewood",
            nameTh: "ต้นพะยูง (Dalbergia cochinchinensis)",
            annualSeqKg: 24.2,
            growthRate: "Moderate / High Density Wood",
            idealSpacingMeters: 3.5,
            treesPerRai: 130,
            canopySpreadM: 7.0,
            tverFactor: 1.20
        },
        {
            id: "sp-golden-shower",
            nameEn: "Golden Shower",
            nameTh: "ต้นราชพฤกษ์ (Cassia fistula)",
            annualSeqKg: 19.5,
            growthRate: "Moderate / National Flower",
            idealSpacingMeters: 4.0,
            treesPerRai: 100,
            canopySpreadM: 6.5,
            tverFactor: 1.05
        }
    ]
};
