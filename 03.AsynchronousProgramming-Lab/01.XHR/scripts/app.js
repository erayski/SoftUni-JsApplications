function loadRepos() {
   const url = 'https://api.github.com/users/testnakov/repos';
   const addInfo = document.getElementById("res");

   fetch(url)
      .then(res => res.json())
      .then(data => addInfo.textContent = JSON.stringify(data))
}