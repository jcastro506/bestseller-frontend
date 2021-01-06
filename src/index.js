/* DOM ELEMENTS */
const divContainer = document.querySelector("#book-collection")

/* Render Functions */
function renderBooks (bookObj) {
    // console.log(bookObj)
    const divTile = document.createElement("div")
    divTile.className = "tile"
    divTile.dataset.id = bookObj.id
    divTile.innerHTML += `
        <img class="book-img" src="${bookObj.image_url}" alt="${bookObj.title}"/>`
    divContainer.append(divTile)

    divTile.addEventListener("click", function(){
        renderABook(bookObj)
    })
}

function renderABook(bookObj){
    const featuredBook = document.querySelector("#featured-book")
    const bookCover = document.querySelector(".book-cover")
    bookCover.innerHTML = ""
    
    const featuredImage = document.createElement("img")
    featuredImage.src = bookObj.image_url
    featuredImage.alt = bookObj.title

    const divBookDetails = document.querySelector("#book-details")
    divBookDetails.innerHTML = `
        <p><strong>${bookObj.title}</strong></p>
        <em>${bookObj.author}</em>
        <p>${bookObj.genre}</p>
        <p>${bookObj.description}</p>
    `
    renderReview()

    function renderReview(newReviewObj){
        const reviewDetails = document.querySelector('#review-details')

        const reviewList = document.querySelector('#review-list')
        const ul = document.createElement('ul')
        reviewList.innerHTML = ''

        bookObj.reviews.forEach(function(review){
            // console.log(review.content)
            const li = document.createElement('li')
            const likesBtn = document.createElement('button')
            likesBtn.className = "like-btn"
            likesBtn.textContent = `${review.likes} ♥️`

            li.textContent = `${review.content} - ${review.username}`
            li.append(likesBtn)
            reviewList.append(li)
            
            likesBtn.addEventListener("click", function(){
                const totalLikes = parseInt(likesBtn.textContent) + 1
                likesBtn.textContent = totalLikes + " ♥️"

                fetch(`http://localhost:3000/reviews/${review.id}`,{
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({likes: totalLikes})
                })
                 .then(r => r.json())
                 .then(data => console.log(data))
            })
        })
        

        const formDiv = document.querySelector(".review-form")
        formDiv.innerHTML = `
            <p>Add a Review: </p>
            <form id="new-review" data-id="insert review ID">
            <input type="text" name="name" id="name" placeholder="Username"/>
            <textarea name="comment" id="comment">Insert Review Here</textarea>
            <input class="submit-btn" type="submit" value="Submit"/>
            </form>
        `

        bookCover.append(featuredImage)
        reviewDetails.append(ul, formDiv)
        featuredBook.append(divBookDetails, reviewDetails) 
    }
    


    const form = document.querySelector("#new-review")
    form.addEventListener("submit", function(event){
    event.preventDefault()
    const newUsername = event.target.name.value
    const newContent = event.target.comment.value

        const newReviewObj = {
            username: newUsername,
            content: newContent,
            likes: 0,
            book_id: bookObj.id
        }
        reviewABook(newReviewObj)

        function reviewABook(newReviewObj){
            fetch(`http://localhost:3000/reviews`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReviewObj)
            })
             .then(r => r.json())
             .then(reviewObj => renderNewReview(reviewObj))
        }
    })
}


function renderNewReview(reviewObj){
    const newLi = document.createElement('li')
    const list = document.querySelector('#review-list') 
    newLi.innerText = `${reviewObj.content} - ${reviewObj.username} ` 
    list.append(newLi)
}

/* Event Listeners */




/* Fetch */
fetch(`http://localhost:3000/books/`)
 .then(r => r.json())
 .then(bookArray => bookArray.forEach(renderBooks))


 function getABook(){
    fetch(`http://localhost:3000/books/11`)
    .then(r => r.json())
    .then(bookObj => renderABook(bookObj))
 }
 

/* Initialize */
getABook()