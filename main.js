// const { default: axios } = require("axios");
//
// const { default: axios } = require("axios");
let loginBtns = document.querySelectorAll(".login-btns");
let logout = document.getElementById("logout");
let closeLogin = document.getElementById("close-login");
const baseUrl = "https://tarmeezacademy.com/api/v1";
setUI();
showProfile();
showPosts();
// get all posts

function showPosts() {
    axios.get(`${baseUrl}/posts`).then((response) => {
        let posts = response.data.data;
        console.log(posts);
        for (let i = 0; i < posts.length; i++) {
            let tags = posts[i].tags;
            let allTag = "";
            let postTitle = "";
            if (posts[i].title != null) {
                postTitle = posts[i].title;
            }
            for (tag of tags) {
                allTag += `
            <span class="bg-secondary rounded-pill mx-1 px-2 py-1 text-white">${tag.name}</span>
            `;
            }
            let content = `
            <div class="card my-4 shadow-sm id="${posts[i].id}" onclick="showClickedPost(${posts[i].id})">
            <div class="card-header">
                <img src="${posts[i].author.profile_image}" alt="" class="img-fluid rounded-circle border border-2">
                <b>@${posts[i].author.username}</b>
            </div>
            <div class="card-body">
                <img src="${posts[i].image}" alt="" class="w-100">
                <p class="text-black-50 mt-2">${posts[i].created_at}</p>
                <h3 class="display-6">${postTitle}</h3>
                <p>${posts[i].body}</p>
                <div class="tags">${allTag}</div>
                <hr>
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                    (${posts[i].comments_count}) Comments
                </p>
            </div>
        </div>
            `;
            document.querySelector(".posts").innerHTML += content;
        }
    });
}

// Login

let login = document.getElementById("user-login");
let password = document.getElementById("password-login");
let submitLogin = document.getElementById("submit-login");

submitLogin.onclick = function() {
    axios
        .post(`${baseUrl}/login`, {
            username: login.value,
            password: password.value,
        })
        .then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            loginBtns.forEach((e) => (e.style.display = "none"));
            logout.style.display = "block";
            closeLogin.click();
            showAlert("logged In successfully", "success");
            document.getElementById("addPost").style.display = "block";
            showProfile();
        })
        .catch((error) => {
            console.log(error);
        });
};

// SetUp UI

function setUI() {
    if (localStorage.getItem("token")) {
        loginBtns.forEach((e) => (e.style.display = "none"));
        logout.style.display = "block";
        document.getElementById("addPost").style.display = "block";
    } else {
        loginBtns.forEach((e) => (e.style.display = "inline-block"));
        logout.style.display = "none";
    }
}

// logout
function logoutUser() {
    localStorage.clear();
    document.getElementById("addPost").style.display = "none";
    showAlert("logged out successfully", "danger");
    showProfile();
    setUI();
}

