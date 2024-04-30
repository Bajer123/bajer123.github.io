/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

let redDry = ["Cabernet Sauvignon", "Merlot", "Pinot Noir"];
let redSweet = ["Port", "Lambrusco", "Brachetto d'Acqui"];
let whiteDry = ["Sauvignon Blanc", "Chardonnay", "Pinot Grigio"];
let whiteSweet = ["Riesling", "Moscato", "Gewürztraminer"];
let roseDry = ["Provence Rosé", "White Merlot", "Rosado"];
let roseSweet = ["White Zinfandel", "White Grenache", "Rosé d'Anjou"];

let redAndDry = [];
let redAndSweet = [];
let whiteAndDry = [];
let whiteAndSweet = [];
let roseAndDry = [];
let roseAndSweet = [];

function loadWineRack() {

  redAndDry = [];
  redAndSweet = [];
  whiteAndDry = [];
  whiteAndSweet = [];
  roseAndDry = [];
  roseAndSweet = [];
  // Retrieve wines from local storage
  let storedWines = JSON.parse(localStorage.getItem('wines')) || [];

  // Match wines against red, white, and rose lists
  storedWines.forEach(wine => {
    if (redDry.includes(wine)) {
      redAndDry.push(wine);
    } else if (redSweet.includes(wine)) {
      redAndSweet.push(wine);
    } else if (whiteDry.includes(wine)) {
      whiteAndDry.push(wine);
    } else if (whiteSweet.includes(wine)) {
      whiteAndSweet.push(wine);
    } else if (roseDry.includes(wine)) {
      roseAndDry.push(wine);
    } else if (roseSweet.includes(wine)) {
      roseAndSweet.push(wine);
    }
  });

}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  console.log(ev);
  //var data = ev.dataTransfer.getData("text");
  //ev.target.appendChild(document.getElementById(data));

  var reader = new FileReader();
  reader.onload = e => {
    // Fill the image & call predict.
    let img = document.createElement('img');
    img.src = e.target.result;
    img.width = IMAGE_SIZE;
    img.height = IMAGE_SIZE;
    img.onload = () => predict(img);
  };

  //reader.onload = function(e){
  //  var dropdata = new Uint8Array(e.target.result);
  //};
  //reader.readAsText(e.dataTransfer.files[0]);  // If text 
  reader.readAsDataURL(ev.dataTransfer.files[0]); // If binary
  console.log(ev);
}

//import * as tf from '@tensorflow/tfjs';

import { IMAGENET_CLASSES } from './my_classes.js';

const MOBILENET_MODEL_PATH = './mobilenet/model.json';
// tslint:disable-next-line:max-line-length
//'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 3;

let mobilenet;
const mobilenetDemo = async () => {
  status('Loading model...');

  mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);

  // Warmup the model. This isn't necessary, but makes the first prediction
  // faster. Call `dispose` to release the WebGL memory allocated for the return
  // value of `predict`.
  //mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

  status('');

  // Make a prediction through the locally hosted cat.jpg.
  /**const catElement = document.getElementById('cat');
  if (catElement.complete && catElement.naturalHeight !== 0) {
    predict(catElement);
    catElement.style.display = '';
  } else {
    catElement.onload = () => {
      predict(catElement);
      catElement.style.display = '';
    }
  }
  */

  document.getElementById('file-container').style.display = '';
};


// Listener for navigating back to Home page
const homeButton = document.getElementById('navigateButtonHome');
if (homeButton) {
  homeButton.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
}

const WineRackButton = document.getElementById('navigateButtonWineRack');
if (WineRackButton) {
  WineRackButton.addEventListener('click', function () {
    window.location.href = 'WineRack.html';
  });
}

const AddWineButton = document.getElementById('navigateButtonAddWine');
if (AddWineButton) {
  AddWineButton.addEventListener('click', function () {
    window.location.href = 'AddWine.html';
  });
}

const addButton = document.getElementById('navigateButtonAddDish');
if (addButton) {
  addButton.addEventListener('click', function () {
    window.location.href = 'AddDish.html';
  });
}

/**
 * Given an image element, makes a prediction through mobilenet returning the
 * probabilities of the top K classes.
 */
