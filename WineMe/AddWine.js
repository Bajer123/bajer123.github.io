document.addEventListener('DOMContentLoaded', (event) => {
    const addButton = document.getElementById('addButton');
    const wineInput = document.getElementById('wineInput');
    const displayBox = document.getElementById('displayBox');

    let redWines = ["Merlot", "Sangiovese", "Zinfandel"]; 
    let whiteWines = ["Chardonnay", "Riesling", "Muscat"];
    let roseWines = ["Cabernet", "Syrah", "Provence"];

    // Function to load wines from localStorage and create wine boxes
    function loadWines() {
        let storedWines = JSON.parse(localStorage.getItem('wines')) || [];
        storedWines.forEach(text => createWineBox(text));
    }

    // Call loadWines to display wine boxes from localStorage
    loadWines();

    // Function to create a wine box
    function createWineBox(text) {
        const div = document.createElement('div'); 
        div.textContent = text;
        div.classList.add('wine-box');

        // Determine the background color based on the type of wine
        if (redWines.includes(text)) {
            div.style.backgroundColor = '#EF8383'; 
        } else if (whiteWines.includes(text)) {
            div.style.backgroundColor = '#FDDFDF'; 
        } else if (roseWines.includes(text)) {
            div.style.backgroundColor = '#F6B3C7'; 
        } else {
            div.style.backgroundColor = 'grey'; 
        }

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        const icon = document.createElement('span');
        icon.classList.add('material-symbols-outlined');
        icon.textContent = 'cancel';
        deleteButton.appendChild(icon);

        deleteButton.onclick = function () {
            // Find and remove the wine box from the local storage
            let storedWines = JSON.parse(localStorage.getItem('wines')) || [];
            const index = storedWines.indexOf(text);
            if (index > -1) {
                storedWines.splice(index, 1); 
                localStorage.setItem('wines', JSON.stringify(storedWines));
            }
            div.remove(); 
        };

        div.appendChild(deleteButton); 
        displayBox.appendChild(div);
    }

    // Event listener for the Add button
    addButton.addEventListener('click', function () {
        const text = wineInput.value.trim();
        if (text) {
            createWineBox(text);
            // Add the wine box to local storage
            let storedWines = JSON.parse(localStorage.getItem('wines')) || [];
            storedWines.push(text);
            localStorage.setItem('wines', JSON.stringify(storedWines));
            wineInput.value = '';
        }
    });

    const homeButton = document.getElementById('navigateButtonHome');
    if (homeButton) {
        homeButton.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }
});
