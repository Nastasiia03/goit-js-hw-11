import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const DELAY = 300;

const form = document.querySelector("#search-form");
const input = document.querySelector(".search-input");
const gallery = document.querySelector(".gallery");

let page = 1;

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
        if (images.length !== 0) {
          gallery.insertAdjacentHTML("beforeend", getImages(images))
          page += 1;
          largeImages();
        } else {
          noImages()
          };
})
      .catch(error => {
     console.log(error)
      });
}


async function searchImages(name) {
    const key = "32968431-e7a09705e2056856a618066e0";
    const response = await axios.get(`https://pixabay.com/api/?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    return response.data.hits
}


function getImages(images) {
    return images.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
    `<div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
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

function largeImages() {
  const lightbox = new SimpleLightbox(".gallery a", { captionsData: "alt", captionDelay: 250 }); 
  lightbox.on('show.simplelightbox', () => {
    const link = document.querySelectorAll(".gallery__item");
  return Array.from(link).map((event)=> `<img src="${event.getAttribute("href")}" alt="" width="800", height="600"/>`)  
  });
}

function noImages() {
  gallery.innerHTML = '';
 return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}