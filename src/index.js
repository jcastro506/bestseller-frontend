/* DOM ELEMENTS */
const divContainer = document.querySelector("#book-collection")
const bookCover = document.querySelector(".book-cover")
const featuredBook = document.querySelector("#featured-book")
const divBookDetails = document.querySelector("#book-details")
const reviewDetails = document.querySelector('#review-details')
const reviewList = document.querySelector('#review-list')
const newReviewForm = document.querySelector("#new-review")
const editForm = document.querySelector(".form-container")
const editUsername = document.querySelector("#edit-username")
const editReview = document.querySelector("#edit-review")
const cancelBtn = document.querySelector(".cancel-btn")

/* RENDER FUNCTION */
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
    bookCover.innerHTML = ""
    
    const featuredImage = document.createElement("img")
    featuredImage.src = bookObj.image_url
    featuredImage.alt = bookObj.title

    divBookDetails.innerHTML = `
        <p><strong>${bookObj.title}</strong></p>
        <em>${bookObj.author}</em>
        <p>Genre: ${bookObj.genre}</p>
        <p>${bookObj.description}</p>
    `
    bookCover.append(featuredImage)
    reviewList.innerHTML = ''

    bookObj.reviews.forEach(function(review){        
        renderEachReview(review)  
    })
}

function renderEachReview(review){
    const li = document.createElement("li")
    li.className = "review-li"
    li.dataset.id = review.id 
    li.textContent = `${review.content} - ${review.username}`
    reviewList.append(li)

    const buttonsDiv = document.createElement("div")
    buttonsDiv.className = "button-div"
    li.append(buttonsDiv)

    //increase likes
    const likesBtn = document.createElement("button")
    likesBtn.className = "like-btn"
    likesBtn.dataset.id = review.id
    likesBtn.textContent = `${review.likes} ♥️`
    buttonsDiv.append(likesBtn)

    // refactor event listener with a callback function
    // likesBtn = event.target
    likesBtn.addEventListener("click", function(){
        const totalLikes = parseInt(likesBtn.textContent) + 1
        likesBtn.textContent = totalLikes + " ♥️"

        updateLikes(review.id, totalLikes)
    })

    // edit review
    const editButton = document.createElement('button')
    editButton.className = "edit-btn"
    editButton.dataset.id = review.id 
    editButton.textContent = 'edit'
    buttonsDiv.append(editButton)

    editButton.addEventListener("click", function(event){
        document.querySelector(".form-popup").style.display = "block"
        editUsername.value = review.username
        editReview.value = review.content
        editReview.dataset.id = review.id
        
        // renderEditedReview(reviewId)

        editForm.addEventListener("submit", function(event){
            event.preventDefault()
            li.remove()
            const editReviewObj = {
                username: event.target.username.value,
                content: event.target.review.value
            }
        
            fetch(`http://localhost:3000/reviews/${review.id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editReviewObj)
            })
             .then(r => r.json())
             .then(reviewObj => renderEachReview(reviewObj))
             
            // renderEditedReview(reviewId, editReviewObj)
        })
        
    }) 

    // delete review
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "delete-btn"
    deleteBtn.dataset.id = review.id
    deleteBtn.textContent = `delete`
    buttonsDiv.append(deleteBtn)

    deleteBtn.addEventListener("click", function(event){
        console.log("clicked")
        if (event.target.matches(".delete-btn")){
            const reviewLi = event.target.closest(".review-li")
            reviewLi.remove()
        }
        deleteAReview(review.id)
    })
    
    // Add a new review
    const formDiv = document.querySelector(".review-form")
    formDiv.innerHTML = `
        <p><strong>Add a Review:</strong> </p>
        <form id="new-review" data-id="insert review ID">
        <input type="text" name="name" id="name" placeholder="username"/>
        <textarea name="comment" placeholder="leave review here" id="comment"></textarea>
        <input class="submit-btn" type="submit" value="submit"/>
        </form>
    `
    reviewDetails.append(reviewList,formDiv)
    featuredBook.append(divBookDetails, reviewDetails) 
    
} // end of renderEachReview

function renderNewReview(reviewObj){
    const newLi = document.createElement('li')
    const list = document.querySelector('#review-list') 
    newLi.innerText = `${reviewObj.content} - ${reviewObj.username} ` 
    list.append(newLi)
}


/* EVENT LISTENERS */

newReviewForm.addEventListener("submit", function(event){
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


cancelBtn.addEventListener("click", function(event){
    event.preventDefault()
    document.querySelector(".form-popup").style.display = "none"
})


/* FETCH */
fetch(`http://localhost:3000/books/`)
 .then(r => r.json())
 .then(bookArray => bookArray.forEach(renderBooks))


function getABook(){
    fetch(`http://localhost:3000/books/169`)
     .then(r => r.json())
     .then(bookObj => renderABook(bookObj))
}

function updateLikes(id, totalLikes){
    fetch(`http://localhost:3000/reviews/${id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({likes: totalLikes})
    })
     .then(r => r.json())
     .then(data => console.log(data))
}

function deleteAReview(id){
    fetch(`http://localhost:3000/reviews/${id}`, {
        method: 'DELETE'
    })
}

// function renderEditedReview(reviewId, editReviewObj){
//     fetch(`http://localhost:3000/reviews/${reviewId}`,{
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(editReviewObj)
//     })
//      .then(r => r.json())
//      .then(data => console.log(data))
// }
 

/* Initialize */
getABook()