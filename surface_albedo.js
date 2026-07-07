// Define the region of interest
var table3 = ee.FeatureCollection("projects/ee-maminrahimi77/assets/tehrancity");

// Function to calculate Albedo for a given image and bands
function calculateAlbedo(image, bands, coefficients) {
  var albedo = ee.Image(0);
  
  // Loop through each band and apply the coefficient
  for (var i = 0; i < bands.length; i++) {
    albedo = albedo.add(image.select(bands[i]).multiply(coefficients[i]));
  }
  
  // Return the albedo as a new band
  return albedo.rename('Albedo');
}

// Function to calculate and visualize Albedo for a given Landsat image
function calculateAndVisualizeAlbedo(image, bands, coefficients, layerName, minAlbedo, maxAlbedo) {
  var albedo = calculateAlbedo(image, bands, coefficients);
  
  // Check if albedo has any data
  var albedoStats = albedo.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: table3,
    scale: 30,
    maxPixels: 1e13
  });

  print(layerName + ' Albedo Stats:', albedoStats);

  // Visualize with a color scheme
  Map.addLayer(albedo, {min: minAlbedo, max: maxAlbedo, palette: ['blue', 'green', 'yellow', 'red']}, layerName);
  
  return albedo;
}

// Landsat 5 Albedo (1986)
var L5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA')
  .filterDate('1986-06-01', '1986-09-28')
  .filterBounds(table3)
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .first()
  .clip(table3);

print('Landsat 5 Image:', L5); // Check if the image is loaded correctly

var L5_Albedo = calculateAndVisualizeAlbedo(
  L5, 
  ['B1', 'B2', 'B3', 'B4', 'B5', 'B7'], 
  [0.036, 0.103, 0.311, 0.147, 0.149, 0.254],
  'Albedo - Landsat 5',
  0, 0.3 // Set appropriate min and max values for visualization
);

// Landsat 7 Albedo (2000)
var L7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA')
  .filterDate('2000-07-17', '2000-07-20')
  .filterBounds(table3)
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .first()
  .clip(table3);

print('Landsat 7 Image:', L7); // Check if the image is loaded correctly

var L7_Albedo = calculateAndVisualizeAlbedo(
  L7, 
  ['B1', 'B2', 'B3', 'B4', 'B5', 'B7'], 
  [0.036, 0.103, 0.311, 0.147, 0.149, 0.254], 
  'Albedo - Landsat 7',
  0, 0.3 // Set appropriate min and max values for visualization
);

// Landsat 8 Albedo (2014)
var L8_1 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(table3)
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .filterDate('2014-08-01', '2014-08-05')
  .first()
  .clip(table3);

print('Landsat 8 Image (2014):', L8_1); // Check if the image is loaded correctly

var L8_1_Albedo = calculateAndVisualizeAlbedo(
  L8_1, 
  ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'], 
  [0.036, 0.103, 0.311, 0.147, 0.149, 0.254], 
  'Albedo - Landsat 8 (2014)',
  0, 0.3 // Set appropriate min and max values for visualization
);

// Landsat 8 Albedo (2023)
var L8_2 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(table3)
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .filterDate('2023-07-01', '2023-08-30')
  .first()
  .clip(table3);

print('Landsat 8 Image (2023):', L8_2); // Check if the image is loaded correctly

var L8_2_Albedo = calculateAndVisualizeAlbedo(
  L8_2, 
  ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'], 
  [0.036, 0.103, 0.311, 0.147, 0.149, 0.254], 
  'Albedo - Landsat 8 (2023)',
  0, 0.3 // Set appropriate min and max values for visualization
);

// Center map on the region of interest
Map.centerObject(table3, 10);
