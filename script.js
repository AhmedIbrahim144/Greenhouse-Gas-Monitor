document.getElementById('year').textContent = new Date().getFullYear();

var map = L.map('mapid').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1Mzc2MjczLCJpYXQiOjE3NTQ3NzE0NzMsImp0aSI6ImIwZDVkZDhlYjhlNDQ5ODE5YWI3YTdhZTc2ZjcxZTVlIiwic2NvcGUiOiJzdGFjIGNhdGFsb2c6cmVhZCIsImdyb3VwcyI6IlB1YmxpYyIsImFsbF9ncm91cF9uYW1lcyI6eyJjb21tb24iOlsiUHVibGljIl19LCJvcmdhbml6YXRpb25zIjoiIiwic2V0dGluZ3MiOnt9LCJpc19zdGFmZiI6ZmFsc2UsImlzX3N1cGVydXNlciI6ZmFsc2UsInVzZXJfaWQiOjExNTg0fQ.dauuJra_KwJNkv4gxXWe255c7XZyr7fjzIVNbjAK4i4";
const url = `https://api.carbonmapper.org/api/v1/catalog/plumes/annotated?limit=100&token=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    data.items.forEach(item => {
      const [lng, lat] = item.geometry_json.coordinates;
      L.circleMarker([lat, lng], {
        radius: 6,
        color: item.gas === 'CH4' ? 'cyan' : 'lime',
        fillOpacity: 0.8
      })
      .bindPopup(`
        <strong>Gas:</strong> ${item.gas} <br/>
        <strong>Emission:</strong> ${item.emission_auto.toFixed(1)} kg/hr
      `)
      .addTo(map);
    });
  })
  .catch(err => console.error("Error fetching Carbon Mapper data:", err));
function getLocationName(lat, lng) {
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    .then(res => res.json())
    .then(data => data.address.city || data.address.town || data.address.village || data.display_name)
    .catch(() => "Unknown location");
}

