# Puerto Rico Data Notes

## Municipality Dataset (`puerto_rico_cities.json`)
- **Total municipalities:** 78 (all included)
- **Population source:** 2020 U.S. Census (from Wikipedia)
- **Population range:** 1,792 (Culebra) to 342,259 (San Juan)
- **Total PR population (2020):** ~3,285,874
- **Coordinate source:** Municipality seat/urban center coordinates (well-known values)
- **Type field:** All set to "municipality" (PR's primary administrative division, equivalent to US counties)

## Outline (`puerto_rico_outline.geojson`)
- **Source:** github.com/unitedstates/districts (gh-pages/states/PR/shape.geojson)
- **Format:** MultiPolygon (includes main island, Vieques, Culebra, Mona)
- **Size:** ~25KB

## Municipality Boundaries (`puerto_rico_boundaries.geojson`)
- **Source:** US Census Bureau Cartographic Boundary Files (cb_2020_us_county_500k)
- **FIPS state code:** 72 (Puerto Rico)
- **Features:** 78 municipalities with NAME, GEOID, COUNTYFP properties
- **Size:** ~424KB
- **Note:** In Census data, PR municipalities are classified as counties (county-equivalents)

## CDPs (Census Designated Places)
- **Not included** in this dataset. PR municipalities function as both county and city; CDPs are less meaningful here since the entire island is covered by the 78 municipalities with no unincorporated gaps.
- Could be added later from Census PLACE files (FIPS 72) if needed.

## Known Issues
- Population data is from 2020 Census; PR has experienced significant population decline since 2010
- Some coordinate positions represent the urban center/pueblo rather than geographic centroid
- The outline GeoJSON may include small offshore islands (Mona, Desecheo)
