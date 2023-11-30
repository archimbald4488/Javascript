const addData = document.getElementById("submit-data");
const container = document.getElementById("important");

addData.addEventListener("click", function (event) {
    event.preventDefault();
    while (true) {
        if (container.firstElementChild) {
            console.log("Children spotted!")
            container.removeChild(container.lastElementChild);
        } else {
            break
        }
    }
    const formQuery = document.getElementById("input-show").value;
    getData(formQuery);

})

async function getData (qString) {
    const url = "https://api.tvmaze.com/search/shows?q=" + qString;
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    for (let i = 0; i < dataJSON.length; i++) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("show-data");

        const newImg = document.createElement("img");
        if (dataJSON[i].show.image) {
            newImg.src = dataJSON[i].show.image.medium;
        }

        const newChildDiv = document.createElement("div");
        newChildDiv.classList.add("show-info");

        const newH1 = document.createElement("h1");
        newH1.innerText = dataJSON[i].show.name;

        newChildDiv.appendChild(newH1);
        newChildDiv.innerHTML += dataJSON[i].show.summary;
        newDiv.appendChild(newChildDiv);
        newDiv.appendChild(newImg);

        container.appendChild(newDiv);
    }
}