const searchForm = document.getElementById("search-form");

//! Redirects user to the search page
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const search = e.target[0].value;

  window.location.href = `/search/${search}`;
});
