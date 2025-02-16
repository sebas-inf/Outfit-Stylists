import mongoose, { SchemaType, SchemaTypes } from 'mongoose';
import { connect, Schema, model } from 'mongoose';
import fs from 'node:fs';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.use('/connect', (req, res, next) => {
    res.send('connecting...');
    connectToDB();
    dropDB();
    setUpDB().catch(err => console.log(err));
    next();
})

app.get('/user/wardrobe', async (req, res, next) => {
    connectToDB();
    setUpDB().catch(err => console.log(err));
    const wardrobe = await findWardrobe();
    res.json(wardrobe);
    next();
});

app.get('/user/wardrobe/showexample', async (req, res, next) => {
    connectToDB();
    setUpDB().catch(err => console.log(err));
    const wardrobe = await findWardrobe();
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<img style="width: 200px" src="data:image/png;base64,' +
    wardrobe[0].photo + '"'
    +' alt="Photo of a piece of clothing" />'));
    next();
});

var dbSet = false;

const articleSchema = new Schema({
    wardrobeID : mongoose.ObjectId,
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

const outfitSchema = new Schema({
    articleID : mongoose.ObjectId,
    centerpiece : Boolean
}).set('toJSON', { virtuals: true });

// Schema for wardrobes
const wardrobeSchema = new Schema({
    userID : { type: Schema.Types.ObjectId, ref: 'User' },
    articleTable : [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    outfitTable : [{ type: Schema.Types.ObjectId, ref: 'Outfit' }]
}).set('toJSON', { virtuals: true });

// Schema for a user
const userSchema = new Schema(
    {
        username : String,
        userFirstName : String,
        userLastName : String,
        wardrobeCollection : [[{ type: Schema.Types.ObjectId, ref: 'Wardrobe' }]] 
    }
).set('toJSON', { virtuals: true });

// Schema for a list of users
const userListSchema = new Schema({
    users : [[{ type: Schema.Types.ObjectId, ref: 'User' }]]
}).set('toJSON', { virtuals: true });

const User = model('User', userSchema);
const Wardrobe = model('Wardrobe', wardrobeSchema);
const Article = model('Article', articleSchema);

async function connectToDB() {
    await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9');
}


async function setUpDB() {
    const foundUser = await User.exists({});
    if (!foundUser) {

        const usr = new User({ 
            username: 'FirstUser', 
            userFirstName: "John", 
            userLastName: "Doe", 
        });
        const war = new Wardrobe({ userID: usr._id });
        usr.wardrobeCollection.push(war._id);

        var infoObj = [
        {
            wardrobeID : war._id,
            name : "Cargo Pants",
            description : 'A set of beige cargo pants',
            category : "pants",
            mainmaterial : "Cotton",
            maincolor : "Beige",
            usage : Math.floor(Math.random() * 100),
            photo : fs.readFileSync('./example_photos/pants.jpeg').toString('base64')
        },

        {
            wardrobeID : war._id,
            name : "Cool Hat",
            description : 'A black fedora',
            category : "hat",
            mainmaterial : "Unknown",
            maincolor : "Black",
            usage : Math.floor(Math.random() * 100),
            photo : fs.readFileSync('./example_photos/hat.jpg').toString('base64')
        },

        {
            wardrobeID : war._id,
            name : "Black Pants",
            description : 'A pair of black joggers',
            category : "pants",
            mainmaterial : "Synthetic",
            maincolor : "Black",
            usage : Math.floor(Math.random() * 100),
            photo : fs.readFileSync('./example_photos/pants1.jpeg').toString('base64')
        },

        {
            wardrobeID : war._id,
            name : "Blue Shoes",
            description : 'A pair of blue sneakers',
            category : "shoes",
            mainmaterial : "Synthetic",
            maincolor : "Blue",
            usage : Math.floor(Math.random() * 100),
            photo : fs.readFileSync('./example_photos/shoes1.jpg').toString('base64')
        },

        {
            wardrobeID : war._id,
            name : "Dark Blue Dress Shirt",
            description : 'A button up shirt',
            category : "shirt",
            mainmaterial : "Cotton",
            maincolor : "Dark Blue",
            usage : Math.floor(Math.random() * 100),
            photo : fs.readFileSync('./example_photos/shirt.jpg').toString('base64')
        },

        {
            wardrobeID : war._id,
            name : "Running Shorts",
            description : 'Light blue shorts',
            category : "pants",
            mainmaterial : "Cotton",
            maincolor : "Light Blue",
            usage : Math.floor(Math.random() * 100),
            photo : fs.readFileSync('./example_photos/shorts.jpg').toString('base64')
        }
        ]

        var articleArray = [];
        infoObj.forEach((info) => {
        articleArray.push(new Article(info));
        war.articleTable.push(articleArray.at(-1)._id);        
        });

        //console.log(war.articleTable);

        Article.collection.insertMany(articleArray);
        usr.save();
        war.save();
        dbSet = !dbSet;
    }
    
    
}

async function findWardrobe() {
    const foundUser = await User.findOne({});
    const foundWardrobe = await Wardrobe.findById(foundUser.wardrobeCollection[0]).exec();
    const foundItems = await Article.find({wardrobeID : foundWardrobe._id}).lean().exec();

    return foundItems;
}


