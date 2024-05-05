



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

  let results = document.getElementById('Results');

  //Get results 
  let wineType = localStorage.getItem('WineType');
  let wineNames = localStorage.getItem("WineNames");

  //Text above image 
  let expTop = document.getElementById("explanationTop");
  let textTop = document.createElement("p");
  textTop.id = 'textTop';
  let imgType = getFoodType(wineType);
  textTop.innerHTML = 'A ' + wineType + ' is recommended because ' + imgType + ' was identified';
  expTop.appendChild(textTop);

  //Names and more info
  let names = document.createElement('p');
  names.id = 'names';
  names.innerHTML = wineNames + " was recommended because of";
  results.appendChild(names);

  //Bulletpoints under name of wines
  let bulletpointsContainer = document.createElement('div');
  bulletpointsContainer.className = "bulletPoints";

  // Create an unordered list element
  let bulletList = document.createElement('ul');

  // Bulletpoint 1 - Sweetness
  let bulletPoint1 = document.createElement('li');
  bulletPoint1.innerHTML = getSweetness(wineType) + ' is good for ' + getFoodType(wineType);
  bulletList.appendChild(bulletPoint1);

  // Get notes and intensity
  let notesAndIntensity = getNotesAndIntensity(wineNames);
  let notes = notesAndIntensity.notes;
  let intensity = notesAndIntensity.intensity;

  // Bulletpoint 2 - Notes 
  let bulletPoint2 = document.createElement('li');
  bulletPoint2.innerHTML = "This wine has notes of " + notes;
  bulletList.appendChild(bulletPoint2);

  // BulletPoint 3 - Intensity
  let bulletPoint3 = document.createElement('li');
  bulletPoint3.innerHTML = "This wine's intensity is " + intensity;
  bulletList.appendChild(bulletPoint3);

  bulletpointsContainer.appendChild(bulletList);
  results.appendChild(bulletpointsContainer);

}


function getNotesAndIntensity(WineNames) {
  //Dummy notes
  let notes;
  let intensity;

  //Red dry
  if (WineNames === "Cabernet Sauvignon") {
    notes = 'oak';
    intensity = 'strong';
  } else if (WineNames === "Merlot") {
    notes = 'chocolate';
    intensity = 'strong';
  } else if (WineNames === "Pinot Noir") {
    notes = 'cherry';
    intensity = 'light';
  }
  //Red Sweet
  else if (WineNames === "Port") {
    notes = 'oak';
    intensity = 'strong';
  } else if (WineNames === "Lambrusco") {
    notes = 'strawberry';
    intensity = 'medium';
  } else if (WineNames === "Brachetto d'Acqui") {
    notes = 'raspberry';
    intensity = 'medium';
  }
  //White dry
  else if (WineNames === "Sauvignon Blanc") {
    notes = "citrus";
    intensity = 'light-medium';
  } else if (WineNames === "Chardonnay") {
    notes = 'oak';
    intensity = 'medium-strong';
  } else if (WineNames === "Pinot Grigio") {
    notes = 'peach';
    intensity = 'medium';
  }
  //White sweet
  else if (WineNames === "Riesling") {
    notes = 'peach';
    intensity = 'medium-strong';
  } else if (WineNames === "Moscato") {
    notes = 'pear';
    intensity = 'light-medium';
  } else if (WineNames === "Gewürztraminer") {
    notes = 'peach';
    intensity = 'medium-strong';
  }
  //Rose Dry
  else if (WineNames === "Provence Rosé") {
    notes = 'strawberry';
    intensity = 'medium';
  } else if (WineNames === "White Merlot") {
    notes = 'raspberry';
    intensity = 'medium';
  } else if (WineNames === "Rosado") {
    notes = 'strawberry';
    intensity = 'medium';
  }
  //Rose Sweet
  else if (WineNames === "White Zinfandel") {
    notes = 'strawberry';
    intensity = 'medium';
  } else if (WineNames === "White Grenache") {
    notes = 'raspberry';
    intensity = 'medium';
  } else if (WineNames === "Rosé d'Anjou") {
    notes = 'strawberry';
    intensity = 'light';
  }

  return { notes: notes, intensity: intensity };
}

function getSweetness(wineType) {
  let res = wineType.charAt(wineType.length - 1);

  if (res === 'y') {
    return 'Dryness';
  }
  return 'Sweetness';

}

function getFoodType(wineType) {
  //Dummy food type
  let foodType = ''
  if (wineType === 'Red Dry') {
    foodType = 'dark meat';
  } else if (wineType === 'Red Sweet') {
    foodType = 'chocolate';
  } else if (wineType === 'White Dry') {
    foodType = 'seafood';
  } else if (wineType === 'White Sweet') {
    foodType = 'a creamy dessert';
  } else if (wineType === 'Rose Dry') {
    foodType = 'a salad';
  } else if (wineType === 'Rose Sweet') {
    foodType = 'a pastry dessert';
  }
  return foodType;

}