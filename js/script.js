/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * script.js */


/* =======================
Removing HTML comments
======================== */
/**
 * [Removes the HTML comments using regex and replace().]
 */
function removeComments() {
    //Select the body element and remove all the HTML comments.
        const newBody = document.querySelector("body").innerHTML.replace(/<!--[\s\S]*?-->/g, "");
        document.querySelector("body").innerHTML = newBody
}

// Call the function to remove the HTML comments
removeComments();


/* =======================
DOM declarations
======================== */
const header = document.querySelector("header");
const searchDiv = document.querySelector(".search-container");
const galleryDiv = document.querySelector(".gallery");
const script = document.querySelector("script");


/* =======================
Response handling
======================== */
/**
 * [Fetches data from an API and convert the body text to JSON. Also checks for potential errors from API server]
 *
 * @param {string} url: An uniform resource locator to an API
 * @return {promise object}  A promise object with body text parsed in JSON.
 */
function getEmployeeData (url) {
    return fetch(url)
        .then (checkStatus)
        .then (response => response.json())
        .catch (error => console.log("Error:", error))   
}


/* =======================
Error handling
======================== */
/**
 * [Captures the response and check if status is OK (returns a promise if resolved and optionally an Error object if rejected)]
 *
 * @param {object} response: A response interface from an API fetch request
 * @return {promise object} A "resolved"/"rejected" promise
 */
