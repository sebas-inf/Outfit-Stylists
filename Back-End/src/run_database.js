import mongoose from 'mongoose';
import fs from 'node:fs';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import {User, Wardrobe, Article, Outfit, ObjID} from './schemata.mjs';
import ConnectMongoDBSession from 'connect-mongodb-session';
const MongoDBStore = ConnectMongoDBSession(session);

// Set up connection
const db = await mongoose.connect('mongodb://127.0.0.1:27017/wardrobe');

var currentUserId = null;

// Set up expresss app and routes
const app = express();
app.use(cors({
    origin : 'http://localhost:5173'
}));
app.set("trust proxy", 1);
app.use(express.json({limit: '50mb'}));
const port = 3000;

// Use session data
const testuserid = "testuserid0000";
app.use(session({
    secret : 'wardrobe-app',
    resave: true,
    saveUninitialized : true,
    store: new MongoDBStore({
        uri: 'mongodb://127.0.0.1:27017/wardrobe',
        collection: 'sessions'
    }),
    expires: new Date(Date.now() + 3600000) // an hour
}));

app.use(async (req, res, next) => {
    console.log(req.session);
    if (mongoose.connection.readyState != 1) {
        res.send('connection closed!');
        return;
    }
    await setUpTestDB().catch(err => console.log(err));
    next();
});

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
    await resetDB();
    await setUpTestDB().catch(err => console.log(err));
    res.send('reset!');
})

// return the current user's wardrobe
app.get('/user/wardrobe', async (req, res) => {
    console.log(req.session.testvar);
    const wardrobe = await findAllInWardrobe(currentUserId, Article);
    res.json(wardrobe);
    req.session.testvar = "requested wardrobe";
});

app.post('/user/wardrobe/specific', async (req, res) => {
    const wardrobe = await findAllInWardrobe(currentUserId, Article, req.body.wardrobeName);
    res.json(wardrobe);
});

app.post('/user/wardrobe/specific/outfits', async (req, res) => {
    const wardrobe = await findAllInWardrobe(currentUserId, Outfit, req.body.wardrobeName);
    res.json(wardrobe);
});

app.post('/user/wardrobe/createnew', async (req, res) => {
    // need the new wardrobe name
    // should not create a new one if already exists.
    const usr = await User.findOne({loginid : currentUserId});
    usr.wardrobeCollection.forEach(id => {
        if (Wardrobe.exists({_id : id, name : req.body.wardrobeName})) {
            res.send("Wardrobe already exists.");
            return;
        }
    })
    
    usr.wardrobeCollection.push(createEmptyWardrobe(usr._id, req.body.wardrobeName));
    await usr.save();

    res.send("New wardrobe created!");

});

// Setup, return the sample user's wardrobe, use that to display the base64 encoded image.
app.get('/user/wardrobe/showexample', async (req, res) => {
    const wardrobe = await findAllInWardrobe(currentUserId, Article);
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<img style="width: 200px" src="data:image/png;base64,' +
    wardrobe[1].photo + '"'
    +' alt="Photo of a piece of clothing" />'));
});

// Object creation

app.post('/user/sendarticle', async (req, res) => {
    console.log(req.session.testvar);
    res.send('Article information recieved!');
    const article = await insertIntoWardrobe(currentUserId, Article, req.body.articleData ?? req.body.data, req.body.wardrobeName);
    req.session.testvar = "an article was recieved last";
});

app.post('/user/createoutfit', async (req, res) => {
    console.log(req.session.testvar)
    res.send('Outfit information recieved!');
    const outfit = await insertIntoWardrobe(currentUserId, Outfit, req.body.articleData ?? req.body.data, req.body.wardrobeName);
    req.session.testvar = "an outfit was created last";  
});

// Signups

app.post('/user/signup/emailpassword', async (req, res) => {
    /* const foundUser = await User.findOne({ loginid : req.body.loginid });
    if (!foundUser) makeUser(req.body);
    currentUserId = req.body.loginid; */

    await createUser({
        username : req.body.providerData.displayName,
        loginid : req.body.uid,
        email : req.body.email,
        profilepicURL : req.body.providerData.photoURL,
        createdate : req.body.createdAt,
    });

    currentUserId = req.body.uid;

});

app.post('/user/login/emailpassword', async (req, res) => {
    console.log("login emailpassword:\n");
    console.log(req.body);
    currentUserId = req.body.uid;
});

