import mongoose, {Schema, model } from 'mongoose';

// Setup Schemata
export const ObjID = Schema.Types.ObjectId;
// Article of clothing
export const articleSchema = new Schema({
    wardrobeID : {type: ObjID, required : true },
    name : {type: String, required : true },
    description : String,
    category : {type: String, required : true },
    mainmaterial : {type: String, required : true },
    maincolor : {type: String, required : true },
    usage : Number,
    photo : {type: String, required : true },
}).set('toJSON', { virtuals: true });

// Store a list of ids of clothing
export const outfitSchema = new Schema({
    name : {type: String, required : true },
    description : String,
    wardrobeID : {type: ObjID, required : true },
    required_articles : {
        type: [{ type: ObjID, ref: 'Article' }],
        validate: [(array)=> {
            return array.length >= 2;
        }, "There must be two or more required articles!"]
    },
    optional_articles : [{ type: ObjID, ref: 'Article' }]
}).set('toJSON', { virtuals: true });

// Schema for wardrobes
export const wardrobeSchema = new Schema({
    userID : { type: ObjID, ref: 'User' },
    name : String,
    articleTable : [{ type: ObjID, ref: 'Article' }],
    outfitTable : [{ type: ObjID, ref: 'Outfit' }]
}).set('toJSON', { virtuals: true });

// Schema for a user
export const userSchema = new Schema({
    username : String,
    loginid : {type: String, required : true },
    email : {type: String, required : true },
    createdate : Date,
    profilepicURL : String,
    wardrobeCollection : [{ type: ObjID, ref: 'Wardrobe' }] 
}).set('toJSON', { virtuals: true });


// Models
export const User = model('User', userSchema);
export const Wardrobe = model('Wardrobe', wardrobeSchema);
export const Article = model('Article', articleSchema);
export const Outfit = model('Outfit', outfitSchema);