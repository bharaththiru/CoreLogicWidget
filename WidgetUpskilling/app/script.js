let addressSuggestions;
let propertyId;
let zohoAccessToken = '';
let zohoRefreshToken = '';
const moduleApiName = 'properties';
let recordData;
let zohoGrantToken = '1000.9d6b7263ef21189173c45b54f28a96ee.e7a93044c71863cfb0350be828a46d03';
// Search Bar Functionality
document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.search-button').addEventListener('click', function (event) {
    event.preventDefault();
    const userInput = document.getElementById('search_bar').value;
    fetchSuggestions(userInput);
  });

  async function fetchSuggestions(userInput) {
    try {
      const response = await fetch(`http://localhost:3000/api/location?address=${userInput}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        throw new Error(data.messages[0].message);
      }
      console.log(data);
      addressSuggestions = data.suggestions;
      console.log(addressSuggestions);
      displaySuggestions(addressSuggestions); // Call the function directly with fetched data
    } catch (error) {
      console.error('Error fetching property details:', error);
      displayErrorMessage(error.message);
    }
  }

  function displaySuggestions(suggestions) {
    const suggestionList = document.getElementById('search_results');
    suggestionList.innerHTML = ''; // Clearing existing suggestions

    if (suggestions.length > 0) {
      // There are suggestions, display them
      suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion.suggestion;
        suggestionItem.addEventListener('click', () => {
          if (suggestion.suggestionType === 'address') {
            propertyId = suggestion.propertyId;
            fetchCoreDetails(propertyId);
          }
        });
        suggestionList.appendChild(suggestionItem);
      });
      // Clear any existing error message
      clearErrorMessage();
    } else {
      // No suggestions, clear the suggestion list and display an appropriate message
      suggestionList.innerHTML = '<li>No suggestions found</li>';
      // Display an appropriate message
      displayErrorMessage('No suggestions found');
    }
  }


  async function fetchCoreDetails(propertyId) {
    try {
      const response = await fetch(`http://localhost:3000/api/core-details?propertyId=${propertyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch core details');
      }
      const data = await response.json();
      console.log('Core Details:', data);
  
      const suggestionName = addressSuggestions.find(suggestion => suggestion.propertyId === propertyId).suggestion;
  
      recordData = {
        "data": [
          {
            "Layout": {
              "id": "72089000001126014"
            },
            "Name": suggestionName, // Assign suggestion name here
            "Property_Type": data.propertyType,
            "Property_Subtype": data.propertySubType,
            "Beds": data.beds,
            "Baths": data.baths,
            "Car_Spaces": data.carSpaces,
            "Land_Area": data.landArea,
          }
        ]
      };
  
      console.log('Record Data: ', recordData);
      displayPropertyDetails(data, suggestionName);
  
    } catch (error) {
      console.error('Error fetching core details:', error);
      displayErrorMessage(error.message);
    }
  }
  

  //API authentication
  document.getElementById('generate_token').addEventListener('click', () => {
    fetch('http://localhost:3000/api/generate-token', {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate token');
        }
        console.log('Token generated successfully');
      })
      .catch(error => {
        console.error('Error generating token:', error);
        displayErrorMessage(error.message);
      });
  });

  function displayErrorMessage(message) {
    const errorElement = document.getElementById('error_message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function clearErrorMessage() {
    const errorElement = document.getElementById('error_message');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  // Display property details

  // Inside displayPropertyDetails function
  function displayPropertyDetails(propertyDetails, suggestionName) {
    const propertyDetailsContainer = document.getElementById('search_results');
    const propertyDetailsTemplate = document.getElementById('propertyDetailsTemplate');
    const propertyDetailsClone = propertyDetailsTemplate.content.cloneNode(true);

    propertyDetailsClone.querySelector('#propertyAddress').textContent += suggestionName;
    propertyDetailsClone.querySelector('#propertyType').textContent += propertyDetails.propertyType;
    propertyDetailsClone.querySelector('#propertySubType').textContent += propertyDetails.propertySubType;
    propertyDetailsClone.querySelector('#beds').textContent += propertyDetails.beds;
    propertyDetailsClone.querySelector('#baths').textContent += propertyDetails.baths;
    propertyDetailsClone.querySelector('#carSpaces').textContent += propertyDetails.carSpaces;
    propertyDetailsClone.querySelector('#landArea').textContent += propertyDetails.landArea;

    console.log('Cloned Template:', propertyDetailsClone);

    propertyDetailsContainer.innerHTML = ''; // Clear previous content
    propertyDetailsContainer.appendChild(propertyDetailsClone);


    //Add click listener to Add To Crm Buton.
    const crmButton = document.getElementById('add_to_crm');
    crmButton.addEventListener('click', () => {
      addToCRM();
      console.log('CRM Button clicked');
    });

    // Attach event listener to the generated button
    const zohoTokenButton = document.getElementById('zoho_token_button');
    zohoTokenButton.addEventListener('click', () => {
      generateZohoToken();
      console.log('Access Token: ', zohoAccessToken);
    });

    //Refresh zoho token listener
    const zohoRefreshTokenButton = document.getElementById('refresh_zoho_token');
    zohoRefreshTokenButton.addEventListener('click', () => {
      refreshZohoToken();
      console.log('Refresh zoho token clicked');
    })

    // Clear any existing error message
    clearErrorMessage();
  }


  //------------------------------ZOHO---------------------------------------------------------

  async function generateZohoToken() {
    try {
      const response = await fetch('http://localhost:3000/api/generate-zoho-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_token: zohoGrantToken // Replace with the actual grant token
        })
      });
      const data = await response.json();
      zohoAccessToken = data.access_token;
      zohoRefreshToken = data.refresh_token;

      console.log(response.data);
      console.log(response);

      console.log('Zoho access token:', zohoAccessToken);

    } catch (error) {
      console.error('Error generating Zoho access token:', error);
    }
  }

  //Refresh Zoho Token
  async function refreshZohoToken() {
    try {
      const response = await fetch('http://localhost:3000/api/refresh-zoho-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      zohoAccessToken = data.access_token;

      console.log(response.data);
      console.log(response);

      console.log('Refreshed Zoho access token:', zohoAccessToken);

    } catch (error) {
      console.error('Error refreshing Zoho access token:', error);
    }
  }


  //Create Zoho Record in Module
  async function addToCRM() {
    try {
      const response = await fetch(`http://localhost:3000/api/create-record/${moduleApiName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${zohoAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
      });

      if (!response.ok) {
        throw new Error('Failed to create record');
      }

      console.log(response);
      console.log(recordData);
      console.log('Script token: ', zohoAccessToken);

      const responseData = await response.json();
      console.log('Record created successfully:', responseData);
      // Update UI or perform other actions based on the response
    } catch (error) {
      console.error('Error creating record (Script):', error);
      console.log('server token: ', zohoAccessToken);
      // Handle the error - display a message to the user or retry the operation
    }
  }

  

});
