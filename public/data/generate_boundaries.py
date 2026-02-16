#!/usr/bin/env python3
"""Download Census TIGER/Line 2020 Place boundaries and convert to simplified GeoJSON."""

import os, sys, tempfile, zipfile, glob, shutil, time
import requests
import geopandas as gpd

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
ZIP_DIR = os.path.join(DATA_DIR, 'zips')
os.makedirs(ZIP_DIR, exist_ok=True)

STATES = {
    '01': 'alabama', '02': 'alaska', '04': 'arizona', '05': 'arkansas',
    '06': 'california', '08': 'colorado', '09': 'connecticut', '10': 'delaware',
    '11': 'dc', '12': 'florida', '13': 'georgia', '15': 'hawaii',
    '16': 'idaho', '17': 'illinois', '18': 'indiana', '19': 'iowa',
    '20': 'kansas', '21': 'kentucky', '22': 'louisiana', '23': 'maine',
    '24': 'maryland', '25': 'massachusetts', '26': 'michigan', '27': 'minnesota',
    '28': 'mississippi', '29': 'missouri', '30': 'montana', '31': 'nebraska',
    '32': 'nevada', '33': 'new_hampshire', '34': 'new_jersey', '35': 'new_mexico',
    '36': 'new_york', '37': 'north_carolina', '38': 'north_dakota', '39': 'ohio',
    '40': 'oklahoma', '41': 'oregon', '42': 'pennsylvania', '44': 'rhode_island',
    '45': 'south_carolina', '46': 'south_dakota', '47': 'tennessee',
    '49': 'utah', '50': 'vermont', '51': 'virginia', '53': 'washington',
    '54': 'west_virginia', '55': 'wisconsin', '56': 'wyoming',
    '60': 'american_samoa', '66': 'guam', '69': 'northern_mariana_islands',
    '78': 'us_virgin_islands',
}

LARGE_STATES = {'alaska', 'california', 'montana', 'new_mexico', 'arizona',
                'nevada', 'colorado', 'oregon', 'wyoming', 'michigan', 'utah',
                'idaho', 'kansas', 'nebraska', 'south_dakota', 'north_dakota',
                'oklahoma', 'missouri', 'washington', 'minnesota', 'iowa',
                'wisconsin', 'illinois', 'georgia', 'florida', 'new_york',
                'pennsylvania', 'ohio', 'virginia', 'north_carolina', 'indiana'}

URL = "https://www2.census.gov/geo/tiger/TIGER2020/PLACE/tl_2020_{fips}_place.zip"

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

def download_zip(fips):
    zippath = os.path.join(ZIP_DIR, f"tl_2020_{fips}_place.zip")
    if os.path.exists(zippath) and os.path.getsize(zippath) > 1000:
        return zippath
    
    url = URL.format(fips=fips)
    for attempt in range(3):
        try:
            r = session.get(url, stream=True, timeout=(30, 300))
            r.raise_for_status()
            with open(zippath, 'wb') as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            if os.path.getsize(zippath) > 1000:
                return zippath
        except Exception as e:
            print(f"    Download attempt {attempt+1} failed: {e}", flush=True)
            time.sleep(5 * (attempt + 1))
    
    return None

def process_state(fips, state_id):
    outfile = os.path.join(DATA_DIR, f"{state_id}_boundaries.geojson")
    if os.path.exists(outfile):
        print(f"  SKIP (exists)", flush=True)
        return True

    print(f"  Downloading...", flush=True)
    zippath = download_zip(fips)
    if not zippath:
        print(f"  ERROR: download failed", flush=True)
        return False

    tmpdir = tempfile.mkdtemp()
    try:
        with zipfile.ZipFile(zippath) as zf:
            zf.extractall(tmpdir)

        shpfiles = glob.glob(os.path.join(tmpdir, "*.shp"))
        if not shpfiles:
            print(f"  ERROR: No .shp", flush=True)
            return False

        gdf = gpd.read_file(shpfiles[0])
        tol = 0.002 if state_id in LARGE_STATES else 0.001
        gdf['geometry'] = gdf['geometry'].simplify(tol, preserve_topology=True)
        gdf = gdf[['NAME', 'geometry']].rename(columns={'NAME': 'name'})
        gdf.to_file(outfile, driver='GeoJSON')
        size_mb = os.path.getsize(outfile) / 1024 / 1024
        print(f"  OK: {len(gdf)} places, {size_mb:.1f} MB", flush=True)
        return True
    except Exception as e:
        print(f"  ERROR: {e}", flush=True)
        return False
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)

if __name__ == '__main__':
    failed = []
    total = len(STATES)
    for i, (fips, state_id) in enumerate(sorted(STATES.items(), key=lambda x: x[1]), 1):
        print(f"[{i}/{total}] [{fips}] {state_id}", flush=True)
        if not process_state(fips, state_id):
            failed.append(state_id)
        time.sleep(1)  # Be nice
    
    print(f"\nDone. {total - len(failed)}/{total} succeeded.", flush=True)
    if failed:
        print(f"Failed: {', '.join(failed)}", flush=True)
