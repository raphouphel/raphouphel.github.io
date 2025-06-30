fetch('data/posts.json')
  .then(response => response.json())
  .then(posts => {
    const map = L.map('map');
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    const bounds = [];
    
    const timeline = document.getElementById('timeline');
    posts.reverse().forEach(post => {
      const marker = L.marker([post.lat, post.lon]).addTo(map);
      marker.bindPopup(`<a href="${post.url}">${post.title}</a>`);
    
      bounds.push([post.lat, post.lon]);
    
      const li = document.createElement('li');
      li.innerHTML = `<a href="${post.url}">${post.date}: ${post.title}</a>`;
      timeline.appendChild(li);
    });
    
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const timeline = document.getElementById('timeline');
    posts.reverse().forEach(post => {
      // Add to map
      const marker = L.marker([post.lat, post.lon]).addTo(map);
      marker.bindPopup(`<a href="${post.url}">${post.title}</a>`);

      // Add to timeline
      const li = document.createElement('li');
      li.innerHTML = `<a href="${post.url}">${post.date}: ${post.title}</a>`;
      timeline.appendChild(li);
    });
  });
