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