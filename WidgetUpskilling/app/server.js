const axios = require('axios');
const express = require('express');
const qs = require('querystring');
const app = express();
const cors = require('cors');
app.use(cors());

//Client ID and Client Secret

const clientId = 'HMo1dGwAnWNQbyGejWswyNuE51A8izko';
const clientSecret = 'zvTCkMvDcOa8bqQP';

//Token Expiry: 12 hours
var accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJDUlQiLCJNQVAiLCJQVFkiLCJTR1QiLCJTVFMiLCJUVEwiXSwicm9sZXMiOltdLCJpc3MiOiJodHRwczovL2FjY2Vzcy1hcGkuY29yZWxvZ2ljLmFzaWEiLCJlbnZfYWNjZXNzX3Jlc3RyaWN0Ijp0cnVlLCJleHAiOjE3MTUxNjg2NTksImVudiI6InNhbmRib3giLCJnZW9fY29kZXMiOlsiQUNUIC0gRnVsbCBTdGF0ZSIsIk5TVyAtIE1ldHJvIiwiTlNXIC0gUmVnaW9uYWwiLCJOVCAtIEZ1bGwgU3RhdGUiLCJRTEQgLSBNZXRybyIsIlFMRCAtIFJlZ2lvbmFsIiwiU0EgLSBNZXRybyIsIlNBIC0gUmVnaW9uYWwiLCJUQVMgLSBGdWxsIFN0YXRlIiwiVklDIC0gKEFBKSBGdWxsIFN0YXRlIiwiVklDIC0gRnVsbCBTdGF0ZSIsIlZJQyAtIE1ldHJvIiwiVklDIC0gUmVnaW9uYWwiLCJXQSAtIE1ldHJvIiwiV0EgLSBSZWdpb25hbCIsIk5vcnRoIElzbGFuZCIsIlNvdXRoIElzbGFuZCJdLCJjbGllbnRfaWQiOiJITW8xZEd3QW5XTlFieUdlaldzd3lOdUU1MUE4aXprbyIsInNvdXJjZV9leGNsdXNpb24iOltdfQ.UD0QWYemzH9y458J2WvdJJRt4oLVI5xpfHo26dtLQb_7C9svId1tn4xcI_7MaJ8pB0W6cxbTPeOvikSqHAs5UCHVHGXOGLrnBTf32muj4CHriD-bZt3nknzaVsJ4uP3xjiTmlbyYOjy-Yy__NxyKHf1seKivNqnP9dE1Ti876-g`;
const authURL = `https://api-sbox.corelogic.asia/access/oauth/token`;

//Generating API Token
app.post('/api/generate-token', async (req, res) => {
  try {
    // Make a POST request to generate the token
    const response = await axios.post(authURL, qs.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    // Extract the token from the response
    accessToken = response.data.access_token;
    console.log(accessToken);

    res.status(200).send('Token generated successfully');
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send('Failed to generate token');
  }
});


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
    res.json(response.data);
    })
   .catch(error => {
      console.error('Error fetching property details:', error);
      res.status(500).json({ error: 'Error fetching property details' });
    });

});

//Fetching core details using propertyId
app.get('/api/core-details', (req, res) => {
  const propertyId = req.query.propertyId;

  if(!propertyId) {
    res.status(400).json({ error: 'Missing propertyId' });
    return;
  }

  const coreDetailsURL = `https://api-sbox.corelogic.asia/property-details/au/properties/${propertyId}/attributes/core`; //core details url - beds, baths, etc.

  axios.get(coreDetailsURL, options)
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    console.error('Error fetching core details:', error);
    res.status(500).json({ error: 'Error fetching core details' });
  });

});




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});