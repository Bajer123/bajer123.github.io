



//Button back to add dish
const addButton = document.getElementById('navigateButtonAddDish');
if (addButton) {
  addButton.addEventListener('click', function () {
    window.location.href = 'AddDish.html';
  });
}navigateButtonAddDish


/*Load image uploaded on Add Dish page */
const IMAGE_SIZE = 224;

window.onload = function() {
    // Retrieve the image data from localStorage
    let uploadedImage = localStorage.getItem('uploadedImage');
    // Display the image in the explanation page
    if (uploadedImage) {
        let img = document.createElement('img');
        img.src = uploadedImage;

        img.width = IMAGE_SIZE;
        img.height = IMAGE_SIZE;
        
        // Add the image to the container in Explanation.html
        let imageContainer = document.getElementById('uploadedImageContainer');
        imageContainer.appendChild(img);
    }
};