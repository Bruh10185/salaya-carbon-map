# Salaya & Phutthamonthon Real-Time Carbon Credit & Green Zone Digital Map
**พิกัดและระบบติดตามคาร์บอนเครดิตและพื้นที่สีเขียวแบบเรียลไทม์ ศาลายา - พุทธมณฑล จังหวัดนครปฐม**

A state-of-the-art interactive geospatial digital map and environmental telemetry system designed for measuring carbon sequestration, biomass density (NDVI), and verified carbon credits under Thailand Greenhouse Gas Management Organization (TGO) T-VER standards in the **Salaya - Phutthamonthon Green Belt, Nakhon Pathom, Thailand**.

---

## 🌟 Key Features

1. **High-Precision Geospatial Boundaries (WGS84)**:
   - **Phutthamonthon Religious Forest & Park (สวนพุทธมณฑล)**: 2,500 Rai (400 ha), ~215,000 mature tropical trees.
   - **Mahidol University Salaya Eco-Campus (มหาวิทยาลัยมหิดล ศาลายา)**: 1,240 Rai (198.4 ha), including the BGCI-accredited Siri Rukkhachati Nature Park.
   - **Khlong Maha Sawat Agro-Tourism & Lotus Fields (คลองมหาสวัสดิ์ - นาบัว)**: 1,850 Rai (296 ha) UN FAO GIAHS agroforestry & wetland carbon sink.
   - **Utthayan Royal Avenue Green Corridor (ถนนอุทยาน / ถนนอักษะ)**: 210 Rai (33.6 ha) linear urban forest.
   - **The Royal Gems Golf & Salaya Lake Sanctuary (เดอะรอยัลเจมส์ ศาลายา)**: 1,150 Rai (184 ha) managed turf & agroforestry sink.
   - **Khlong Thawi Watthana Riparian Eco-Belt (แนวกันชนคลองทวีวัฒนา)**: 480 Rai (76.8 ha) riparian mangrove apple and wetland buffer.
   - **Salaya West Community Forest & Eco-Paddies (ป่าชุมชนศาลายาฝั่งตะวันตก)**: 1,360 Rai (217.6 ha) low-methane agro-landscape.

2. **Real-Time Carbon Credit Telemetry Engine**:
   - **Live Carbon Uptake Ticker**: Dynamically calculates net $CO_2$ absorption ($kg CO_2/hr$) in real-time.
   - **Diurnal Solar Curve Modeling**: Simulates Photosynthetically Active Radiation (PAR) peaking at noon ($12:00 - 13:00$) and transitioning to night-time baseline respiration ($19:00 - 05:30$).
   - **T-VER Standard Carbon Valuation**: Live valuation ticker in Thai Baht (฿) and USD based on official TGO carbon pricing standards (~฿350 / $tCO_2e$).

3. **Virtual IoT Flux Sensor Network**:
   - **Tower 01 (PTM-01)**: Phutthamonthon Core Eddy Covariance Flux Tower.
   - **Tower 02 (MUD-02)**: Mahidol Salaya Urban Canopy Monitor.
   - **Tower 03 (MSW-03)**: Maha Sawat Wetland Blue Carbon Hydrological Station.
   - **Tower 04 (UTY-04)**: Utthayan Boulevard Micro-Climate & Air Quality Monitor.
   - Streaming live metrics: Ambient $CO_2$ (ppm), Net Ecosystem Exchange ($NEE, \mu mol\cdot m^{-2}\cdot s^{-1}$), Temperature, Humidity, and Soil Organic Carbon ($g\text{ }C/kg$).

4. **Afforestation & Tree Planting Simulator ("What-if" Scenario Planner)**:
   - Select native Thai hardwood and tropical tree species:
     - **Teak (สัก - Tectona grandis)**: $28.5\text{ kg }CO_2\text{/yr/tree}$
     - **Rain Tree (จามจุรี - Samanea saman)**: $35.8\text{ kg }CO_2\text{/yr/tree}$
     - **Yang Na (ยางนา - Dipterocarpus alatus)**: $32.0\text{ kg }CO_2\text{/yr/tree}$
     - **Siamese Rosewood (พะยูง - Dalbergia cochinchinensis)**: $24.2\text{ kg }CO_2\text{/yr/tree}$
     - **Golden Shower (ราชพฤกษ์ - Cassia fistula)**: $19.5\text{ kg }CO_2\text{/yr/tree}$
   - Simulate custom planting plots (1 - 500 Rai), project 10-year cumulative credits, and dynamically add new verified planting zones to the digital map.

5. **Official T-VER Audit Report Generator**:
   - Compiles comprehensive carbon inventory breakdown tables.
   - Export official GeoJSON and telemetry datasets for carbon certification audits.

---

## 🚀 How to Run and View

### Quick Launch
- Double-click **`run.bat`** or open **`index.html`** in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
- Or run in terminal:
  ```powershell
  start index.html
  ```

---

## 📂 Project Architecture

```
salaya-carbon-map/
├── index.html        # Main GIS interface, HUD telemetry bar, and modal views
├── styles.css        # Glassmorphism dark eco styling, glowing radars, and responsive UI
├── data.js           # GeoJSON coordinates, botanical profiles, sensor nodes, and T-VER specs
├── app.js            # Real-time GIS controller, solar flux engine, and afforestation planner
├── run.bat           # 1-click launcher for Windows
└── README.md         # Documentation and scientific methodology
```

---

## 🔬 Scientific Methodology

- **IPCC AFOLU Guidelines (2006/2019 Refinement)**: Aboveground & Belowground Biomass ($AGB/BGB$) conversion equations with tropical canopy carbon fraction $CF = 0.47$.
- **T-VER Methodology Compliance**:
  - `T-VER-METH-FOR-01`: Large-scale Forest Conservation & Urban Carbon Sink.
  - `T-VER-METH-FOR-02`: Urban Greening & Campus Eco-Forestry.
  - `T-VER-METH-AGR-01`: Agro-ecological Biomass & Soil Organic Carbon.
  - `T-VER-METH-AGR-03`: Low-Emission Rice & Community Agroforestry.
