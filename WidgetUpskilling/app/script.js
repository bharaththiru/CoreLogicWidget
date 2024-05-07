var addressSuggestions;
var propertyId;

// Search Bar Functionality
document.addEventListener('DOMContentLoaded', (event) => {

  document.querySelector('.search-button').addEventListener('click', function(event) {
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

        if(suggestion.suggestionType === 'address') {
          propertyId = suggestion.propertyId;
          console.log(propertyId);
        }
      });
      suggestionList.appendChild(suggestionItem);
    });
  }

});
