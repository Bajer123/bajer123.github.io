document.addEventListener('DOMContentLoaded', (event) => {
    const addButton = document.getElementById('addButton');
    const wineInput = document.getElementById('wineInput');
    const displayBox = document.getElementById('displayBox');

    let redDry = ["Cabernet Sauvignon", "Merlot", "Pinot Noir"];
    let redSweet = ["Port", "Lambrusco", "Brachetto d'Acqui"];
    let whiteDry = ["Sauvignon Blanc", "Chardonnay", "Pinot Grigio"];
    let whiteSweet = ["Riesling", "Moscato", "Gewürztraminer"];
    let roseDry = ["Provence Rosé", "White Merlot", "Rosado"];
    let roseSweet = ["White Zinfandel", "White Grenache", "Rosé d'Anjou"];

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
        div.textContent = addWineType(text);
        div.classList.add('wine-box');

        // Determine the background color based on the type of wine
        if (redDry.includes(text) || redSweet.includes(text)) {
            div.style.backgroundColor = '#EF8383';
        } else if (whiteDry.includes(text) || whiteSweet.includes(text)) {
            div.style.backgroundColor = '#FDDFDF';
        } else if (roseDry.includes(text) || roseSweet.includes(text)) {
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

    function addWineType(wine) {
        if (redDry.includes(wine)) {
            return wine + "- Dry";
        } else if (redSweet.includes(wine)) {
            return wine + "- Sweet";
        } else if (whiteDry.includes(wine)) {
            return wine + "- Dry";
        } else if (whiteSweet.includes(wine)) {
            return wine + "- Sweet";
        } else if (roseDry.includes(wine)) {
            return wine + "- Dry";
        } else if (roseSweet.includes(wine)) {
            return wine + "- Sweet";
        } else {
            return wine;
        }
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
