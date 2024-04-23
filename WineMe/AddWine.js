document.addEventListener('DOMContentLoaded', (event) => {
    const addButton = document.getElementById('addButton');
    const wineInput = document.getElementById('wineInput');
    const displayBox = document.getElementById('displayBox');
    let wines = [];

    let redWines = ["Merlot", "Sangiovese", "Zinfandel"]; 
    let whiteWines = ["Chardonnay", "Riesling", "Muscat"];
    let roseWines = ["Cabernet", "Syrah", "Provence"];
    

    addButton.addEventListener('click', function () {
        const text = wineInput.value.trim(); // Get the input text and trim whitespace
        if (text) {
            wines.push(text);
            const div = document.createElement('div'); // Create a new div element for the box
            div.textContent = text; // Set its text content to the input value
            div.classList.add('wine-box'); // Add a class for styling

            if (redWines.includes(text)) {
                div.style.backgroundColor = '#EF8383'; // Set background color to red
            } else if (whiteWines.includes(text)) {
                div.style.backgroundColor = '#FDDFDF'; // Set background color to white
            } else if (roseWines.includes(text)) {
                div.style.backgroundColor = '#F6B3C7'; // Set background color to pink
            } else {
                div.style.backgroundColor = 'grey'; // Default color if no match
            }


            
            const deleteButton = document.createElement('button'); // Create a delete button
            deleteButton.classList.add('delete-button'); // Add a class for styling
            const icon = document.createElement('span'); // Create a span for the icon
            icon.classList.add('material-symbols-outlined');
            icon.textContent = 'cancel'; // Set the icon text
            deleteButton.appendChild(icon);
            deleteButton.onclick = function () { // Attach click event handler to delete button
                const index = wines.indexOf(text);
                if (index > -1) {
                    wines.splice(index, 1); // Remove the wine from the array
                }
                div.remove(); // Remove the box from the display
            };

            div.appendChild(deleteButton); // Append the delete button to the div
            displayBox.appendChild(div); // Append the new div to the display box

            wineInput.value = ''; // Clear the input field
        }
    });
});


const homeButton = document.getElementById('navigateButtonHome');
if (homeButton) {
    homeButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
}