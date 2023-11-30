const container = document.getElementById("containerID");
const breeds = ["hound", "african", "beagle", "cockapoo", "dingo"];

if (document.readyState !== "loading") {
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    initializeCode();
  });
}

function initializeCode() {
    fetchData();
}

async function fetchData () {
    //onsole.log(imgUrl)
    const APIurl = "";

    for (let i = 0; i < 5; i++) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("wiki-item");

        const breedName = document.createElement("h1");
        breedName.classList.add("wiki-header");
        breedName.innerText = breeds[i];

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("wiki-content");

        const textP = document.createElement("p");
        textP.classList.add("wiki-text")

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("img-container");

        const imgBreed = document.createElement("img");
        const imgUrl = "https://dog.ceo/api/breed/" + breeds[i] + "/images/random";
        const imgPromise = await fetch(imgUrl);
        const imgJSON = await imgPromise.json();
        imgBreed.src = imgJSON.message;


        imageDiv.appendChild(imgBreed);
        contentDiv.appendChild(textP);
        contentDiv.appendChild(imageDiv)
        itemDiv.appendChild(breedName);
        itemDiv.appendChild(contentDiv);

        container.appendChild(itemDiv);

    }


}