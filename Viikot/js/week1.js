
const printMessageButton = document.getElementById("my-button");
const dataButton = document.getElementById("add-data");

printMessageButton.addEventListener("click", function() {
    console.log("hello world");

    const headerH1 = document.getElementById("head1");
    headerH1.innerText = "Moi maailma";

})

dataButton.addEventListener("click", function() {

    const listL1 = document.getElementById("list1");
    const newData = document.createElement("li");
/*     const textForData = document.createTextNode("hehe"); */
    newData.innerText = document.getElementById("text").value;

/*     newData.appendChild(textForData); */
    listL1.appendChild(newData);

})
