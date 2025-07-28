const prisma = require("../db/prismaClient");
const axios = require('axios');
const unsplashKey = process.env.UNSPLASH_ACCESS_KEY

const getPhotoSearchResults = async (req, res) =>{
    const { query: searchTerm } = req.query
    try{
        const unsplashData = await axios.get('https://api.unsplash.com/search/photos', {
            params:{
                query: searchTerm,
                per_page: 10
            },
            headers: {
        Authorization: `Client-ID ${unsplashKey}`,
      },
        })
        res.json(unsplashData.data)

    }catch (error) {
    // --- DEFINITIVE FIX: Ensure no circular references are logged or sent ---

    let responseStatus = 500;
    let responseError = 'An unexpected error occurred while fetching photos.';
    let responseDetails = 'No additional details.'; // Default detail

    if (axios.isAxiosError(error)) { // Check if it's an Axios error
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            responseStatus = error.response.status;
            responseError = error.response.data?.errors || error.response.data?.message || `Unsplash API returned status ${error.response.status}`;
            responseDetails = JSON.stringify(error.response.data) || error.message; // Stringify data to be safe

            console.error("Unsplash API Response Error:", {
                status: error.response.status,
                data: error.response.data, // Log the raw data for debugging
                message: error.message // Log the Axios error message
            });
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and ClientRequest in node.js
            responseStatus = 503; // Service Unavailable or Gateway Timeout
            responseError = 'No response received from Unsplash API (network issue or timeout).';
            responseDetails = error.message;
            console.error("Unsplash API Request Error (no response):", error.message); // Log message, not raw request object
        } else {
            // Something happened in setting up the request that triggered an Error
            responseStatus = 500;
            responseError = 'Error setting up request to Unsplash API.';
            responseDetails = error.message;
            console.error("Unsplash API Request Setup Error:", error.message);
        }
    } else {
        // A non-Axios error occurred
        responseStatus = 500;
        responseError = 'An unknown error occurred.';
        responseDetails = error.message || JSON.stringify(error); // Try to stringify if it's a generic object
        console.error("Unknown Error in Unsplash API fetch:", error);
    }

    // Send the response to the frontend
    res.status(responseStatus).json({
        error: responseError,
        details: responseDetails
    });
    }
}
module.exports= {
    getPhotoSearchResults
}