const axios = require('axios');
const express = require('express');
const app = express();

// Replace with your actual values
const clientId = 'HMo1dGwAnWNQbyGejWswyNuE51A8izko';
const clientSecret = 'zvTCkMvDcOa8bqQP';
const accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJDUlQiLCJNQVAiLCJQVFkiLCJTR1QiLCJTVFMiLCJUVEwiXSwicm9sZXMiOltdLCJpc3MiOiJodHRwczovL2FjY2Vzcy1hcGkuY29yZWxvZ2ljLmFzaWEiLCJlbnZfYWNjZXNzX3Jlc3RyaWN0Ijp0cnVlLCJleHAiOjE3MTQ1Nzc2NjksImdlb19jb2RlcyI6WyJBQ1QgLSBGdWxsIFN0YXRlIiwiTlNXIC0gTWV0cm8iLCJOU1cgLSBSZWdpb25hbCIsIk5UIC0gRnVsbCBTdGF0ZSIsIlFMRCAtIE1ldHJvIiwiUUxEIC0gUmVnaW9uYWwiLCJTQSAtIE1ldHJvIiwiU0EgLSBSZWdpb25hbCIsIlRBUyAtIEZ1bGwgU3RhdGUiLCJWSUMgLSAoQUEpIEZ1bGwgU3RhdGUiLCJWSUMgLSBGdWxsIFN0YXRlIiwiVklDIC0gTWV0cm8iLCJWSUMgLSBSZWdpb25hbCIsIldBIC0gTWV0cm8iLCJXQSAtIFJlZ2lvbmFsIiwiTm9ydGggSXNsYW5kIiwiU291dGggSXNsYW5kIl0sImNsaWVudF9pZCI6IkhNbzFkR3dBbldOUWJ5R2VqV3N3eU51RTUxQThpemtvIiwic291cmNlX2V4Y2x1c2lvbiI6W119.vcU6OCGo2SeB1AErbWqOlbXQO-8siuj5DvVFLdVz4phg1yRF7GkiKbyJZjUNlppMMVDp7o_sgyKhjRODkl27N8qCDrHcynfH69IPCM5BMdekgLIAE0XplEATdw5f3bQeoUs2l-EwDM6IKBYa6wZLs5l_0FHff4WwjNEX6yQgfWE`;
//const propertyId = '47872329'; // Replace with your search bar input variable
//const streetName = `Margaret Street`

// Construct the CoreLogic API URL (replace with the specific endpoint you're using)
//const locationURL = `https://api-sbox.corelogic.asia/property-details/nz/properties/${propertyId}/location`; //location url
//const coreDetailsURL = `https://api-sbox.corelogic.asia/property-details/nz/properties/${propertyId}/attributes/core`; //core details url - beds, baths, etc.

const suggestionURL = `https://api-uat.corelogic.asia/sandbox/property/nz/v2/suggest.json?q=Margaret%20Street` //Specific url for testing

const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

app.get('/api/location', (req, res) => {
  axios.get(suggestionURL, options)
   .then(response => {

    // Set the Access-Control-Allow-Origin header to allow the client-side to access the response
    res.setHeader('Access-Control-Allow-Origin', 'https://127.0.0.1:5000'); // Replace with your actual client-side origin
    res.json(response.data);

      // Process the response data (property details)
      res.json(response.data);
    })
   .catch(error => {
      console.error('Error fetching property details:', error);
      res.status(500).json({ error: 'Error fetching property details' });
    });


});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});