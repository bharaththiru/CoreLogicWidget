let addressSuggestions;
let propertyId;
let zohoAccessToken = '';


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
      displayPropertyDetails(data, addressSuggestions.find(suggestion => suggestion.propertyId === propertyId).suggestion);
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


  // function displayPropertyDetails(propertyDetails, suggestionName) {
  //   const propertyDetailsContainer = document.getElementById('search_results');
  //   propertyDetailsContainer.innerHTML = `
  //   <div class="property-details-container">
  //     <div style="display: flex; justify-content: space-between; align-items: center;">
  //       <h2>Property Details</h2> <!-- Title -->
  //       <button class="add-to-crm-button">Add to CRM</button> <!-- Button -->
  //     </div>
  //     <p>Property Address: ${suggestionName}</p>
  //     <p>Property Type: ${propertyDetails.propertyType}</p>
  //     <p>Property Subtype: ${propertyDetails.propertySubType}</p>
  //     <p>Beds: ${propertyDetails.beds}</p>
  //     <p>Baths: ${propertyDetails.baths}</p>
  //     <p>Car Spaces: ${propertyDetails.carSpaces}</p>
  //     <div style="display: flex; justify-content: space-between; align-items: center;">
  //       <p>Land Area: ${propertyDetails.landArea}</p>
  //       <button id="zoho_token_button class="generate-zoho-token">Generate Zoho Token</button> <!-- Button -->
  //     </div>
  //   </div>
  // `;
  //   // Clear any existing error message
  //   clearErrorMessage();
  // }

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

    // Attach event listener to the generated button
    const zohoTokenButton = document.getElementById('zoho_token_button');
    zohoTokenButton.addEventListener('click', () => {
      generateZohoToken();
      console.log(zohoAccessToken);
    });

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
          grant_token: '1000.9b0a8fb1236eaa92e7b16b887cce5001.82c12cec96bfe97c0df145116f17f9ec' // Replace with the actual grant token
        })
      });
      const data = await response.json();
      zohoAccessToken = data.access_token;

      console.log(response.data);

      console.log('Zoho access token:', zohoAccessToken);

      setTimeout(refreshZohoToken, 55 * 60 * 1000);

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

      console.log('Refreshed Zoho access token:', zohoAccessToken);

      setTimeout(refreshZohoToken, 55 * 60 * 1000);
    } catch (error) {
      console.error('Error refreshing Zoho access token:', error);
    }
  }
  
  

});
