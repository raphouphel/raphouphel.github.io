// Initialize map variable globally so both fetches can use it
let map;

// Fetch posts and add markers + timeline
fetch('data/posts.json')
  .then(response => response.json())
  .then(posts => {
    map = L.map('map');

    // Add map tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const bounds = [];
    const timeline = document.getElementById('timeline');

    posts.reverse().forEach(post => {
      // Add marker to map
      const marker = L.marker([post.lat, post.lon]).addTo(map);
      marker.bindPopup(`<a href="${post.url}">${post.title}</a>`);
      bounds.push([post.lat, post.lon]);

      // Add post to timeline
      const li = document.createElement('li');
      li.innerHTML = `<a href="${post.url}">${post.date}: ${post.title}</a>`;
      timeline.appendChild(li);
    });

    // Zoom to fit all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // After posts are loaded and map is ready, load routes
    fetch('data/routes.json')
      .then(response => response.json())
      .then(routes => {
        routes.forEach(route => {
          const polyline = L.polyline([route.from, route.to], {
            color: 'black',
            weight: 4,
            opacity: 0.7,
            dashArray: '6, 6'
          }).addTo(map);

          polyline.bindPopup(route.description);

          // Optional hover effect
          polyline.on('mouseover', function () {
            this.setStyle({ weight: 6, color: 'orange' });
          });
          polyline.on('mouseout', function () {
            this.setStyle({ weight: 4, color: 'yellow' });
          });
        });
      });
  });
