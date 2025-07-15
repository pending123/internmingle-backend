const axios = require('axios');
const mapsKey = process.env.MAPS_API_KEY;
const walkscoreKey = process.env.WALKSCORE_API_KEY;

exports.getNeighborhoodData = async (req, res) => {
    let output = {
        'neighborhood': '',
        'latitude': '',
        'longitude': '',
        'walkScore': '',
        'walkDescription': '',
        'bikeScore': '',
        'bikeDescription': '',
        'transitScore': '',
        'transitDescription': '',
        'places' : []
    };
    try {
        const {query} = req.query;

        if (!query) {
            return res.status(400).json({error: 'A search query is required.' })
        }

        //Get latitude and longitude for query
        const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${mapsKey}`
        const { data : geocodeData } = await axios.get(geocodeURL);
        if (!geocodeData.results || geocodeData.results.length === 0) {
            return res.status(404).json({ error: 'Location not found.' });
        }
        
        output.latitude = geocodeData.results[0].geometry.location.lat;
        output.longitude = geocodeData.results[0].geometry.location.lng;

        //Get metrics for neighborhood
        const metricsURL = `https://api.walkscore.com/score?format=json&lat=${output.latitude}&lon=${output.longitude}&transit=1&bike=1&wsapikey=${walkscoreKey}`
        const {data: metricsData} = await axios.get(metricsURL);
        
        output.walkScore = metricsData.walkscore;
        output.walkDescription = metricsData.description;

        output.bikeScore = metricsData.bike?.score || 'N/A';
        output.bikeDescription = metricsData.bike?.description || 'N/A';
        
        output.transitScore = metricsData.transit?.score || 'N/A';
        output.transitDescription = metricsData.transit?.description || 'N/A';

        //Find nearby places
        const placesURL = 'https://places.googleapis.com/v1/places:searchNearby';
        const { data : placesData } = await axios.post(placesURL, {
            maxResultCount: 10,
            locationRestriction: {
                circle: {
                    center : {
                        latitude: output.latitude,
                        longitude: output.longitude
                    },
                    radius: 500.0
                }
            },
            rankPreference: "POPULARITY"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': mapsKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
            }
        });

        //Process places data
        output.places = placesData.places.map(place => ({
            name: place.displayName.text,
            address: place.formattedAddress
        }))

        
        const reverseURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${output.latitude},%20${output.longitude}&result_type=neighborhood&key=${mapsKey}`
        const response = await axios.get(reverseURL);
        const result = response.data.results[0];

        const parts = result.formatted_address.split(', ');
        output.neighborhood = parts.slice(0, -1).join(', ');

        console.log(output);

        res.json(output);
    } catch (err) {
        res.status(500).json({error: 'Error fetching neighborhood data.'});
    }
}