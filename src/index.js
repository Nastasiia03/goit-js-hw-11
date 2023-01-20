import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const DELAY = 300;

const form = document.querySelector("#search-form");
const input = document.querySelector(".search-input");
const gallery = document.querySelector(".gallery")

form.addEventListener("submit", onSearch);

function onSearch(evt) {
    evt.preventDefault();
    const name = input.value;
    if (name === '') {
        return (gallery.innerHTML = '');
    };
        
    searchImages(name)
        .then(images => {
            gallery.innerHTML = '';
          // if (images.length >= 1) {
            return gallery.insertAdjacentHTML("beforeend", getImages(images));
          // };
        })
        .catch(noImages);
}

async function searchImages(name) {
    const key = "32968431-e7a09705e2056856a618066e0";
    const response = await axios.get(`https://pixabay.com/api/?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`);
    return response.data.hits;
}



function getImages(images) {
    return images.map(({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`).join("");
}

function noImages() {
  gallery.innerHTML = '';
 Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}