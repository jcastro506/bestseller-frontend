/* DOM ELEMENTS */
const mainContainer = document.querySelector("#book-collection")

/* Render Functions */
function renderBooks (bookObj) {
    console.log(bookObj)
    const divTile = document.createElement("div")
    divTile.className = "tile"
    divTile.dataset.id = bookObj.id
    divTile.innerHTML += `
        <img class="book-img" src="${bookObj.image_url}" alt="${bookObj.title}"/>
        <h2>${bookObj.title}</h2>
        <h3><em>${bookObj.author}</em></h3>
        <a href="">Review</a>
    `

    mainContainer.append(divTile)
}


/* Fetch */
fetch(`http://localhost:3000/books/`)
 .then(r => r.json())
 .then(bookArray => bookArray.forEach(renderBooks))

/* Initialize */
