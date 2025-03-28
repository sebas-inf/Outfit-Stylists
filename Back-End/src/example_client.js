import axios from 'axios';
import fs from 'node:fs';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true
});

const testuserid = "testuserid0000";
const photoPath = "../example_photos/";

if (!process.argv[2]) {
  await instance.post('/user/sendarticle', {
    userLoginID : testuserid,
    wardrobeName : 'Example',
    data : {
      // Clothing details
      name : 'Nice Shoes',
      description : "Some nice blue converse",
      maincolor : 'blue',
      category : 'shoes', // Lowercase written category, ie 'pants'
      mainmaterial : 'Textile',
      usage : 20, // For now, provide a number between 1-100
      photo : fs.readFileSync(photoPath + 'shoes.jpg').toString('base64')
    }
  }, {withCredentials: true})
  .then(function (response) {
    console.log(response.status);
  })
  .catch(function (error) {
    console.log(error);
  });

  // Adding an outfit!
  // First, get the clothes in the wardrobe:
  var items = new Map();
  await instance.get('/user/wardrobe', {withCredentials: true})
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
    userLoginID : testuserid,
    wardrobeName : 'Example',
    data : {
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

} else {
  await instance.post('/user/sendarticle', {
    data : {
      // Clothing details
      name : 'Awesome Shirt ' + Math.floor(300*Math.random()),
      description : "Black Shirt with a logo on it",
      maincolor : 'black',
      category : 'shirt', // Lowercase written category, ie 'pants'
      mainmaterial : 'Cotton',
      usage : 46, // For now, provide a number between 1-100
      photo : fs.readFileSync(photoPath + 'shirt2.jpg').toString('base64')
    }
  }, {withCredentials: true}) // This is just trying to get sessions to work
  .then(function (response) {
    console.log(response.status);
  })
  .catch(function (error) {
    console.log(error);
  });
}