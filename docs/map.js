let map;

// Fetch posts and create content
fetch('data/posts.json')
  .then(response => response.json())
  .then(posts => {
    // Initialize map
    map = L.map('map');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const bounds = [];
    const timeline = document.getElementById('timeline');
    const featuredContainer = document.getElementById('featured-posts');

    // Process posts (newest first)
    const sortedPosts = posts.reverse();

    // Create featured posts grid (first 4 posts)
    sortedPosts.slice(0, 4).forEach(post => {
      featuredContainer.innerHTML += `
        <a href="${post.url}" class="post-card">
          <div class="post-image" style="background-image: url('${post.image || 'images/default.jpg'}')"></div>
          <h3>${post.title}</h3>
        </a>
      `;
    });

    // Create markers and timeline
    sortedPosts.forEach(post => {
      // Add marker
      const marker = L.marker([post.lat, post.lon]).addTo(map);
      marker.bindPopup(`
        <b>${post.title}</b><br>
        <img src="${post.image || 'images/default.jpg'}" width="150"><br>
        <a href="${post.url}">Read more</a>
      `);
      bounds.push([post.lat, post.lon]);

      // Add to timeline
      const li = document.createElement('li');
      li.innerHTML = `<a href="${post.url}">${post.date}: ${post.title}</a>`;
      timeline.appendChild(li);
    });

    // Zoom to fit all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Load routes
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

          polyline.on('mouseover', function() {
            this.setStyle({ weight: 6, color: 'yellow' });
          });
          polyline.on('mouseout', function() {
            this.setStyle({ weight: 4, color: 'black' });
          });
        });
      });
  })
  .catch(error => {
    console.error('Error loading posts:', error);
    document.getElementById('map').innerHTML = '<p>Could not load travel map</p>';
  });
