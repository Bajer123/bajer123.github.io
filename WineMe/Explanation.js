



//Button back to add dish
const addButton = document.getElementById('navigateButtonAddDish');
if (addButton) {
  addButton.addEventListener('click', function () {
    window.location.href = 'AddDish.html';
  });
} navigateButtonAddDish


/*Load image uploaded on Add Dish page */
const IMAGE_SIZE = 224;

window.onload = function () {
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
  loadResults();
};

function loadResults() {

  //Get results 
  let wineType = localStorage.getItem('WineType');
  let wineNames = localStorage.getItem("WineNames");

  let test = document.createElement('div');

  //Names
  let names = document.createElement('p');
  names.id = 'names';
  names.innerHTML = wineNames;
  test.appendChild(names);

  let results = document.getElementById('Results');
  results.appendChild(test);

  //Text above image 
  let expTop = document.getElementById("explanationTop");
  let textTop = document.createElement("p");
  textTop.id = 'textTop';
  let imgType = getFoodType(wineType);
  textTop.innerHTML = 'A ' + wineType + ' is recommended because ' + imgType + ' was identified';
  expTop.appendChild(textTop);

}

function getFoodType(wineType) {
  let foodType = ''
  if (wineType === 'Red Dry'){
    foodType = 'dark meat';
  } else if (wineType === 'Red Sweet'){
    foodType = 'chocolate';
  } else if (wineType === 'White Dry'){
    foodType = 'seafood';
  } else if (wineType === 'White Sweet'){
    foodType = 'a creamy dessert';
  } else if (wineType === 'Rose Dry'){
    foodType = 'a salad';
  } else if (wineType === 'Rose Sweet'){
    foodType = 'a pastry dessert';
  }
  return foodType;

}