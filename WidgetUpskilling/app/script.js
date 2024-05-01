// Replace with your actual values
const propertyId = '353657253'; // Replace with your search bar input variable

// Make a request to the server-side script
fetch(`http://localhost:3000/api/location?propertyId=${propertyId}`)
.then(response => response.json())
.then(data => {
    // Process the response data (property details)
    console.log(data);
  })
.catch(error => {
    console.error('Error fetching property details:', error);
  });