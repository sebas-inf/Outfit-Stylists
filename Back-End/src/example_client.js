import axios from 'axios';
import fs from 'node:fs';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 1000,
  //headers: {'X-Custom-Header': 'foobar'}
});

const photoPath = "../example_photos/";
instance.post('/user/sendarticle', {
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