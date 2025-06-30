fetch('data/posts.json')
  .then(response => response.json())
  .then(posts => {
    const map = L.map('map').setView([22.3193, 114.1694], 10); // center on HK

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
