const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); 
const mapsKey = process.env.MAPS_API_KEY;

const getPlaceAutocomplete = async (req, res) => {
    const input = req.query.input; 

    try {
        const googleResponse = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input: input,
                key: mapsKey,
                types: 'address',
                components: 'country:us'
            },
        });
        res.json(googleResponse.data); // Forward Google's response (contains 'predictions' array)

    } catch (error) {
        console.error("Error Loading Map: ", error)
    }
}

const getPlaceDetails = async (req, res) => {
    const placeId = req.query.place_id; // The place_id from a selected autocomplete suggestion

    try {
        const googleResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                key: mapsKey,
                fields: 'name,formatted_address,geometry,place_id', 
            },
        });
        res.json(googleResponse.data); 

    } catch (error) {
        console.error("error getting data:", error)
    }
}

module.exports = {
    getPlaceAutocomplete,
    getPlaceDetails,
};