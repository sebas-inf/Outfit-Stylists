import axios from 'axios';
import fs from 'node:fs';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  //timeout: 1000,
  //headers: {'X-Custom-Header': 'foobar'}
});

const photoPath = "../example_photos/";
await instance.post('/user/sendarticle', {
  username : 'FirstUser',
  wardrobeName : 'Example',
  articleData : {
    // Clothing details
    name : 'Nice Shoes',
    description : "Some nice blue converse",
    maincolor : 'blue',
    category : 'shoes', // Lowercase written category, ie 'pants'
    mainmaterial : 'Textile',
    usage : 20, // For now, provide a number between 1-100
    photo : fs.readFileSync(photoPath + 'shoes.jpg').toString('base64')
  }
})
.then(function (response) {
  console.log(response.status);
})
.catch(function (error) {
  console.log(error);
});

// Adding an outfit!
// First, get the clothes in the wardrobe:
var items = new Map();
await instance.get('/user/wardrobe')
.then(function (response) {
  response.data.forEach( (item) => {
    items[item.name] = item.id;
  });
  console.log(items);
})
.catch(function (error) {
  console.log(error);
});

// Then use specific ones in the id section:
await instance.post('/user/createoutfit', {
  username : 'FirstUser',
  wardrobeName : 'Example',
  outfitData : {
    // Outfit details
    name : 'Cool Outfit',
    description : "A really cool outfit",
    required_articles : [items['Black Pants'], items['Dark Blue Dress Shirt']],
    optional_articles : [items['Cool Hat'], items['Nice Shoes']]
  }
})
.then(function (response) {
  console.log(response.status);
})
.catch(function (error) {
  console.log(error);
});