app.post('/user/login/google', async (req, res) => {

    console.log("create/login google\n");
    console.log(req.body);

    await createUser({
        username : req.body.providerData.displayName,
        loginid : req.body.uid,
        email : req.body.email,
        profilepicURL : req.body.providerData.photoURL,
        createdate : req.body.createdAt,
    });

    currentUserId = req.body.uid;

   /*  const foundUser = await User.findOne({ useremail : req.body.email });
    if (!foundUser) {
        makeUser(req.body);
    } else {
        foundUser.username = req.body.username;
        foundUser.email = req.body.email;
        foundUser.loginid = req.body.loginid;
        foundUser.profilepicURL = req.body.profilePicture;
        foundUser.createdate = req.body.createdAt;
        var foundWardrobe = await Wardrobe.findOne({
            userID: foundUser._id, 
        });
        if (!foundWardrobe) {
            foundWardrobe = await new Wardrobe({ userID: foundUser._id, name: "My Wardrobe" });
            foundUser.wardrobeCollection.push(foundWardrobe._id);
            await foundWardrobe.save();
        }
        await foundUser.save();
    }

    currentUserId = req.body.loginid; */
    
});

app.get('/user/whois', async (req, res) => {
    res.json(currentUserId);
});

app.get('/user/logout', async (req, res) => {
    currentUserId = null;
});

// Outfit showing

app.get('/user/wardrobe/outfits', async (req, res) => {
    res.json(await findAllInWardrobe(currentUserId, Outfit));
});


async function resetDB() {
    await mongoose.connection.dropDatabase();
}