// Register New user
function registerUser() {
    let registerUser = document.getElementById("register-user").value;
    let registerName = document.getElementById("register-name").value;
    let registerPass = document.getElementById("register-pass").value;
    let registerImage = document.getElementById("register-image").files[0];
    let closeRegister = document.getElementById("close-register-modal");

    let registerData = new FormData();
    registerData.append("username", registerUser);
    registerData.append("name", registerName);
    registerData.append("image", registerImage);
    registerData.append("password", registerPass);

    axios
        .post(`${baseUrl}/register`, registerData, {
            headers: {
                "Content-type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            loginBtns.forEach((e) => (e.style.display = "none"));
            logout.style.display = "block";
            closeRegister.click();
            showAlert("User created successfully", "success");
            document.getElementById("addPost").style.display = "block";
            showProfile();
        })
        .catch((error) => {
            showAlert(error.response.data.message, "danger");
        });
}

// show profile
function showProfile() {
    if (localStorage.getItem("user") != null) {
        let divButtons = document.querySelector(".buttons");
        const getInfoProfile = JSON.parse(localStorage.getItem("user"));
        let div = document.createElement("div");
        div.id = "profileInfo";
        div.classList.add("me-2");
        let info = `
            <img src="${getInfoProfile.profile_image}" alt="No">
            <b>${getInfoProfile.username}</b>
        `;
        div.innerHTML = info;
        divButtons.prepend(div);
    } else {
        if (document.getElementById("profileInfo") != null) {
            document.getElementById("profileInfo").remove();
        }
    }
}

// create New Post

function createNewPost() {
    let postTitle = document.getElementById("postTitle").value;
    let postBody = document.getElementById("postBody").value;
    let postImage = document.getElementById("postImage").files[0];

    myToken = localStorage.getItem("token");
    let data = new FormData();
    data.append("title", postTitle);
    data.append("body", postBody);
    data.append("image", postImage);

    axios
        .post(`${baseUrl}/posts`, data, {
            headers: {
                authorization: `Bearer ${myToken}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log(response.data);
            document.getElementById("close-post-modal").click();
            showAlert("New Post created", "success");
            showPosts();
        })
        .catch((error) => {
            showAlert(error.response.data.message, "danger");
        });
}

// Show Alert

function showAlert(customMessage, typeMessage) {
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

    const alert = (message, type) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
        ].join("");

        alertPlaceholder.append(wrapper);
    };

    alert(customMessage, typeMessage);
}

// show clicked post

function showClickedPost(postID) {
    document.querySelector(".posts").innerHTML = "";
    axios.get(`${baseUrl}/posts/${postID}`).then((response) => {
        let post = response.data.data;
        console.log(typeof post.comments_count);
        // show Comments

        // tags
        let tags = post.tags;
        let allTag = "";
        for (tag of tags) {
            allTag += `
        <span class="bg-secondary rounded-pill mx-1 px-2 py-1 text-white">${tag.name}</span>
        `;
        }
        //
        let content = `
        <div class="card my-4 shadow-sm id="${post.id}" onclick="showClickedPost(${post.id})">
        <div class="card-header">
            <img src="${post.author.profile_image}" alt="" class="img-fluid rounded-circle border border-2">
            <b>@${post.author.username}</b>
        </div>
        <div class="card-body">
            <img src="${post.image}" alt="" class="w-100">
            <p class="text-black-50 mt-2">${post.created_at}</p>
            <h3 class="display-6">${post.title}</h3>
            <p>${post.body}</p>
            <div class="tags">${allTag}</div>
            <hr>
            <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
                (${post.comments_count}) Comments
                <div id="comments"></div>
                    </p>
                </div>
                </div>
                <div id="sendComments" class="mb-3 d-flex align-items-center">
                    <input class="form-control" id="commentInput" type="text" placeholder="send comment ..." aria-label="send comment ...">
                    <button onclick="sendComment(${post.id})" class="btn btn-info">SEND</button>
                </div>
        `;
        document.querySelector(".posts").innerHTML = content;
        let commentsNumber = response.data.data.comments_count;
        if (commentsNumber > 0) {
            showComments(post.id);
        }
    });
}

// show comments
function showComments(ID) {
    document.getElementById("comments").innerHTML = "";
    axios.get(`${baseUrl}/posts/${ID}`).then((response) => {
        let post = response.data.data;
        let div = document.createElement("div");
        div.classList.add("bg-info", "p-2", "rounded");
        let comments = post.comments;
        let contentComment = "";
        for (comment of comments) {
            contentComment = `
                <b><img src="${post.image}" class="rounded-circle border border-2 me-2">@${comment.author.username}</b>
                <p class="text-white ms-3">${comment.body}</p>
                `;
            div.innerHTML += contentComment;
        }
        document.getElementById("comments").appendChild(div);
    });
}

// send Comment
function sendComment(ID) {
    if (localStorage.getItem("token") != null) {
        const token = localStorage.getItem("token");
        const message = document.getElementById("commentInput").value;

        let comment = {
            body: message,
        };
        axios
            .post(`${baseUrl}/posts/${ID}/comments`, comment, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                showComments(ID);
                console.log(response.data);
            })
            .catch((e) => {
                showAlert(e.response.data.message, "danger");
            });
    } else {
        showAlert("Please Login", "danger");
    }
}