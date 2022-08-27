document.addEventListener("DOMContentLoaded", function() {});

document.addEventListener("DOMContentLoaded", function () {
    // When the page loads, get a list of books from http://localhost:3000/books and display their titles by creating a li for each book and adding each li to the ul#list element.
    function fetchBooks() {
        fetch("http://localhost:3000/books")
            .then(resp => resp.json())
            .then(books => {
                renderBookList(books);
            })
    }
    function renderBookList(books) {
        const ul = document.querySelector("#list")
        for (let book of books) {
            const li = document.createElement("li")
            li.innerHTML = book.title
            li.addEventListener('click', () => showDetails(book))
            ul.append(li)
        }
    }
    function showDetails(book) {
        const bookToDisplay = document.querySelector("#show-panel");
        const bookTitleClicked = document.createElement("div");
        const title = document.createElement("h1")
        const subtitle = document.createElement("h2")
        const thumbnail = document.createElement("img")
        thumbnail.setAttribute("src", book.img_url)
        const description = document.createElement("p")
        title.innerHTML = book.title
        subtitle.innerHTML = book.subtitle
        description.innerHTML = book.description

        //Display a LIKE button along with the book details. When the button is clicked, send a PATCH request to http://localhost:3000/books/:id with an array of users who like the book, and add a new user to the list.
        const likeBtn = document.createElement('button');
        const likesList = document.createElement('ul');
        likeBtn.innerHTML = `Like!`
        likeBtn.style.backgroundColor = "blue";
        likeBtn.style.color = "white";
        likeBtn.addEventListener("click", () => updateLikeList(book, likesList))
        book.users.forEach(user => {
            const userName = document.createElement("li")
            userName.innerHTML = `${user.username} liked this book!`
            likesList.append(userName)
        })
        bookTitleClicked.append(title, subtitle, thumbnail, description, likesList, likeBtn)
        bookToDisplay.innerHTML = ""
        bookToDisplay.append(bookTitleClicked)
    }

    function updateLikeList(book, likesList) {
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "users": [...book.users, {
                    "users": [
                    { "id": 2, "username": "auer" },
                    { "id": 8, "username": "maverick" },
                    { "id": 1, "username": "pouros" }
                    ]
                }]
            })
        })
            .then(resp => resp.json())
            .then(data => updateLikedUsers(data, likesList))
    }

    function updateLikedUsers(data, likesList){
        likesList.innerHTML = '';
        data.users.forEach(user => {
            const userName = document.createElement("li")
            userName.innerHTML = `${user.userName} liked this!`
            likesList.append(userName)
        })
    }
    fetchBooks();
}); 
