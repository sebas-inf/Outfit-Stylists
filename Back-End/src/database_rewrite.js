import mongoose, { SchemaType, SchemaTypes } from 'mongoose';
import { connect, Schema, model } from 'mongoose';
import fs from 'node:fs';
import cors from 'cors';
import express from 'express';

// Set up expresss app and routes
const app = express();
app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
    res.send('Root')
})
  
// Listen message
app.listen(port, () => {
console.log(`Listening on localhost:${port}`)
})

// Just connect and set up an example database
app.use('/connect', async (req, res) => {
    res.send('connecting...');
    await connectToDB();
    await setUpTestDB().catch(err => console.log(err));
})

// Setup plus return the sample user's wardrobe
app.get('/user/wardrobe', async (req, res) => {
    await connectToDB();
    await setUpTestDB().catch(err => console.log(err));
    const wardrobe = await findItemsInWardrobe();
    res.json(wardrobe);
});

// Setup, return the sample user's wardrobe, use that to display the base64 encoded image.
app.get('/user/wardrobe/showexample', async (req, res) => {
    await connectToDB();
    await setUpTestDB().catch(err => console.log(err));
    const wardrobe = await findItemsInWardrobe();
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<img style="width: 200px" src="data:image/png;base64,' +
    wardrobe[0].photo + '"'
    +' alt="Photo of a piece of clothing" />'));
});

// Setup Schemata
const ObjID = Schema.Types.ObjectId;
// Article of clothing
const articleSchema = new Schema({
    wardrobeID : ObjID,
    name : String,
    description : String,
    category : String,
    mainmaterial : String,
    maincolor : String,
    usage : Number,
    photo : String 
                   // In the future, probably need to use GridFS to store this, need to research
                   // Here's starter info on this: https://www.mongodb.com/docs/manual/core/gridfs/
                   // Using this so answer's guidance https://stackoverflow.com/a/47190772
}).set('toJSON', { virtuals: true });

// Store a list of ids of clothing
const outfitSchema = new Schema({
    articleTable : [{ type: ObjID, ref: 'Article' }],
    optionals : [{ type: ObjID, ref: 'Article' }]
}).set('toJSON', { virtuals: true });

// Schema for wardrobes
const wardrobeSchema = new Schema({
    userID : { type: ObjID, ref: 'User' },
    name : String,
    articleTable : [{ type: ObjID, ref: 'Article' }],
    outfitTable : [{ type: ObjID, ref: 'Outfit' }]
}).set('toJSON', { virtuals: true });

// Schema for a user
const userSchema = new Schema({
    username : String,
    userMetadata : ObjID,
    wardrobeCollection : [{ type: ObjID, ref: 'Wardrobe' }] 
}).set('toJSON', { virtuals: true });

// For future metadata
const userMetadataSchema = new Schema({
    firstName : String,
    lastName : String
}).set('toJSON', { virtuals: true });

// Models
const User = model('User', userSchema);
const UserMData = model('UserMData', userMetadataSchema);
const Wardrobe = model('Wardrobe', wardrobeSchema);
const Article = model('Article', articleSchema);

async function connectToDB() {
    await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9');
}

// set up a databse with a test user, wardrobe, etc.
async function setUpTestDB() {
    const foundUser = await User.exists({});
    if (!foundUser) {

        const usr = new User({ 
            username: 'FirstUser', 
            userFirstName: "John", 
            userLastName: "Doe", 
        });
        const war = new Wardrobe({ userID: usr._id, name: "Example" });
        usr.wardrobeCollection.push(war._id);

        const photoPath = "../example_photos/"
        var infoObj = [
            {
                wardrobeID : war._id,
                name : "Cargo Pants",
                description : 'A set of beige cargo pants',
                category : "pants",
                mainmaterial : "Cotton",
                maincolor : "Beige",
                usage : Math.floor(Math.random() * 100),
                photo : fs.readFileSync(photoPath + 'pants.jpeg').toString('base64')
            },
    
            {
                wardrobeID : war._id,
                name : "Cool Hat",
                description : 'A black fedora',
                category : "hat",
                mainmaterial : "Unknown",
                maincolor : "Black",
                usage : Math.floor(Math.random() * 100),
                photo : fs.readFileSync(photoPath + 'hat.jpg').toString('base64')
            },
    
            {
                wardrobeID : war._id,
                name : "Black Pants",
                description : 'A pair of black joggers',
                category : "pants",
                mainmaterial : "Synthetic",
                maincolor : "Black",
                usage : Math.floor(Math.random() * 100),
                photo : fs.readFileSync(photoPath + 'pants1.jpeg').toString('base64')
            },
    
            {
                wardrobeID : war._id,
                name : "Blue Shoes",
                description : 'A pair of blue sneakers',
                category : "shoes",
                mainmaterial : "Synthetic",
                maincolor : "Blue",
                usage : Math.floor(Math.random() * 100),
                photo : fs.readFileSync(photoPath + 'shoes1.jpg').toString('base64')
            },
    
            {
                wardrobeID : war._id,
                name : "Dark Blue Dress Shirt",
                description : 'A button up shirt',
                category : "shirt",
                mainmaterial : "Cotton",
                maincolor : "Dark Blue",
                usage : Math.floor(Math.random() * 100),
                photo : fs.readFileSync(photoPath + 'shirt.jpg').toString('base64')
            },
    
            {
                wardrobeID : war._id,
                name : "Running Shorts",
                description : 'Light blue shorts',
                category : "pants",
                mainmaterial : "Cotton",
                maincolor : "Light Blue",
                usage : Math.floor(Math.random() * 100),
                photo : fs.readFileSync(photoPath + 'shorts.jpg').toString('base64')
            }
        ]

        var articleArray = [];
        infoObj.forEach((info) => {
        articleArray.push(new Article(info));
        war.articleTable.push(articleArray.at(-1)._id);        
        });

        articleArray.forEach(async (article) => await article.save());
        await usr.save();
        await war.save();

    }
}

async function findItemsInWardrobe() {
    const foundUser = await User.findOne({});
    const foundWardrobe = await Wardrobe.findById(foundUser.wardrobeCollection[0]).exec();
    const foundItems = await Article.find({wardrobeID : foundWardrobe._id}).lean().exec();

    return foundItems;
}

async function insertNewArticle(userID, wardrobeName, articleInfo) {
    const foundUser = await User.findById(userID);
    const foundWardrobe = await Wardrobe.find({
         userID: foundUser.wardrobeCollection[0], 
         name : wardrobeName
        }).exec();
    articleInfo['wardrobeID'] = foundWardrobe._id;
    const newArt = await new Article(articleInfo).save();
}