function checkStatus (response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


/* =======================
Search Markup
======================== */
/**
 * [Appends a search bar to the header element]
 */
 function addSearchBar () {
    const searchBarDiv = document.querySelector("div.search-container");
    let html = `<form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                </form>`;
    
    searchBarDiv.innerHTML = html;
}


/* =======================
Gallery Markup
======================== */
/**
 * [Generate employee cards from the parsed JSON data with added search and modal window creation functionalities.]
 *
 * @param {object object} data: Object consisting of employees' personal informations.
 * @param {integer} index: each integer corresponds to a specific employee.
 */
function addCard (data, index) {
    const employeeInfo = data[index];
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    let html = `<div class="card-img-container">
                    <img class="card-img" src="${employeeInfo.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employeeInfo.name.first} ${employeeInfo.name.last}</h3>
                    <p class="card-text">${employeeInfo.email}</p>
                    <p class="card-text cap">${employeeInfo.location.city}, ${employeeInfo.location.state}</p>
                </div>`;
    cardDiv.innerHTML = html;
    galleryDiv.appendChild(cardDiv);
    
    //Event handler - Search function that filters the users
    const searchBar = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-submit");

    //Real-time search feature
    searchBar.addEventListener("keyup", () => {
        const searchInput = document.querySelector("#search-input").value.toLowerCase();
        const cardDivs = document.querySelectorAll("div.card");
        for (let i = 0; i < cardDivs.length; i++) {
            if (!cardDivs[i].querySelector("div.card-info-container").querySelector("#name").textContent.toLowerCase().includes(searchInput)) {
                cardDivs[i].style.display = "none";
            }
            else {
                cardDivs[i].style.display = "";
            }
        }
    })

    //Submit search feature
    searchButton.addEventListener("click", () => {
        const searchInput = document.querySelector("#search-input").value.toLowerCase();
        console.log(searchInput);
        const cardDivs = document.querySelectorAll("div.card");
        for (let i = 0; i < cardDivs.length; i++) {
            if (!cardDivs[i].querySelector("div.card-info-container").querySelector("#name").textContent.toLowerCase().includes(searchInput)) {
                cardDivs[i].style.display = "none";
            }
            else {
                cardDivs[i].style.display = "";
            }
        }
    })

    //Event handler - To bring up the modal window
    cardDiv.addEventListener("click", () => {
        //Array to store employee's that are displayed on the gallery.
        let indexArray = [];
        addModal(data, index);
        for (let i = 0; i < document.querySelectorAll("div.card").length; i++) {
            if (document.querySelectorAll("div.card")[i].style.display === "") {
                indexArray.push(i);
            }
        }
        if (index === indexArray[0]) {
            document.querySelector("#modal-prev").style.display = "none";
        }
        if (index === indexArray[indexArray.length-1]) {
            document.querySelector("#modal-next").style.display = "none";
        }
    });
}


/* =======================
Modal Markup
======================== */
/**
 * [Generate modal window with data and indices passed from "addCard" function. Added button navigation functionalities]
 *
 * @param {object object} data: Object consisting of employees' personal informations.
 * @param {integer} index: each integer corresponds to a specific employee.
 * 
 */
function addModal (data, index) {
    const employeeInfo = data[index];
    const birthday = employeeInfo.dob.date;
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal-container";
    modalDiv.style.display = "";
    let html = `<div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employeeInfo.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employeeInfo.name.first} ${employeeInfo.name.last}</h3>
                    <p class="modal-text">${employeeInfo.email}</p>
                    <p class="modal-text cap">${employeeInfo.location.city}</p>
                    <hr>
                    <p class="modal-text">${employeeInfo.cell}</p>
                    <p class="modal-text">${employeeInfo.location.street.number} ${employeeInfo.location.street.name}, ${employeeInfo.location.city}, ${employeeInfo.location.state} ${employeeInfo.location.postcode}</p>
                    <p class="modal-text">Birthday: ${birthday.slice(5, 7)}/${birthday.slice(8, 10)}/${birthday.slice(0, 4)}</p>
                </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>`;

    modalDiv.innerHTML = html;
    script.insertAdjacentElement("beforebegin", modalDiv);
    
    //Event handler - To remove the modal window.
    const button = document.querySelector("#modal-close-btn");
    button.addEventListener("click", () => {
        modalDiv.remove();
    });

    //Event handlers - To navigate through modal windows with "Next" and "Prev" buttons
    const nextModal = document.querySelector("#modal-next");
    const prevModal = document.querySelector("#modal-prev");
    const employeeName = document.querySelector("div.modal-container").querySelector("#name").textContent;
    const cardDivs = document.querySelectorAll("div.card");

    //Array to store employee's that are currently displayed on the gallery.
    let indexArray = [];

    for (let i = 0; i < document.querySelectorAll("div.card").length; i++) {
        if (document.querySelectorAll("div.card")[i].style.display === "") {
            indexArray.push(i);
        }
    }

    //"Next" button
    nextModal.addEventListener("click", () => {
        for (let i = 0; i < indexArray.length; i++) {
            if (employeeName === cardDivs[indexArray[i]].querySelector("#name").textContent) {
                //Next last card will prompt a modal window without button
                if (index === indexArray[indexArray.length-2]) {
                    modalDiv.remove();
                    addModal(data, indexArray[i+1]);
                    document.querySelector("#modal-next").style.display = "none";
                }
                else {
                    modalDiv.remove();
                    addModal(data, indexArray[i+1]);                    
                }
            }                
        }
    });

    //"Prev" button
    prevModal.addEventListener("click", (e) => {
        for (let i = 0; i < indexArray.length; i++) {
            if (employeeName === cardDivs[indexArray[i]].querySelector("#name").textContent) {
                if (index === indexArray[1]) {
                    modalDiv.remove();
                    addModal(data, indexArray[i-1]);
                    document.querySelector("#modal-prev").style.display = "none";
                }
                else {
                    modalDiv.remove();
                    addModal(data, indexArray[i-1]);
                }
            }                
        }
    });    
}

/**
 * [Convert dob data to a birthday format of month/day/year]
 *
 * @param {string} data: Object consisting of employees' personal informations.
 */
function formatBirthday(data) {
    const birthday = data;
    // Month/Day/Year occording to mockups
    birthday = `${birthday.slice(5, 7)}/${birthday.slice(8, 10)}/${birthday.slice(0, 4)}`; 
}


/* =======================
Setting the gallery up
======================== */
/**
 * [Calls the "addCard" function to generate employee cards from the parsed JSON data]
 *
 * @param {string} url: An uniform resource locator to an API.
 */
 function setGalleryUp (api) {
    getEmployeeData(api)
    .then(data => {        
        for (let i = 0; i < data.results.length; i++) {
            addCard(data.results, i);
            console.log(data.results[i]);
        }
    })
}

//Add search bar to the DOM
addSearchBar();

//Set up a directory with 12 employees
setGalleryUp("https://randomuser.me/api/?results=12&nat=us");


/* =======================
Styling the DOM
======================== */
document.querySelector("body").style.backgroundColor = "#ebf1fa";
const backgroundImg = document.createElement("img");
backgroundImg.style.width = "100%";
backgroundImg.src = "https://picsum.photos/2500/400/";
header.appendChild(backgroundImg);