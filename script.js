// const socket = io();

// // Initialize the map with your specified location
// const myLocation = { latitude: 20.55874, longitude: 74.49909 }; // Your specific location
// const map = L.map('map').setView([myLocation.latitude, myLocation.longitude], 13);

// // Add OpenStreetMap tiles
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Malegaon'
// }).addTo(map);

// // Marker for your specific location
// const myMarker = L.marker([myLocation.latitude, myLocation.longitude]).addTo(map).bindPopup('Lalit Khairnar').openPopup();

// // Check if Geolocation is available
// if (navigator.geolocation) {
//   console.log("Geolocation is available...");
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;

//       // Emit your initial location to the server
//       socket.emit("send-location", { latitude, longitude });

//       // Start watching position to update location
//       navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;

//           // Validate the location to avoid unreasonable jumps
//           if (isValidLocation(latitude, longitude)) {
//             // Emit updated location to the server
//             socket.emit("send-location", { latitude, longitude });

//             // Update your marker's position to the new location
//             myMarker.setLatLng([latitude, longitude]);
//           }
//         },
//         (error) => {
//           console.log("Got error in navigator", error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );
//     },
//     (error) => {
//       console.log("Error getting current position:", error);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// } else {
//   console.log("Sorry, geolocation is not available.");
// }

// const markers = {};

// // Handle receiving location updates from other users
// socket.on("received-location", (data) => {
//   const { id, latitude, longitude } = data;

//   // Update marker if it already exists, or create a new one
//   if (markers[id]) {
//     markers[id].setLatLng([latitude, longitude]);
//   } else {
//     markers[id] = L.marker([latitude, longitude]).addTo(map); // Create new marker
//   }
// });

// // Function to validate if the location is reasonable
// function isValidLocation(latitude, longitude) {
//   // Check if the coordinates are within a certain range of your known location
//   const distanceThreshold = 0.1; // Adjust this threshold as needed
//   const knownLatitude = 20.55874;
//   const knownLongitude = 74.49909;

//   // Calculate the distance between known location and current location
//   const distance = Math.sqrt(
//     Math.pow(latitude - knownLatitude, 2) + Math.pow(longitude - knownLongitude, 2)
//   );

//   return distance < distanceThreshold; // Return true if within the threshold
// }



const socket = io();

// Initialize the map with your specified location
const myLocation = { latitude: 20.55874, longitude: 74.49909 }; // Your specific location
const map = L.map('map').setView([myLocation.latitude, myLocation.longitude], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Malegaon'
}).addTo(map);

// Marker for your specific location
const myMarker = L.marker([myLocation.latitude, myLocation.longitude]).addTo(map).bindPopup('Lalit Khairnar').openPopup();

// Check if Geolocation is available
if (navigator.geolocation) {
  console.log("Geolocation is available...");
  
  // Get initial position and emit it to the server
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Emit your initial location to the server
      socket.emit("send-location", { latitude, longitude });

      // Start watching position to update location
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Validate the location to avoid unreasonable jumps
          if (isValidLocation(latitude, longitude)) {
            // Emit updated location to the server
            socket.emit("send-location", { latitude, longitude });

            // Update your marker's position to the new location
            myMarker.setLatLng([latitude, longitude]);
          }
        },
        (error) => {
          console.log("Got error in navigator", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    },
    (error) => {
      console.log("Error getting current position:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.log("Sorry, geolocation is not available.");
}

const markers = {};

// Handle receiving location updates from other users
socket.on("received-location", (data) => {
  const { id, latitude, longitude } = data;

  // Update marker if it already exists, or create a new one
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map); // Create new marker
  }
});

// Function to validate if the location is reasonable
function isValidLocation(latitude, longitude) {
  // Check if the coordinates are within a certain range of your known location
  const distanceThreshold = 0.1; // Adjust this threshold as needed
  const knownLatitude = 20.55874;
  const knownLongitude = 74.49909;

  // Calculate the distance between known location and current location
  const distance = Math.sqrt(
    Math.pow(latitude - knownLatitude, 2) + Math.pow(longitude - knownLongitude, 2)
  );

  return distance < distanceThreshold; // Return true if within the threshold
}

// Emit disconnect event when the tab is closed
window.addEventListener('beforeunload', () => {
  socket.emit("disconnect-location"); // Custom event for disconnection
});
