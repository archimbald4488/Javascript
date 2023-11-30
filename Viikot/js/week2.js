const addData = document.getElementById("submit-data");

addData.addEventListener("click", function() {
    const newData = [];

    newData.push(document.getElementById("input-username").value);
    newData.push(document.getElementById("input-email").value);
    if (document.getElementById("input-admin").checked == true) {
        newData.push("X")
    }


    let tBodyRef = document.getElementById("myTable").getElementsByTagName("tbody")[0];

    /* Check for existing entry */
    let found = false;
    let rowNumber = 0;
    for (let i = 0, row; row = tBodyRef.rows[i]; i++) {
        console.log("checking row " + i + ", cell[0] is " + row.cells[0].innerText);
        if (row.cells[0].innerText == newData[0]) {
            found = true;
            rowNumber = i;
        }
    }
    
    if (found == false) {
        let newRow = tBodyRef.insertRow();
        newData.forEach(value => {
            console.log(value);
            let newCell = newRow.insertCell();
            let newText = document.createTextNode(value);
            newCell.appendChild(newText);
        })
        /* Add image */
        const file = document.getElementById("input-image").files[0];
        if (!file) {
            /* create the cell for future use */
            let newCell = newRow.insertCell();
            return
        }
        let image = document.createElement("img");
        image.width = "64";
        image.height = "64";
        image.src = URL.createObjectURL(file);

        let newCell = newRow.insertCell();
        newCell.appendChild(image);

    } else { /* Edit the existing cells */
        tBodyRef.rows[rowNumber].cells[1].innerHTML = newData[1]

        if (newData[2]) {
            tBodyRef.rows[rowNumber].cells[2].innerHTML = newData[2]
        } else {
            tBodyRef.rows[rowNumber].cells[2].innerHTML = "";
        }
        /* Add image */
        const file = document.getElementById("input-image").files[0];
        if (!file) return
        let image = document.createElement("img");
        image.width = "64";
        image.height = "64";
        image.src = URL.createObjectURL(file);
        
        tBodyRef.rows[rowNumber].cells[3].appendChild(image);
    }
})

const clearData = document.getElementById("empty-table");

clearData.addEventListener("click", function() {

    let tBodyRef = document.getElementById("myTable").getElementsByTagName("tbody")[0];

    while (true) {
        if (tBodyRef.firstElementChild) {
            console.log("Children spotted!")
            tBodyRef.removeChild(tBodyRef.lastElementChild);
        } else {
            break
        }
    }
})