// set up a database with a test user, wardrobe, etc.
async function setUpTestDB() {
    const foundUser = await User.exists({});
    if (!foundUser) {

        const usr = new User({ 
            username: 'John Doe',
            email: "jd@example.com",
            loginid : testuserid
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

async function createUser(userInfo) {
    const usr = await User.findOneAndUpdate(
        {email : userInfo.email},
        { 
            username: userInfo.username,
            loginid : userInfo.loginid,
            createdate : userInfo.createdAt,
            profilepicURL : userInfo.profilePicture,
        },
        {new : true}
    ) ?? new User({ 
        username: userInfo.username,
        email: userInfo.email,
        loginid : userInfo.loginid,
        createdate : userInfo.createdAt,
        profilepicURL : userInfo.profilePicture,});  

    if (usr.wardrobeCollection.length == 0) {
        const w_id = await createEmptyWardrobe(usr._id);
        console.log(w_id);
        usr.wardrobeCollection.push(w_id);
        await usr.save();
    }
}

async function createEmptyWardrobe(userID, wardrobeName = "My Wardrobe") {
    const war = new Wardrobe({ userID: userID, name: wardrobeName, articleTable : [], outfitTable : [] });
    await war.save().catch(err => console.log(err));
    return war._id;
}

async function findAllInWardrobe(userLoginID, What, wardrobeName = "My Wardrobe") {
    userLoginID = userLoginID ?? testuserid;
    wardrobeName = ((userLoginID == testuserid) ? "Example" : wardrobeName);

    const usr = await User.findOne({loginid : userLoginID});
    if (!usr) return "Error: No user by this id found!"
    const war = 
        await Wardrobe.findOne({
            userID : usr._id,
            name : wardrobeName
        }).exec()
        ?? await Wardrobe.findById(usr.wardrobeCollection[usr.wardrobeCollection.push(createEmptyWardrobe(usr._id, wardrobeName)) - 1]);
    const items = await What.find({wardrobeID : war._id}).lean().exec();
    items.forEach((i) => {
        i['userLoginID'] = usr.loginid;
        i['wardrobeName'] = war.name;
        i['id'] = i._id;
        delete i['_id'];
        delete i['wardrobeID'];
    });

    return items;

}
async function insertIntoWardrobe(userLoginID, What, itemInfo, wardrobeName = "My Wardrobe") {
    userLoginID = userLoginID ?? testuserid;
    wardrobeName = ((userLoginID == testuserid) ? "Example" : wardrobeName);

    const usr = await User.findOne({loginid : userLoginID}).exec();
    if (!usr) return "Error: No user by this id found!";

    const war = 
        await Wardrobe.findOne({
            userID : usr._id,
            name : wardrobeName
        }).exec()
        ?? await Wardrobe.findById(usr.wardrobeCollection[usr.wardrobeCollection.push(createEmptyWardrobe(usr._id, wardrobeName)) - 1]);

    itemInfo['wardrobeID'] = war._id;
    const item = await What.findOne({name : itemInfo.name, wardrobeID : war._id}) 
    ?? new What(itemInfo);
    if (item.isNew) {
        if (What == Article) war.articleTable.push(item._id);
        else if (What == Outfit) war.outfitTable.push(item._id);
        await war.save();
        await item.save();
        return "0: Successfully inserted "+ What.modelName +" into database";
    }

    return "1: "+ What.modelName +" already exists in wardrobe.";
}

async function findItemsInWardrobe(id) {
    if (!id) id = testuserid;
    const foundUser = await User.findOne({loginid : id});
    var foundWardrobe = await Wardrobe.findById(foundUser.wardrobeCollection[0]).exec();
    if (!foundWardrobe) {
        foundWardrobe = new Wardrobe({ userID: foundUser._id, name: "My Wardrobe" });
        foundUser.wardrobeCollection.push(foundWardrobe._id);
        await foundWardrobe.save();
    }
    const foundItems = await Article.find({wardrobeID : foundWardrobe._id}).lean().exec();
    foundItems.forEach((w) => {
        w['userLoginID'] = foundUser.loginid;
        w['wardrobeName'] = foundWardrobe.name;
        w['id'] = w._id;
        delete w['_id'];
        delete w['wardrobeID'];
    });

    return foundItems;
}

async function findOutfitsInWardrobe(id) {
    if (!id) id = testuserid;
    const foundUser = await User.findOne({loginid : id});
    const foundWardrobe = await Wardrobe.findById(foundUser.wardrobeCollection[0]).exec();
    if (!foundWardrobe) {
        foundWardrobe = new Wardrobe({ userID: foundUser._id, name: "My Wardrobe" });
        foundUser.wardrobeCollection.push(foundWardrobe._id);
        await foundWardrobe.save();
    }
    const foundItems = await Outfit.find({wardrobeID : foundWardrobe._id}).lean().exec();
    foundItems.forEach((w) => {
        w['userLoginID'] = foundUser.loginid;
        w['wardrobeName'] = foundWardrobe.name;
        w['id'] = w._id;
        delete w['_id'];
        delete w['wardrobeID'];
    });

    return foundItems;
}

// Potentially merge New article and New outfit insertion funcs in one,
// but leave them separate for now.
async function insertNewArticle(userLoginID, wardrobeName, articleInfo) {
    var obj = "article";
    var resultString = "1: Insertion failed - " + obj + " already exists";
    if (!(await Article.exists({name : articleInfo.name}))) {
        const foundUser = await User.findOne({loginid : userLoginID}).exec();
        var foundWardrobe = await Wardrobe.findOne({
            userID: foundUser._id, 
            name : wardrobeName
        });
        if (!foundWardrobe) {
            foundWardrobe = new Wardrobe({ userID: foundUser._id, name: wardrobeName });
            foundUser.wardrobeCollection.push(foundWardrobe._id);
            await foundWardrobe.save();
        }
        console.log(foundWardrobe);
        articleInfo['wardrobeID'] = foundWardrobe._id;
        await new Article(articleInfo).save()
        .then(async article => {
            resultString = "0: Successfully inserted "+ obj +" into database";
            if (foundWardrobe.articleTable == undefined)
            foundWardrobe.articleTable = [];
            foundWardrobe.articleTable.push(article._id);
            await foundWardrobe.save();
        })
        .catch(err => {
            console.log(err);
            resultString = "2: Failure to insert "+ obj +" into database.";
        });
    }
    return resultString;
}

async function insertNewOutfit(userLoginID, wardrobeName, outfitInfo) {
    var obj = "outfit";
    var resultString = "1: Insertion failed - "+ obj +" already exists";
    if (!(await Outfit.exists({name : outfitInfo.name}))) {
        const foundUser = await User.findOne({loginid : userLoginID}).exec();
        var foundWardrobe = await Wardrobe.findOne({
            userID: foundUser._id, 
            name : wardrobeName
        });
        const errnoitems = "3: User has no items in their wardrobe!";
        if (!foundWardrobe) {
            foundWardrobe = new Wardrobe({ userID: foundUser._id, name: wardrobeName });
            foundUser.wardrobeCollection.push(foundWardrobe._id);
            await foundWardrobe.save();
            console.log(errnoitems);
            return errnoitems;
        }
        if (!foundWardrobe.articleTable) {
            console.log(errnoitems);
            return errnoitems;
        }
        if (foundWardrobe.articleTable.length == 0) {
            console.log(errnoitems);
            return errnoitems;
        }
        
        outfitInfo['wardrobeID'] = foundWardrobe._id;
        await new Outfit(outfitInfo).save()
        .then(async outfit => {
            resultString = "0: Successfully inserted "+ obj +" into database";
            if (foundWardrobe.outfitTable == undefined)
            foundWardrobe.outfitTable = [];
            foundWardrobe.outfitTable.push(outfit._id);
            await foundWardrobe.save();
        })
        .catch(err => {
            console.log(err);
            resultString = "2: Failure to insert "+ obj +" into database.";
        });
    }
    console.log(resultString);
    return resultString;
}
