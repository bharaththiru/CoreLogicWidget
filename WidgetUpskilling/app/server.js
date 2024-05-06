const axios = require('axios');
const express = require('express');
const qs = require('querystring');
const app = express();

const clientId = 'HMo1dGwAnWNQbyGejWswyNuE51A8izko';
const clientSecret = 'zvTCkMvDcOa8bqQP';

//Token Expiry: 12 hours
const accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJDUlQiLCJNQVAiLCJQVFkiLCJTR1QiLCJTVFMiLCJUVEwiXSwicm9sZXMiOltdLCJpc3MiOiJodHRwczovL2FjY2Vzcy1hcGkuY29yZWxvZ2ljLmFzaWEiLCJlbnZfYWNjZXNzX3Jlc3RyaWN0Ijp0cnVlLCJleHAiOjE3MTUwNzgzOTMsImVudiI6InNhbmRib3giLCJnZW9fY29kZXMiOlsiQUNUIC0gRnVsbCBTdGF0ZSIsIk5TVyAtIE1ldHJvIiwiTlNXIC0gUmVnaW9uYWwiLCJOVCAtIEZ1bGwgU3RhdGUiLCJRTEQgLSBNZXRybyIsIlFMRCAtIFJlZ2lvbmFsIiwiU0EgLSBNZXRybyIsIlNBIC0gUmVnaW9uYWwiLCJUQVMgLSBGdWxsIFN0YXRlIiwiVklDIC0gKEFBKSBGdWxsIFN0YXRlIiwiVklDIC0gRnVsbCBTdGF0ZSIsIlZJQyAtIE1ldHJvIiwiVklDIC0gUmVnaW9uYWwiLCJXQSAtIE1ldHJvIiwiV0EgLSBSZWdpb25hbCIsIk5vcnRoIElzbGFuZCIsIlNvdXRoIElzbGFuZCJdLCJjbGllbnRfaWQiOiJITW8xZEd3QW5XTlFieUdlaldzd3lOdUU1MUE4aXprbyIsInNvdXJjZV9leGNsdXNpb24iOltdfQ.YSvypDBfi3uWYgtEtwQc5quHcklexamevxt7Kox1RF7pK-dRlFpoadaNpbYuCaURlC5UgM1c2kmBNU_n8Mvr-BQR94fyYHY78VMKBT_Un-RDxGcJZ4JOyW-uUQIYOHvzGaddj5Q1QkN866WdmOw5yWU2wWsX24P1PNgOfSx886g`;

const propertyId = '47872329'; // Hard coding property ID to test API call. Need to use search bar widget input. 

const authURL = `https://api-sbox.corelogic.asia/access/oauth/token`;

const coreDetailsURL = `https://api-sbox.corelogic.asia/property-details/au/properties/${propertyId}/attributes/core`; //core details url - beds, baths, etc.



const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };


//Fetching location details of property - to extract propertyID
app.get('/api/location', (req, res) => {
  const address = req.query.address;
  const getIDsURL = `https://api-uat.corelogic.asia/sandbox/property/au/v2/suggest.json?q=${address}`; //Need to extract LocationID using this data retrieved from this call
  
  axios.get(getIDsURL, options)
   .then(response => {

    // Set the Access-Control-Allow-Origin header to allow the client-side to access the response
    res.setHeader('Access-Control-Allow-Origin', 'https://127.0.0.1:5000'); // Replace with your actual client-side origin
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