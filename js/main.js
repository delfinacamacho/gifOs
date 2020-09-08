/*---------- THEME SELECTOR DROPDOWN ----------*/

//To display the dropdown Theme Button
function showThemeDropdown() {
  document.getElementById("themeDropdown").classList.toggle("display-none");
}

//To close the dropdown when the user clicks outside of it
window.addEventListener("click", function (event) {
  if (!event.target.matches(".btn-menu")) {
    const dropdownAction = document.getElementById("themeDropdown");
    dropdownAction.classList.add("display-none");
  }
});

// To change the theme class
const theme = document.getElementById("theme");
const activeThemeNight = document.getElementById("night-theme-btn");
const activeThemeDay = document.getElementById("day-theme-btn");

let setTheme = localStorage.getItem("setTheme");

if (setTheme === "enabledDayTheme") {
  day();
} else {
  night();
}

function day() {
  theme.className = "day";
  activeThemeDay.className = "btn-dropdown-active-theme"; //Active Theme Button
  activeThemeNight.className = "selector"; //Grey Button
  localStorage.setItem("setTheme", "enabledDayTheme")
}

function night() {
  theme.className = "night";
  activeThemeNight.className = "btn-dropdown-active-theme";
  activeThemeDay.className = "selector";
  localStorage.setItem("setTheme", "enabledNightTheme")
}

activeThemeDay.addEventListener('click', () => {
  setTheme = localStorage.getItem("setTheme"); //Updates variable in Local Storage
  day();
})

activeThemeNight.addEventListener('click', () => {
  setTheme = localStorage.getItem("setTheme"); //Updates variable in Local Storage
  night();
})

/*---------- GETTING GIFS FOR SUGGESTIONS SECTION ----------*/

const apikey = "Tikochocgg7Xu1KtXHIGkPgqAlmLFJt4";

async function getSuggestions() {
  try {
    const path = `https://api.giphy.com/v1/gifs/trending?api_key=${apikey}&limit=4`;
    const loadSuggestions = await fetch(path).then((Response) =>
      Response.json()
    );
    const suggestionsContainer = document.getElementById(
      "suggestions-container"
    );

    loadSuggestions.data.forEach((item) => {
      const suggestionsGifs = document.createElement("div");
      suggestionsGifs.classList.add("suggestions-gif");

      const gifHeader = document.createElement("div");
      gifHeader.classList.add("gif-header");

      const gifTitle = document.createElement("h2");
      gifTitle.innerText = "#" + item.title.split("GIF", 1);

      const closeSpan = document.createElement("span");
      closeSpan.classList.add("close-btn");

      const gifContent = document.createElement("img");
      gifContent.src = item.images.downsized_large.url;
      gifContent.classList.add("suggestions-content");

      const moreButton = document.createElement("button");
      moreButton.classList.add("gif-btn-more");
      moreButton.innerText = "Ver más";
      moreButton.onclick = function () {
        let searchTerm = item.title.split("GIF", 1);
        searchInput.value = searchTerm;
        searchGifs();
        tagSuggestions();
      };

      gifHeader.appendChild(gifTitle);
      gifHeader.appendChild(closeSpan);
      suggestionsGifs.appendChild(gifHeader);
      suggestionsGifs.appendChild(gifContent);
      suggestionsGifs.appendChild(moreButton);
      suggestionsContainer.appendChild(suggestionsGifs);
    });
  } catch (error) {
    console.log("failed", error);
  }
}
getSuggestions();

/*---------- GETTING GIFS FOR TRENDING SECTION ----------*/

async function getTrending() {
  try {
    let path = `https://api.giphy.com/v1/gifs/trending?api_key=${apikey}&limit=25&offset=5`;
    const loadTrends = await fetch(path).then((Response) => Response.json());
    const trendsContainer = document.getElementById("trends-container");

    loadTrends.data.forEach((item) => {
      let height = item.images.downsized_large.height;
      let width = item.images.downsized_large.width;
      let aspectRatio = height / width;

      const trendingGifs = document.createElement("div");
      trendingGifs.classList.add("gif-frame");

      const gifContent = document.createElement("img");
      gifContent.src = item.images.downsized_large.url;
      gifContent.classList.add("trends-content");

      const gifFooter = document.createElement("div");
      gifFooter.classList.add("gif-footer");
      let titleToArray = item.title.split(" ");
      let arrayDirty = titleToArray.slice(0,3);
      let titleArrayToTags = "";
      arrayDirty.forEach(word => {
        titleArrayToTags += `#${word} `;
      });
      gifFooter.innerText = titleArrayToTags; //TODO!!! Quitar desde GIF en adelante

      trendingGifs.addEventListener("mouseover", function () {
        gifFooter.setAttribute("style", "visibility: visible");
      });
      trendingGifs.addEventListener("mouseout", function () {
        gifFooter.setAttribute("style", "visibility: hidden");
      });

      trendingGifs.appendChild(gifContent);
      trendingGifs.appendChild(gifFooter);
      trendsContainer.appendChild(trendingGifs);

      if (aspectRatio < 0.6) {
        document
          .querySelector(".gif-frame:last-child")
          .classList.add("double-span"); //To apply a double span width in the grid to gifs with a 16:9 aspect ratio (9/16=0.56)
      }
    });
  } catch (error) {
    console.log("failed", error);
  }
}
getTrending();

