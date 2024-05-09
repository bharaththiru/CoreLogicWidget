var addressSuggestions;
var propertyId;


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
  function displayPropertyDetails(propertyDetails, suggestionName) {
    const propertyDetailsContainer = document.getElementById('search_results');
    propertyDetailsContainer.innerHTML = `
    <div class="property-details-container">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Property Details</h2> <!-- Title -->
        <button class="add-to-crm-button">Add to CRM</button> <!-- Button -->
      </div>
      <p>Property Address: ${suggestionName}</p>
      <p>Property Type: ${propertyDetails.propertyType}</p>
      <p>Property Subtype: ${propertyDetails.propertySubType}</p>
      <p>Beds: ${propertyDetails.beds}</p>
      <p>Baths: ${propertyDetails.baths}</p>
      <p>Car Spaces: ${propertyDetails.carSpaces}</p>
      <p>Land Area: ${propertyDetails.landArea}</p>
    </div>
  `;
    // Clear any existing error message
    clearErrorMessage();
  }

});
