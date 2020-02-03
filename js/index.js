const mainSection = document.querySelector('.main');
let prevButtons;
let nextButtons;
let imageSections;

function scrollCarousel(carouselWrapper, carousel, direction) {
  let currentPosition = carousel.getBoundingClientRect().x - 40;
  const carouselWidth = carousel.offsetWidth;
  const carouselWrapperWidth = carouselWrapper.offsetWidth;
  if (direction === 'left') {
    currentPosition += carouselWidth < carouselWrapperWidth ?
        0:
        carouselWidth % carouselWrapperWidth;
  } else {
    currentPosition -= carouselWidth < carouselWrapperWidth ?
        0:
        carouselWidth % carouselWrapperWidth;
  }
  if (Math.abs(currentPosition) <= carouselWidth - carouselWrapperWidth) {
    carousel.style.transform = `translateX(${currentPosition}px)`;
  }
}

function onPrevClick() {
  return scrollCarousel(this.parentNode, this.nextElementSibling,
      'left');
}

function onNextClick() {
  return scrollCarousel(this.parentNode, this.previousElementSibling,
      'right');
}

function getPastThreeMonths(y, m, d) {
  const returnDates = [];

  for (let i = 0; i < 3; i++) {
    if (m - 1 > 0) {
      m = m - 1;
    } else {
      m = 12;
      y = y - 1;
    }
    if (m < 10) {
      returnDates.push(`${y}-0${m}-${d}`);
    } else {
      returnDates.push(`${y}-${m}-${d}`);
    }
  }

  return returnDates;
}

function getDatesUrl() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  const dates = [
    `${year}-${month}-${day}`,
    ...(getPastThreeMonths(year, month, day))];
  const movieUrls = [];
  for (let i = 0; i < dates.length - 1; i++) {
    movieUrls.push(
        {url: generateMovieUrl(dates[i + 1], dates[i]), title: `${dates[i]}`});
  }

  return movieUrls;
}

function generateMovieUrl(start, end) {
  return `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${start}&primary_release_date.lte=${end}&api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb`;
}

function renderDOM() {
  var month = new Array();
  month[0] = 'January';
  month[1] = 'February';
  month[2] = 'March';
  month[3] = 'April';
  month[4] = 'May';
  month[5] = 'June';
  month[6] = 'July';
  month[7] = 'August';
  month[8] = 'September';
  month[9] = 'October';
  month[10] = 'November';
  month[11] = 'December';
  const movieUrls = getDatesUrl();
  movieUrls.forEach(url => {
    const gallery = `<div class="tag">Popular ${month[new Date(
        url.title).getMonth()]} Releases</div>
    <div class="carousel">
        <span class="handle handlePrev"><b></b></span>
        <div class="carousel-list"></div>
        <span class="handle handleNext"><b></b></span>
    </div>`;
    mainSection.innerHTML += gallery;
  });
  prevButtons = document.getElementsByClassName('handlePrev');
  nextButtons = document.getElementsByClassName('handleNext');
  imageSections = document.getElementsByClassName('carousel-list');
  movieUrls.forEach((url, index) => {
    makeRequest(url.url).then(res => {
      renderMovies(res, index);
    });
  });
}

function renderMovies(res, index) {
  imageSections[index].innerHTML = res.results.map(
      r => {
        if (!r.poster_path) {
          return '';
        }
        return `<img src="http://image.tmdb.org/t/p/w500/${r.poster_path}" alt="">`;
      })
      .join('');
  prevButtons[index].addEventListener('click', onPrevClick);
  nextButtons[index].addEventListener('click', onNextClick);
}

function makeRequest(url, method) {

  // Create the XHR request
  var request = new XMLHttpRequest();

  // Return it as a Promise
  return new Promise(function(resolve, reject) {

    // Setup our listener to process compeleted requests
    request.onreadystatechange = function() {

      // Only run if the request is complete
      if (request.readyState !== 4) return;

      // Process the response
      if (request.status >= 200 && request.status < 300) {
        // If successful
        resolve(JSON.parse(request.responseText));
      } else {
        // If failed
        reject({
          status: request.status,
          statusText: request.statusText,
        });
      }

    };

    // Setup our HTTP request
    request.open(method || 'GET', url, true);

    // Send the request
    request.send();

  });
}

function startup() {
  renderDOM();
}

window.onload = startup;
