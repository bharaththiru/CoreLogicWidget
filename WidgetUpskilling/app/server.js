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
var accessToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJDUlQiLCJNQVAiLCJQVFkiLCJTR1QiLCJTVFMiLCJUVEwiXSwicm9sZXMiOltdLCJpc3MiOiJodHRwczovL2FjY2Vzcy1hcGkuY29yZWxvZ2ljLmFzaWEiLCJlbnZfYWNjZXNzX3Jlc3RyaWN0Ijp0cnVlLCJleHAiOjE3MTU1OTg4MzgsImVudiI6InNhbmRib3giLCJnZW9fY29kZXMiOlsiQUNUIC0gRnVsbCBTdGF0ZSIsIk5TVyAtIE1ldHJvIiwiTlNXIC0gUmVnaW9uYWwiLCJOVCAtIEZ1bGwgU3RhdGUiLCJRTEQgLSBNZXRybyIsIlFMRCAtIFJlZ2lvbmFsIiwiU0EgLSBNZXRybyIsIlNBIC0gUmVnaW9uYWwiLCJUQVMgLSBGdWxsIFN0YXRlIiwiVklDIC0gKEFBKSBGdWxsIFN0YXRlIiwiVklDIC0gRnVsbCBTdGF0ZSIsIlZJQyAtIE1ldHJvIiwiVklDIC0gUmVnaW9uYWwiLCJXQSAtIE1ldHJvIiwiV0EgLSBSZWdpb25hbCIsIk5vcnRoIElzbGFuZCIsIlNvdXRoIElzbGFuZCJdLCJjbGllbnRfaWQiOiJITW8xZEd3QW5XTlFieUdlaldzd3lOdUU1MUE4aXprbyIsInNvdXJjZV9leGNsdXNpb24iOltdfQ.mITxNFOAjJ-mcU6d38o7-azvc1XiCqIkpU4F7Q7P2r8iWDuP-ZhD54k67Ko8y1pcecPrXNii0HL8CBtWsLcRTaJXFRyGBcMXKAv8STptptSosz8qdTk6DBNbrP_v2yUVvZinNpaGPN2CGgpl664R1uTC05s4e1eYNtoM35wbRM0`;
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

//--------------------------------------ZOHO---------------------------------------------------------
const zohoClientId = '1000.PFEU4I82AS879CBB6OJJ1L6Y7826UV';
const zohoClientSecret = '8e6d939c355bd408c57ed63f4c2fcb90c86b0691c5';
const zohoRedirectUri = 'https://127.0.0.1:5000/app/widget.html';
const zohoAccountsUrl = 'https://accounts.zoho.com.au'; // Change this according to your Zoho domain
const zohoGrantToken = '1000.9d6b7263ef21189173c45b54f28a96ee.e7a93044c71863cfb0350be828a46d03'

let zohoAccessToken = ''; // Variable to store Zoho access token
let zohoRefreshToken = '';

// Endpoint Call to GENERATE Zoho access token
app.post('/api/generate-zoho-token', async (req, res) => {
  try {
    // Make a POST request to generate the access token
    const response = await axios.post(`${zohoAccountsUrl}/oauth/v2/token`, qs.stringify({
      grant_type: 'authorization_code',
      client_id: zohoClientId,
      client_secret: zohoClientSecret,
      redirect_uri: zohoRedirectUri,
      code: zohoGrantToken // Assuming the grant token is sent in the request body
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    console.log(response.data);
    // Extract the access token from the response
    zohoAccessToken = response.data.access_token;
    zohoRefreshToken = response.data.refresh_token;
    console.log('Access Token: ',zohoAccessToken);
    console.log('Refresh Token: ', zohoRefreshToken);

    // Send the response with the access token
    res.status(200).json({ access_token: zohoAccessToken });
  } catch (error) {
    console.error('Error generating Zoho access token:', error);
    res.status(500).json({ error: 'Failed to generate Zoho access token' });
  }
});


//Endpoint / Call to REFRESH Zoho Access Token
app.post('/api/refresh-zoho-token', async (req, res) => {
  try {
    // Make a POST request to refresh the access token
    const response = await axios.post(`${zohoAccountsUrl}/oauth/v2/token?refresh_token=${zohoRefreshToken}&client_id=${zohoClientId}&client_secret=${zohoClientSecret}&grant_type=refresh_token`, null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    console.log(response.data);
    conaole.log(response);

    // Extract the new access token from the response
    zohoAccessToken = response.data.access_token;
    console.log('New Zoho access token:', zohoAccessToken);

    // Send the response with the new access token
    res.status(200).json({ access_token: zohoAccessToken });
  } catch (error) {
    console.error('Error refreshing Zoho access token:', error);
    res.status(500).json({ error: 'Failed to refresh Zoho access token' });
  }
});


//Create New Record in Zoho Module

app.post('/api/create-record/:properties', async (req, res) => {
  const moduleApiName = 'properties';
  const zohoCreateRecordUrl = `https://www.zohoapis.com/crm/v6/${moduleApiName}`;

  try {
    const response = await axios.post(zohoCreateRecordUrl, req.body, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${zohoAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('server token: ', zohoAccessToken);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating record (server):', error.response.data);
    console.log('server token: ', zohoAccessToken);
    res.status(500).json({ error: 'Failed to create record (Server)' });
  }
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});