const form = document.querySelector('#homePage__search');
const input = document.querySelector('#homePage__search-input');

const pagination = document.getElementById('homePage__pagination');
const prevBtn = pagination.querySelector('[data-action = "prev"]');
const nextBtn = pagination.querySelector('[data-action = "next"]');
const pageValue = pagination.querySelector('.homePage__value');

let inputValue;

pageValue.textContent = pageNumber;
const errorMessage = document.createElement('p');
errorMessage.setAttribute('id', 'homePage__search-error-message');
errorMessage.textContent = 'Sorry, no movie matches your request';
errorMessage.hidden = true;

form.append(errorMessage);

pagination.addEventListener('click', paginationNavigation);
form.addEventListener('submit', searchFilms);

function paginationNavigation(evt) {
  const target = evt.target;
  
  if (pageNumber === 2) {
    prevBtn.classList.add('hidden');
  }

  if (target === prevBtn) {
    pageNumber -= 1;
    pageValue.textContent = pageNumber;
    if (!inputValue) {
      jsList.innerHTML = '';
      fetchPopularMoviesList();
    } else {
      fetchFilms(inputValue, pageNumber);
    }
  }

  if (target === nextBtn) {
    pageNumber += 1;
    pageValue.textContent = pageNumber;
    prevBtn.classList.remove('hidden');

    if (!inputValue) {
      jsList.innerHTML = '';
      fetchPopularMoviesList();

    } else {
      fetchFilms(inputValue, pageNumber);
    }
  }
}

function searchFilms(evt) {
  evt.preventDefault();
  errorMessage.hidden = true;

  if(input.value){
    inputValue = input.value;
    fetchFilms(inputValue, 1);
    pageNumber = 1;
    pageValue.textContent = pageNumber;
    prevBtn.classList.add('hidden');
  } else {
    jsList.innerHTML = '';
    fetchPopularMoviesList();
  }

}

function fetchFilms(inputValue, pageNumber) {
  
  let API = `
    https://api.themoviedb.org/3/search/movie?api_key=8498946f9c7874ef33ac19a931c494c9&language=en-US&query=${inputValue}&page=${pageNumber}&include_adult=false`;
  

  fetch(API)
    .then(response => response.json())
    .then(data => {
      const arr = data.results;
      if (inputValue !== '' && arr.length === 0) {
        errorMessage.hidden = false;
        inputValue = '';
        fetchPopularMoviesList();
      }

      jsList.innerHTML = '';
      arr.forEach(el => {
        if (el.backdrop_path != null) {
          createCardFunc(el.backdrop_path, el.title, el.id);
        } else if (el.poster_path != null) {
          createCardFunc(el.poster_path, el.title, el.id);
        } else {
          createCardFunc('logo', el.title, el.id);
        }
      });
    })
    .catch(error => console.log('ERROR' + error));

  input.value = '';
}