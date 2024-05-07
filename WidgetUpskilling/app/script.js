var addressSuggestions;
var propertyId;

// Search Bar Functionality
document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.search-button').addEventListener('click', function (event) {
    event.preventDefault();
    const userInput = document.getElementById('search_bar').value;
    fetch(`http://localhost:3000/api/location?address=${userInput}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        addressSuggestions = data.suggestions;
        console.log(addressSuggestions);
        displaySuggestions(addressSuggestions); // Call the function directly with fetched data
      })
      .catch(error => {
        console.error('Error fetching property details:', error);
      });
  });

  function displaySuggestions(suggestions) {
    const suggestionList = document.getElementById('search_results');

    suggestionList.innerHTML = ''; // Clearing existing suggestions

    suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement('li');
      suggestionItem.textContent = suggestion.suggestion;
      suggestionItem.addEventListener('click', () => {
        console.log('User Selected: ', suggestion.suggestion);

        if (suggestion.suggestionType === 'address') { //If suggestion type is address, extract the property id (only address types have propertyId)
          propertyId = suggestion.propertyId;
          console.log(propertyId);

          fetchCoreDetails(propertyId);
        }
      });
      suggestionList.appendChild(suggestionItem);
    });
  }

  async function fetchCoreDetails(propertyId) {
    try {
      const response = await fetch(`http://localhost:3000/api/core-details?propertyId=${propertyId}`);
      const data = await response.json();
      console.log('Core Details:', data);
      // Handle core details data

    } catch (error) {
      console.error('Error fetching core details:', error);
    }
  }

  //API authentication
  document.getElementById('generate_token').addEventListener('click', () => {
    fetch('http://localhost:3000/api/generate-token', {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          console.log('Token generated successfully');
        } else {
          console.error('Failed to generate token');
        }
      })
      .catch(error => {
        console.error('Error generating token:', error);
      });
  });

});


