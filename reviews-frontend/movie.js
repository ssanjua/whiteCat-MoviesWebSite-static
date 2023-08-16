const url = new URL(location.href);
const movieId = url.searchParams.get("id")
const movieTitle = url.searchParams.get("title")

const APILINK = 'https://review-backend.paupallares.repl.co/api/v1/reviews/';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

const main = document.getElementById("section");
const title = document.getElementById("title");

const TMDB_DETAILS_API = "https://api.themoviedb.org/3/movie/";
const TMDB_API_KEY = "c079b91dfd6e9fbba7328aee2ea2996c";

title.innerText = movieTitle;

const div_new = document.createElement('div');
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="card">
          New Review
          <p><strong>Review: </strong>
            <input type="text" id="new_review" value="">
          </p>
          <p><strong>User: </strong>
            <input type="text" id="new_user" value="">
          </p>
          <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾</a>
          </p>
      </div>
    </div>
  </div>
`
main.appendChild(div_new)

returnReviews(APILINK);

function fetchMovieDetails() {
    fetch(`${TMDB_DETAILS_API}${movieId}?api_key=${TMDB_API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const posterPath = data.poster_path;
        displayMoviePoster(posterPath);
    })
    .catch(error => {
        console.error("Error fetching movie details:", error);
    });
}

function displayMoviePoster(posterPath) {
    const imgElement = document.createElement("img");
    imgElement.src = IMG_PATH + posterPath;
    imgElement.alt = movieTitle;
    imgElement.className = 'movie-poster';  
    main.insertBefore(imgElement, main.firstChild);  
}

function createMainContainer() {
    const mainContainer = document.createElement('div');
    mainContainer.className = 'main-container';
    main.appendChild(mainContainer);
    return mainContainer;
}

function displayMovieHeaderAndPoster(posterPath) {
    const mainContainer = createMainContainer();
  
    // Creando contenedor principal para encabezado y póster
    const headerContainer = document.createElement('div');
    headerContainer.className = 'header-container';

    // Creando contenedor para los títulos
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';

    // Agregando títulos al contenedor de títulos
    const h1Element = document.createElement('h1');
    h1Element.innerText = 'REVIEWS FOR:';
    titleContainer.appendChild(h1Element);
    
    const h3Element = document.createElement('h3');
    h3Element.id = 'title';
    h3Element.innerText = movieTitle;
    titleContainer.appendChild(h3Element);

    // Agregando contenedor de títulos al contenedor principal
    headerContainer.appendChild(titleContainer);

    // Creando y configurando la imagen del póster
    const imgElement = document.createElement("img");
    imgElement.src = IMG_PATH + posterPath;
    imgElement.alt = movieTitle;
    imgElement.className = 'movie-poster';

    // Agregando imagen del póster al contenedor principal
    headerContainer.appendChild(imgElement);

    // Insertando el contenedor principal en la posición correcta en main
    main.insertBefore(headerContainer, main.firstChild);
}

fetchMovieDetails();

function returnReviews(url){
  fetch(url + "movie/" + movieId).then(res => res.json())
  .then(function(data){
  console.log(data);
  data.forEach(review => {
      const div_card = document.createElement('div');
      div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card" id="${review._id}">
                <p><strong>Review: </strong>${review.review}</p>
                <p><strong>User: </strong>${review.user}</p>
                <p><a href="#"onclick="editReview('${review._id}','${review.review}', '${review.user}')">✏️</a> <a href="#" onclick="deleteReview('${review._id}')">🗑</a></p>
              </div>
            </div>
          </div>
        `

      main.appendChild(div_card);
    });
  });
}

function editReview(id, review, user) {

  const element = document.getElementById(id);
  const reviewInputId = "review" + id
  const userInputId = "user" + id
  
  element.innerHTML = `
              <p><strong>Review: </strong>
                <input type="text" id="${reviewInputId}" value="${review}">
              </p>
              <p><strong>User: </strong>
                <input type="text" id="${userInputId}" value="${user}">
              </p>
              <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}',)">💾</a>
              </p>
  
  `
}

function saveReview(reviewInputId, userInputId, id="") {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  if (id) {
    fetch(APILINK + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"user": user, "review": review})
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload();
      });        
  } else {
    fetch(APILINK + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"user": user, "review": review, "movieId": movieId})
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload();
      });
  }
}

function deleteReview(id) {
  fetch(APILINK + id, {
    method: 'DELETE'
  }).then(res => res.json())
    .then(res => {
      console.log(res)
      location.reload();
    });    
}