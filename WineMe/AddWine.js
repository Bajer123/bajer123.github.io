document.addEventListener('DOMContentLoaded', (event) => {
    const addButton = document.getElementById('addButton');
    const wineInput = document.getElementById('wineInput');
    const displayBox = document.getElementById('displayBox');
    let wines = [];

    addButton.addEventListener('click', function() {
        const text = wineInput.value.trim(); // Get the input text and trim whitespace
        if(text) {
            wines.push(text);
            const div = document.createElement('div'); // Create a new div element for the box
            div.textContent = text; // Set its text content to the input value
            div.classList.add('wine-box'); // Add a class for styling

            const deleteButton = document.createElement('button'); // Create a delete button
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button'); // Add a class for styling
            deleteButton.onclick = function() { // Attach click event handler to delete button
                div.remove(); // This will remove the box
            };

            div.appendChild(deleteButton); // Append the delete button to the div
            displayBox.appendChild(div); // Append the new div to the display box

            wineInput.value = ''; // Clear the input field
        }
    });
});


const homeButton = document.getElementById('navigateButtonHome');
if (homeButton) {
  homeButton.addEventListener('click', function() {
    window.location.href = 'index.html'; 
  });
}