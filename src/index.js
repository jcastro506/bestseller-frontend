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
            li.className = "review-li"
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

            const deleteBtn = document.createElement("button")
            deleteBtn.className = "delete-btn"
            deleteBtn.textContent = `Delete Review`
            li.append(deleteBtn)

            deleteBtn.addEventListener("click", function(event){
                console.log("clicked")
                if (event.target.matches(".delete-btn")){
                    const reviewLi = event.target.closest(".review-li")
                    reviewLi.remove()
                }
                deleteAReview(review.id)
            })

            const editButton = document.createElement('button')
            editButton.className = "edit-btn"
            editButton.textContent = 'Edit Review'
            
            editButton.addEventListener("click", function(){
                document.querySelector(".form-popup").style.display = "block"
            })

            const editDiv = document.createElement("div")
            editDiv.className= "form-popup"
            editDiv.innerHTML = `
                <form class="form-container" data-id="insert ID">
                    <h1>Edit Review</h1>
                
                    <label for="username"><b>Username</b></label>
                    <input type="text" id="edit-username" placeholder="Username" name="username">
                
                    <label for="review"><b>Review</b></label>
                    <input type="textarea" id="edit-review" placeholder="Change Your Review" name="review">
                
                    <button type="submit" class="btn">Submit</button>
                    <button type="submit" class="cancel-btn">Close</button>
                </form>`

            li.append(editButton, editDiv)

            editButton.addEventListener("click", function(event){
                editUsername.value = review.username
                editReview.value = review.content
                form.dataset.id = review.id
            })

            const editForm = document.querySelector(".form-container")
            const editUsername = document.querySelector("#edit-username")
            const editReview = document.querySelector("#edit-review")
            
            editForm.addEventListener("submit", function(event){
                event.preventDefault()
                console.log(event.target)
                fetch(`http://localhost:3000/reviews/${review.id}`,{
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: review.id,
                        username: editUsername.value,
                        content: editReview.value,
                    })
                })
                 .then(r => r.json())
                 .then(data => console.log(data))
            })
            
            const cancelBtn = document.querySelector(".cancel-btn")
            cancelBtn.addEventListener("click", function(event){
                event.preventDefault()
                document.querySelector(".form-popup").style.display = "none";
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

 function deleteAReview(id){
     fetch(`http://localhost:3000/reviews/${id}`, {
         method: 'DELETE'
     })
 }
 

/* Initialize */
getABook()