async function predict(imgElement) {
  status('Predicting...');

  predictionsElement.innerHTML = '';

  // The first start time includes the time it takes to extract the image
  // from the HTML and preprocess it, in additon to the predict() call.
  const startTime1 = performance.now();
  // The second start time excludes the extraction and preprocessing and
  // includes only the predict() call.
  let startTime2;
  const logits = tf.tidy(() => {
    // tf.browser.fromPixels() returns a Tensor from an image element.
    const img = tf.browser.fromPixels(imgElement).toFloat();

    const offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    const normalized = img.sub(offset).div(offset);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

    startTime2 = performance.now();
    // Make a prediction through mobilenet.
    return mobilenet.predict(batched);
  });

  // Convert logits to probabilities and class names.
  const classes = await getTopKClasses(logits, TOPK_PREDICTIONS);
  const totalTime1 = performance.now() - startTime1;
  const totalTime2 = performance.now() - startTime2;
  status(`Done in ${Math.floor(totalTime1)} ms ` +
    `(not including preprocessing: ${Math.floor(totalTime2)} ms)`);

  // Show the classes in the DOM.
  showResults(imgElement, classes);
}

/**
 * Computes the probabilities of the topK classes given logits by computing
 * softmax to get probabilities and then sorting the probabilities.
 * @param logits Tensor representing the logits from MobileNet.
 * @param topK The number of top predictions to show.
 */
export async function getTopKClasses(logits, topK) {
  const values = await logits.data();

  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({ value: values[i], index: i });
  }
  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });
  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const topClassesAndProbs = [];
  for (let i = 0; i < topkIndices.length; i++) {
    topClassesAndProbs.push({
      className: IMAGENET_CLASSES[topkIndices[i]],
      probability: topkValues[i]
    })
  }
  return topClassesAndProbs;
}

//
// UI SHOW Certainly 
//

