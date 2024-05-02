const axios = require('axios');
const express = require('express');
const app = express();

// Replace with your actual values
const clientId = 'HMo1dGwAnWNQbyGejWswyNuE51A8izko';
const clientSecret = 'zvTCkMvDcOa8bqQP';

//Token Expiry: 12 hours
const accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJDUlQiLCJNQVAiLCJQVFkiLCJTR1QiLCJTVFMiLCJUVEwiXSwicm9sZXMiOltdLCJpc3MiOiJodHRwczovL2FjY2Vzcy1hcGkuY29yZWxvZ2ljLmFzaWEiLCJlbnZfYWNjZXNzX3Jlc3RyaWN0Ijp0cnVlLCJleHAiOjE3MTQ2NTMzNTgsImVudiI6InNhbmRib3giLCJnZW9fY29kZXMiOlsiQUNUIC0gRnVsbCBTdGF0ZSIsIk5TVyAtIE1ldHJvIiwiTlNXIC0gUmVnaW9uYWwiLCJOVCAtIEZ1bGwgU3RhdGUiLCJRTEQgLSBNZXRybyIsIlFMRCAtIFJlZ2lvbmFsIiwiU0EgLSBNZXRybyIsIlNBIC0gUmVnaW9uYWwiLCJUQVMgLSBGdWxsIFN0YXRlIiwiVklDIC0gKEFBKSBGdWxsIFN0YXRlIiwiVklDIC0gRnVsbCBTdGF0ZSIsIlZJQyAtIE1ldHJvIiwiVklDIC0gUmVnaW9uYWwiLCJXQSAtIE1ldHJvIiwiV0EgLSBSZWdpb25hbCIsIk5vcnRoIElzbGFuZCIsIlNvdXRoIElzbGFuZCJdLCJjbGllbnRfaWQiOiJITW8xZEd3QW5XTlFieUdlaldzd3lOdUU1MUE4aXprbyIsInNvdXJjZV9leGNsdXNpb24iOltdfQ.TYCHyPM8b9l2ev9xbQPIW7bWLyHI7CvVEO-VIYE0doE7sX6BpEKdXQ_jkMUxJAV6RKVjt0RuD_pWtwbk1t066HaSVJZ7VbKupevXEThLCCGeeGwSHQ10fdF0sUoKum8kmzpLmqxVldL3Fo10ytlpNyjF3WtiZ8feRulAqFbJlLU`;

const propertyId = '47872329'; // Hard coding property ID to test API call. Need to use search bar widget input. 
const coreDetailsURL = `https://api-sbox.corelogic.asia/property-details/au/properties/${propertyId}/attributes/core`; //core details url - beds, baths, etc.



const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

app.get('/api/location', (req, res) => {
  axios.get(coreDetailsURL, options)
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