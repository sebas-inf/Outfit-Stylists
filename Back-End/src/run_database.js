import mongoose, { SchemaType, SchemaTypes } from 'mongoose';
import { connect, Schema, model } from 'mongoose';
import fs from 'node:fs';
import cors from 'cors';
import express from 'express';

// Set up expresss app and routes
const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
const port = 3000;

// Set up connection
const db = await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9');

app.get('/', (req, res) => {
    res.send('Root')
})
  
// Listen message
app.listen(port, () => {
console.log(`Listening on localhost:${port}`)
})

// Just connect and set up an example database
app.use('/connect', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await setUpTestDB().catch(err => console.log(err));
})

app.use('/reset', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await resetDB();
    await setUpTestDB().catch(err => console.log(err));
    res.send('reset!');
})

// Setup plus return the sample user's wardrobe
app.get('/user/wardrobe', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await setUpTestDB().catch(err => console.log(err));
    const wardrobe = await findItemsInWardrobe();
    res.json(wardrobe);
});

// Setup, return the sample user's wardrobe, use that to display the base64 encoded image.
app.get('/user/wardrobe/showexample', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await setUpTestDB().catch(err => console.log(err));
    const wardrobe = await findItemsInWardrobe();
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<img style="width: 200px" src="data:image/png;base64,' +
    wardrobe[1].photo + '"'
    +' alt="Photo of a piece of clothing" />'));
});

app.post('/user/sendarticle', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await setUpTestDB().catch(err => console.log(err));
    res.send('Article information recieved!')
    console.log("recieved!")
    insertNewArticle(req.body.username,req.body.wardrobeName, req.body.articleData);
});

app.post('/user/createoutfit', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await setUpTestDB().catch(err => console.log(err));
    const outfit = insertNewOutfit(req.body.username, req.body.wardrobeName, req.body.outfitData);
    res.send(outfit);
});

app.get('/user/wardrobe/outfits', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await setUpTestDB().catch(err => console.log(err));
    const outfits = await Outfit.find({}).exec();
    delete outfits['_id'];
    res.json(outfits);
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
    name : String,
    description : String,
    wardrobeID : ObjID,
    required_articles : {
        type: [{ type: ObjID, ref: 'Article' }],
        validate: [(array)=> {
            return array.length >= 2;
        }, "There must be two or more required articles!"]
    },
    optional_articles : [{ type: ObjID, ref: 'Article' }]
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
const Outfit = model('Outfit', outfitSchema);

async function resetDB() {
    await mongoose.connection.dropDatabase();
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

        const photoPath = "../example_photos/";
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
            },

            {
                wardrobeID: war._id,
                name: "Red Scarf",
                description: 'A red cozy scarf',
                category: "scarf",
                mainmaterial: "Cotton",
                maincolor: "Red",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'scarf1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Outdoor Sport Socks",
                description: 'A pair of white sports socks suits for outdoor activities',
                category: "socks",
                mainmaterial: "Synthetic",
                maincolor: "White",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'sock1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Peaked Cap",
                description: 'A hat that can be wear in leisure',
                category: "hat",
                mainmaterial: "Synthetic",
                maincolor: "Brown",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'hat2.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Heart Necklace",
                description: 'A cute heart like necklace',
                category: "jewelry",
                mainmaterial: "Gold",
                maincolor: "Gold",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'jewelry1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Women's Bracelet",
                description: 'A fancy silver bracelet suitable for women',
                category: "jewelry",
                mainmaterial: "Silver",
                maincolor: "Silver",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'jewelry2.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Fancy hoody",
                description: 'A cozy blue hoody suits for the sports',
                category: "hoody",
                mainmaterial: "Cotton",
                maincolor: "Blue",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'hoody1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Black jacket",
                description: 'A fashion jacket can be weard in winter',
                category: "jacket",
                mainmaterial: "Synthetic",
                maincolor: "Black",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'jacket1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Grey sweater",
                description: 'A sweater can be weard in winter',
                category: "sweater",
                mainmaterial: "Cotton",
                maincolor: "Grey",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'sweater1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Sports singlet",
                description: 'A singlet for running activities',
                category: "singlet",
                mainmaterial: "Synthetic",
                maincolor: "Green",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'singlet1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Fashion blouse",
                description: 'A fashion blouse for daily activities',
                category: "blouse",
                mainmaterial: "Cotton",
                maincolor: "Brown",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'blouse1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Fashion jeans",
                description: 'A jeans can be weared in casual',
                category: "jeans",
                mainmaterial: "Synthetic",
                maincolor: "Blue",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'jeans1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Fashion jeans",
                description: 'A jeans can be weared in casual',
                category: "jeans",
                mainmaterial: "Synthetic",
                maincolor: "Blue",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'jeans1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "sport legging",
                description: 'A sport legging can be used in yoga activities',
                category: "legging",
                mainmaterial: "Synthetic",
                maincolor: "Black",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'legging1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "red skirt",
                description: 'A red skirt weard in casual',
                category: "skirt",
                mainmaterial: "Synthetic",
                maincolor: "Red",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'skirt1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "black belt",
                description: 'A belt can be weard in formal places',
                category: "belt",
                mainmaterial: "Leather",
                maincolor: "Black",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'belt1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "blue suit",
                description: 'A fashion suit can be weard in formal places',
                category: "suit",
                mainmaterial: "fabric",
                maincolor: "Blue",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'suit1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Trench coat",
                description: 'A trench coat can be weard in casual places',
                category: "coat",
                mainmaterial: "Synthetic",
                maincolor: "Yellow",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'coat1.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Down jacket",
                description: 'A dark blue down jacket for winter season',
                category: "jacket",
                mainmaterial: "Synthetic",
                maincolor: "Dark blue",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'jacket2.png').toString('base64')
            },
            {
                wardrobeID: war._id,
                name: "Sunflower Earrings",
                description: 'A pair of sunflower earrings',
                category: "jewelry",
                mainmaterial: "Gold",
                maincolor: "Gold",
                usage: Math.floor(Math.random() * 100),
                photo: fs.readFileSync(photoPath + 'jewelry3.png').toString('base64')
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
    foundItems.forEach((w) => {
        w['username'] = foundUser.username;
        w['wardrobeName'] = foundWardrobe.name;
        w['id'] = w._id;
        delete w['_id'];
        delete w['wardrobeID'];
    });

    return foundItems;
}

async function insertNewArticle(userName, wardrobeName, articleInfo) {
    if (!(await Article.exists({name : articleInfo.name}))) {
        const foundUser = await User.findOne({username : userName}).exec();
        const foundWardrobe = await Wardrobe.exists({
            userID: foundUser._id, 
            name : wardrobeName
        });
        console.log(foundWardrobe);
        articleInfo['wardrobeID'] = foundWardrobe._id;
        const newArt = await new Article(articleInfo).save();
    }
}

async function insertNewOutfit(userName, wardrobeName, outfitInfo) {
    var resultString = "1: Insertion failed - outfit already exists";
    if (!(await Outfit.exists({name : outfitInfo.name}))) {
        const foundUser = await User.findOne({username : userName}).exec();
        const foundWardrobe = await Wardrobe.exists({
            userID: foundUser._id, 
            name : wardrobeName
        });
        console.log(outfitInfo);
        outfitInfo['wardrobeID'] = foundWardrobe._id;
        await new Outfit(outfitInfo).save()
        .then(res => {resultString = "0: Successfully inserted outfit into database";})
        .catch(err => {resultString = "2: Failure to insert outfit into database.";});
    }
    console.log(resultString);
    return resultString;
}
