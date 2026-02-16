#!/bin/bash
# Download all Census TIGER Place ZIPs - parallel version
DIR="/Users/hausbot/.openclaw/workspace/projects/texas-guesser/app/public/data/zips"
mkdir -p "$DIR"

FIPS=(01 02 04 05 06 08 09 10 11 12 13 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 44 45 46 47 49 50 51 53 54 55 56 60 66 69 78)

download_one() {
    local fips=$1
    local outfile="$DIR/tl_2020_${fips}_place.zip"
    if [ -f "$outfile" ] && [ -s "$outfile" ]; then
        echo "SKIP $fips"
        return
    fi
    local url="https://www2.census.gov/geo/tiger/TIGER2020/PLACE/tl_2020_${fips}_place.zip"
    for attempt in 1 2 3; do
        curl -sL --connect-timeout 30 --max-time 300 --retry 2 \
            -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
            -o "$outfile" "$url"
        if [ -s "$outfile" ]; then
            echo "OK $fips"
            return
        fi
        rm -f "$outfile"
        sleep $((attempt * 3))
    done
    echo "FAIL $fips"
}

export DIR
export -f download_one

# Run 4 parallel downloads
printf '%s\n' "${FIPS[@]}" | xargs -P 4 -I{} bash -c 'download_one "$@"' _ {}

echo "=== DONE ==="
ls "$DIR"/*.zip 2>/dev/null | wc -l