/*---------- GETTING GIFS WITH SEARCH BAR INPUT (Giphy's Search Endpoint) ----------*/

const searchInput = document.getElementById("search-input");
const submitButton = document.getElementById("submit-btn");
const sectionPlaceholder = document.querySelector(".search-term");

//To fetch search results and hide Suggested and Trending sections

submitButton.addEventListener("click", searchGifs);

async function searchGifs() {
    try {
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = "";
        let searchTerm = searchInput.value;
        if (searchTerm) {
          let path = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${searchTerm}`;
          const loadResults = await fetch(path).then((Response) => Response.json());
          loadResults.data.forEach((item) => {
            let height = item.images.downsized_large.height;
            let width = item.images.downsized_large.width;
            let aspectRatio = height / width;
            
            const resultsGifs = document.createElement("div");
            resultsGifs.classList.add("gif-frame");

            const gifContent = document.createElement("img");
            gifContent.src = item.images.downsized_large.url;
            gifContent.classList.add("results-content");

            const gifFooter = document.createElement("div");
            gifFooter.classList.add("gif-footer");
            let titleToArray = item.title.split(" ");
            let arrayDirty = titleToArray.slice(0,3);
            let titleArrayToTags = "";
            arrayDirty.forEach(word => {
              titleArrayToTags += `#${word} `;
            });
            gifFooter.innerText = titleArrayToTags; 

            resultsGifs.addEventListener("mouseover", function () {
              gifFooter.setAttribute("style", "visibility: visible");
            });
            resultsGifs.addEventListener("mouseout", function () {
              gifFooter.setAttribute("style", "visibility: hidden");
          });

            resultsGifs.appendChild(gifContent);
            resultsGifs.appendChild(gifFooter);
            resultsContainer.appendChild(resultsGifs);

            if (aspectRatio < 0.6) {
                resultsContainer.lastElementChild.classList.add("double-span"); //To apply a double span width in the grid to gifs with a 16:9 aspect ratio (9/16=0.56)
              }
            });
          document.querySelector(".suggestions-section").classList.add("display-none");
          document.querySelector(".trends-section").classList.add("display-none");
          document.querySelector(".results-section").classList.remove("display-none");
        
          const searchDropdown = document.querySelector(".search-bar-suggestions");
          searchDropdown.classList.add("hidden");
          submitButton.classList.add("search-btn-active");
        
          sectionPlaceholder.value = searchTerm;
        }

} catch (error) {
    console.log("failed", error);
  }
}

//Shows dropdown of search suggestions

function displaySearchBarDropdown() {
  const searchDropdown = document.querySelector(".search-bar-suggestions");
  if (searchInput.value === null || searchInput.value === " ") {
    searchDropdown.classList.add("hidden");
    submitButton.classList.remove("search-btn-listener");
  } else if (searchInput.value !== "") {
    searchDropdown.classList.remove("hidden");
    submitButton.classList.add("search-btn-listener");
  }
}

searchInput.addEventListener("input", displaySearchBarDropdown);

//Fetchs alterative search suggestions and shows them as buttons in the dropdown (Giphy's Search Tags Endpoint)

function searchSuggestions() {
  let searchTerm = searchInput.value;
  let path = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apikey}&q=${searchTerm}&limit=3`;
  let suggButton = document.getElementsByClassName("suggestions-btn");

  const loadSuggestions = fetch(path);
  loadSuggestions
    .then((Response) => Response.json())
    .then((item) => {
      for (let i = 0; i < item.data.length; i++) {
        suggButton[i].innerHTML = item.data[i].name;
      }
    });
  const sectionPlaceholder = document.querySelector(".search-term");
  sectionPlaceholder.innerText = searchTerm;
}

searchInput.addEventListener("input", searchSuggestions);

//Displays search results from suggestions

document.getElementsByClassName("suggestions-btn")[0].addEventListener("click", suggSearch);
document.getElementsByClassName("suggestions-btn")[1].addEventListener("click", suggSearch);
document.getElementsByClassName("suggestions-btn")[2].addEventListener("click", suggSearch);

function suggSearch() {
  let searchTerm = this.innerText.replace('#','');
  searchInput.value = searchTerm;
  searchGifs();
}

function tagSuggestions() {
  let searchTerm = searchInput.value;
  let path = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${searchTerm}&limit=3`;
  let suggTag = document.getElementsByClassName("results-examples-btn");
  

  const loadTags = fetch(path);
  loadTags
    .then((Response) => Response.json())
    .then((item) => {
      for (let i = 0; i < item.data.length; i++) {
        suggTag[i].innerText = "#" + item.data[i].title.split("GIF", 1);
      }
    });
}


searchInput.addEventListener("input", tagSuggestions);

//Displays search results from suggestions

document.getElementsByClassName("results-examples-btn")[0].addEventListener("click", suggSearch);
document.getElementsByClassName("results-examples-btn")[1].addEventListener("click", suggSearch);
document.getElementsByClassName("results-examples-btn")[2].addEventListener("click", suggSearch);

document.getElementsByClassName("results-examples-btn")[0].addEventListener("click", tagSuggestions);
document.getElementsByClassName("results-examples-btn")[1].addEventListener("click", tagSuggestions);
document.getElementsByClassName("results-examples-btn")[2].addEventListener("click", tagSuggestions);