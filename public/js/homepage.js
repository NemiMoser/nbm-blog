// homepage.js
const homepageButton = document.querySelector('#homepage-button');

if (homepageButton) {
  homepageButton.addEventListener('click', () => {
    document.location.href = 'http://localhost:3001/';
  });
}
