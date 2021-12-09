function loadCommits() {
    const username = document.getElementById("username").value;
    const repo = document.getElementById("repo").value;
    const url = `https://api.github.com/repos/${username}/${repo}/commits`;
    const list = document.getElementById("commits");
    let status;

    fetch(url)
        .then(promise => {
            if (!promise.status.ok) {
                status = promise.status;
            }
            return promise.json();
        })
        .then(data => {
            list.innerHTML = '';

            if (data.message == 'Not Found') {
                createLi(`Error:${status} (${data.message})`);
                return;
            }

            for (let el of data) {
                createLi(`${el.commit.author.name}: ${el.commit.message}`);
            }
        });

    function createLi(text) {
        let liElement = document.createElement("li");
        liElement.textContent = text;
        list.appendChild(liElement);
    }
}