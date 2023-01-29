import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector("#search-form");
const input = document.querySelector(".search-input");
const gallery = document.querySelector(".gallery");
const guard = document.querySelector(".js-guard");
const options = {
  root: null,
  rootMargin: "200px",
  threshold: 0
}
let page = 1;
let observer = new IntersectionObserver(onLoad, options);

form.addEventListener("submit", onSearch);
const lightbox = new SimpleLightbox(".gallery a", { captionsData: "alt", captionDelay: 250 }); 

async function onSearch(evt) {
    evt.preventDefault();
    const name = input.value.trim();
    if (name === '') {
        return (gallery.innerHTML = '');
    };
     
    try {
    const images = await searchImages(name, page=1); 
    gallery.innerHTML = '';
    if (images.hits.length !== 0) {
    gallery.insertAdjacentHTML("beforeend", getImages(images));
    lightbox.refresh();
    observer.observe(guard);
    foundImages(images.totalHits);
    } else {
    noImages()
    };} catch(error) {
     console.log(error)
      };
}


async function searchImages(name, page=1) {
    const key = "32968431-e7a09705e2056856a618066e0";
    const response = await axios.get(`https://pixabay.com/api/?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
  return await response.data; 
  }



function getImages(images) {
    return images.hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
    `<div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="350" height="260"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div>
</div>`).join(""); 
}

async function onLoad(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      page += 1
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
      const name = input.value;

      try {
      const images = await searchImages(name, page)
      gallery.insertAdjacentHTML("beforeend", getImages(images))
      lightbox.refresh();
          
      if (images.hits.length === images.totalHits) {
      observer.unobserve(guard);
      }
     if (images.totalHits <= page * 40) {
      endOfSearch();
      }
        } catch(err) {
          console.log(err)
    }
  }
})}

function noImages() {
  gallery.innerHTML = '';
 return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function foundImages(totalHits) {
return Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);  
}

function endOfSearch() {
  return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}

