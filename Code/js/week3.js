const tbody = document.getElementById("data");

fetchData();

async function fetchData () {
    const url = "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff";
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    let municipality = Object.values(dataJSON.dataset.dimension.Alue.category.label);
    let population = Object.values(dataJSON.dataset.value);

    const url2 = "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065"
    const dataPromise2 = await fetch(url2);
    const dataJSON2 = await dataPromise2.json();

    let employment = Object.values(dataJSON2.dataset.value);

    for (let i = 0; i < municipality.length; i++) {

        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");

        let pop = population[i];
        let employed = employment[i];
        let percentage = employed / pop * 100;
        let rounded = Math.round((percentage) * 100) / 100 

        if (i % 2 != 0) {
            tr.classList.add("even")
        }
        if (rounded < 25) {
            tr.classList.add("bad");
        } else if (rounded > 45) {
            tr.classList.add("good")
        }

        td1.innerText = municipality[i];
        td2.innerText = population[i];
        td3.innerText = employment[i];
        td4.innerText = rounded + "%";

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);
    };
}