function showResults(imgElement, classes) {
  loadWineRack();
  // Print the lists of red, white, and rose wines
  console.log("Red Wines (Dry):", redAndDry.join(', '));
  console.log("Red Wines (Sweet):", redAndSweet.join(', '));
  console.log("White Wines (Dry):", whiteAndDry.join(', '));
  console.log("White Wines (Sweet):", whiteAndSweet.join(', '));
  console.log("Rose Wines (Dry):", roseAndDry.join(', '));
  console.log("Rose Wines (Sweet):", roseAndSweet.join(', '));

  const predictionContainer = document.createElement('div');
  predictionContainer.className = 'pred-container';

  //Show uploaded image
  const imgContainer = document.createElement('div');
  imgContainer.id = 'picture';
  imgContainer.appendChild(imgElement);
  predictionContainer.appendChild(imgContainer);

  //Recommendation text before box
  const predictionText = document.createElement('p')
  predictionText.className = 'predText'
  predictionText.innerText = 'Recommendation'
  predictionContainer.appendChild(predictionText)

  // Find the class with the highest probability
  let maxProbabilityClass = classes[0];
  for (let i = 1; i < classes.length; i++) {
    if (classes[i].probability > maxProbabilityClass.probability) {
      maxProbabilityClass = classes[i];
    }
  }

  //Make recommendation box
  const maxProbRow = document.createElement('div');
  maxProbRow.id = 'recomendation';
  maxProbRow.className = 'row';

  // Type of wine based on probability 
  const maxProbClassContainer = document.createElement('div');
  maxProbClassContainer.className = 'cell';
  maxProbClassContainer.id = 'type';

  const maxProbClassElement = document.createElement('div');
  maxProbClassElement.innerText = maxProbabilityClass.className;
  maxProbClassContainer.appendChild(maxProbClassElement);
  console.log("Class name ", maxProbabilityClass.className)


  // Add corresponding wines based on the class
  //Where the following recommendations are used
  /*
  If no "redAndDry" is available, recommending "whiteAndDry" as an alternative.
  If no "redAndSweet" is available, recommending "whiteAndSweet" as an alternative.
  If no "whiteAndDry" is available, recommending "redAndDry" as an alternative.
  If no "whiteAndSweet" is available, recommending "redAndSweet" as an alternative.
  If no "roseAndDry" is available, recommending "whiteAndDry" as an alternative.
  If no "roseAndSweet" is available, recommending "whiteAndSweet" as an alternative.
  */
  let correspondingWines;
  if (maxProbabilityClass.className === 'Red Dry') {
    correspondingWines = redAndDry.slice(0, 2).join(', ');
    if (correspondingWines === '' && redAndSweet.length > 0) {
      correspondingWines = redAndSweet.slice(0, 2).join(', ');
    }
  } else if (maxProbabilityClass.className === 'Red Sweet') {
    correspondingWines = redAndSweet.slice(0, 2).join(', ');
    if (correspondingWines === '' && redAndDry.length > 0) {
      correspondingWines = redAndDry.slice(0, 2).join(', ');
    }
  } else if (maxProbabilityClass.className === 'White Dry') {
    correspondingWines = whiteAndDry.slice(0, 2).join(', ');
    if (correspondingWines === '' && whiteAndSweet.length > 0) {
      correspondingWines = whiteAndSweet.slice(0, 2).join(', ');
    }
  } else if (maxProbabilityClass.className === 'White Sweet') {
    correspondingWines = whiteAndSweet.slice(0, 2).join(', ');
    if (correspondingWines === '' && whiteAndDry.length > 0) {
      correspondingWines = whiteAndDry.slice(0, 2).join(', ');
    }
  } else if (maxProbabilityClass.className === 'Rose Dry') {
    correspondingWines = roseAndDry.slice(0, 2).join(', ');
    if (correspondingWines === '' && roseAndSweet.length > 0) {
      correspondingWines = roseAndSweet.slice(0, 2).join(', ');
    }
  } else if (maxProbabilityClass.className === 'Rose Sweet') {
    correspondingWines = roseAndSweet.slice(0, 2).join(', ');
    if (correspondingWines === '' && roseAndDry.length > 0) {
      correspondingWines = roseAndDry.slice(0, 2).join(', ');
    }
  }


  // Create and append element for corresponding wines
  const winesElement = document.createElement('div');
  winesElement.className = 'corresponding-wines';
  winesElement.innerText = correspondingWines;

  maxProbClassContainer.appendChild(winesElement);

  maxProbRow.appendChild(maxProbClassContainer);

  //Certainty
  const maxProbElement = document.createElement('div');
  maxProbElement.className = 'certainty';
  // Certainty text
  const certaintyText = document.createElement('div');
  certaintyText.innerText = 'Certainty ';
  maxProbElement.appendChild(certaintyText);

  // Probability percentage
  const probabilityPercentage = document.createElement('div');
  probabilityPercentage.className = 'percentage';
  probabilityPercentage.innerText = (maxProbabilityClass.probability * 100).toFixed(2) + "%";
  maxProbElement.appendChild(probabilityPercentage);
  maxProbRow.appendChild(maxProbElement);

  predictionContainer.appendChild(maxProbRow);

  predictionsElement.insertBefore(
    predictionContainer, predictionsElement.firstChild);
}


const filesElement = document.getElementById('files');
filesElement.addEventListener('change', evt => {
  let files = evt.target.files;
  // Display thumbnails & issue call to predict each image.
  for (let i = 0, f; f = files[i]; i++) {
    // Only process image files (skip non image files)
    if (!f.type.match('image.*')) {
      continue;
    }
    let reader = new FileReader();
    const idx = i;
    // Closure to capture the file information.
    reader.onload = e => {
      // Fill the image & call predict.
      let img = document.createElement('img');
      img.src = e.target.result;
      img.width = IMAGE_SIZE;
      img.height = IMAGE_SIZE;
      img.onload = () => predict(img);
    };

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
});

const demoStatusElement = document.getElementById('status');
const status = msg => demoStatusElement.innerText = msg;

const predictionsElement = document.getElementById('predictions');

const dropfieldElement = document.getElementById('foodImage');
dropfieldElement.addEventListener("dragenter", allowDrop, false);
dropfieldElement.addEventListener("dragover", allowDrop, false);
dropfieldElement.addEventListener("drop", drop, false);

mobilenetDemo();
