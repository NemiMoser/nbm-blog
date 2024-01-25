// dashboard.js
const dashboardButton = document.querySelector('#dashboard-button');

if (dashboardButton) {
  dashboardButton.addEventListener('click', () => {
    document.location.href = 'http://localhost:3001/profile';
  });
}
