function getOneBook(id){
    fetch(`http://localhost:3000/books/${id}`)
    .then(response => response.json())
    .then(data => console.log(data));
}

getOneBook(1)