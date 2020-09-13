const myGifosContainer = document.getElementById("my-gifos-container");

function loadGifs() {
    myGifosContainer.innerHTML = '';
    let myGifosArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith('id')){
            myGifosArray.push(localStorage.key(i));
        }   
    };

    for (let i = 0; i < myGifosArray.length; i++) {
        let gifId = myGifosArray[i];
        let storedGifUrl = localStorage.getItem(gifId);
        let storedGifoDiv = document.createElement('div');
        storedGifoDiv.classList.add("gif-frame");
        let storedGifo = document.createElement('img');
        storedGifo.classList.add("my-gifos-content");
        storedGifo.src = storedGifUrl;

        storedGifoDiv.appendChild(storedGifo);
        myGifosContainer.appendChild(storedGifoDiv);
    };
};

loadGifs();
