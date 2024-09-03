const cardsContainer = document.getElementById("cards");
const shuffle = document.getElementById("shuffle");
const selectors = document.getElementById("selectors");
const clearBtn = document.getElementById("clear");
let wholeData;

const retrieveData = async () => {
    const response = await fetch("./data.json");
    const data = await response.json();
    return data;
}

retrieveData().then(data => {
    wholeData = data;
    console.log(wholeData);
});


const programAttributes = () => {
    const attributes = document.querySelectorAll(".attribute");
    attributes.forEach(attribute => {
        attribute.addEventListener("click", (event) => {
            shuffle.style.display = "flex";
            const presentSelectors = document.querySelectorAll(".selector .left");
            const clickedAttributeText = event.target.textContent;
            if (![...presentSelectors].some(el => el.textContent === clickedAttributeText)) {
                const selectorDiv = document.createElement("div");
                selectorDiv.classList.add("selector");

                const leftDiv = document.createElement("div");
                leftDiv.classList.add("left");
                leftDiv.textContent = clickedAttributeText;

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete");
                deleteBtn.textContent = "X";

                selectorDiv.appendChild(leftDiv);
                selectorDiv.appendChild(deleteBtn);
                selectors.appendChild(selectorDiv);

                deleteBtn.addEventListener("click", (event) => {
                    event.target.parentElement.remove();
                    filterCards();
                    if (selectors.children.length === 0) {
                        shuffle.style.display = "none";
                    }
                });
            }
            filterCards();
        });
    });
}

const displayData = (objectsArray) => {
    cardsContainer.innerHTML = "";
    objectsArray.forEach(object => {
        const { logo, company, isNew, isFeatured, position, postedAt, contract, location, role, level, tools, languages } = object;
        cardsContainer.innerHTML += `
            <div class="card">
                <img class="company-logo" src="${logo}" alt="${company} company's logo.">
                <div class="head">
                    <div class="top">
                        <span class="company">${company}</span>
                        <div class="tags">
                        </div>
                    </div>
                    <div class="job-title">${position}</div>
                    <div class="details">
                        <span>${postedAt}</span>&#9679;<span>${contract}</span>&#9679;<span>${location}</span>
                    </div>
                </div>
                <hr>
                <div class="body">
                    <span class="attribute">${role}</span>
                    <span class="attribute">${level}</span>
                </div>
            </div>
        `;
        const tags = document.querySelectorAll(".tags");
        const bodies = document.querySelectorAll(".body");
        isNew && (tags[tags.length - 1].innerHTML += `<span class="tag new">new!</span>`);
        if(isFeatured) {
            tags[tags.length - 1].innerHTML += `<span class="tag featured">featured</span>`;
            bodies[bodies.length - 1].parentElement.classList.add("featured")
        }
        tools.forEach(tool => {
            bodies[bodies.length - 1].innerHTML += `<span class="attribute">${tool}</span>`;
        });
        languages.forEach(language => {
            bodies[bodies.length - 1].innerHTML += `<span class="attribute">${language}</span>`;
        });
    });
    programAttributes();
}

const filterCards = () => {
    retrieveData().then(data => {
        displayData(data);
        const selectedAttributesElements = document.querySelectorAll("#selectors .selector .left");
        const selectedAttributes = [];
        const cards = document.querySelectorAll("#cards .card");
        selectedAttributesElements.forEach(el => {
            selectedAttributes.push(el.textContent);
        });
        cards.forEach(card => {
            const cardAttributesElements = card.querySelectorAll(".body .attribute");
            const cardAttributes = [];
            cardAttributesElements.forEach(el => {
                cardAttributes.push(el.textContent);
            });
            if(!selectedAttributes.every(attribute => cardAttributes.includes(attribute))) {
                card.remove();
            }
        });
    });
}

fetch("./data.json")
.then(res => res.json())
.then(data => {
    displayData(data);
    clearBtn.addEventListener("click", () => {
        selectors.innerHTML = "";
        shuffle.style.display = "none";
        displayData(data);
    });
});