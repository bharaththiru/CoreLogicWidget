//const { response } = require("express");

// Replace with your actual values
const propertyId = '47872329'; // Replace with your search bar input variable

// // Make a request to the server-side script
// fetch(`http://localhost:3000/api/location?propertyId=${propertyId}`)
// .then(response => response.json())
// .then(data => {
//     // Process the response data (property details)
//     console.log(data);
//   })
// .catch(error => {
//     console.error('Error fetching property details:', error);
//   });



// //Search Bar Functionality
// document.addEventListener('DOMContentLoaded', (event) => {

//   document.querySelector('.search-button').addEventListener('click', function(event) {
//     event.preventDefault();
//     userInput = document.getElementById('search_bar').value;
//     console.log(userInput);
//   });

// });




//Search Bar Functionality
document.addEventListener('DOMContentLoaded', (event) => {

  document.querySelector('.search-button').addEventListener('click', function(event) {
    event.preventDefault();
    const userInput = document.getElementById('search_bar').value;
    fetch(`http://localhost:3000/api/location?address=${userInput}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error fetching property details:', error);
    });
  });

});
