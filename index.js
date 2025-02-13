// getting-started.js from mongoose.js at https://mongoosejs.com/docs/index.html
import { connect, Schema, model } from 'mongoose';

main().catch(err => console.log(err));

async function main() {
  await connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

    const kittySchema = new Schema( {name: String},
        {
            methods: {
                speak() {
                    const greeting = this.name
                        ? 'Meow name is ' + this.name
                        : 'I don\'t have a name';
                    console.log(greeting);
                    if (this.name.includes("terrible"))
                        console.log("Squeak!!!");
                }
            }
        }
    
    );

    const Kitten = model('Kitten', kittySchema);

    const fluffy = new Kitten({ name: 'fluffy' });

    await fluffy.save();
    fluffy.speak();

    const kittens = await Kitten.find();
    console.log("kittens found:");
    console.log(kittens);

    const terrible = new Kitten({ name: 'terrible the cutest' });

    await terrible.save();
    console.log("Finding Terrible the Kitten...");
    const x = await Kitten.find({ name: /^terrible/ });
    console.log("Kitty found!");
    console.log(x);

    terrible.speak();

    // Beta database construction
    // Not sure if there's a better way to do
    // tables that just connect other tables in Mongoose yet...

    // Schemas are automatically given an _id property in Mongoose.
    const userSchema = new Schema(
        {
            username : String,
            wardrobeid : Number // Or perhaps connect this to a wardrobe table 
                                // For multi-wardrobe support
        }
    )

    // If we want multi-wardrobe support... create a table for all users with this
    const userToWardrobeSchema = new Schema({
        userid : Number,
        wardrobeid : Number
    })

    const wardrobeSchema = new Schema({
        userid : Number,
        cat_pantsid : Number,
        cat_shirtsid : Number,
        cat_shoesid : Number,
        cat_hatsid : Number,
        cat_additionalsid : Number // Make this another table to store addtional categories 
                                   // that then connects to those tables of articles
    })

    const articleSchema = new Schema({
        wardrobeid : Number,
        name : String,
        mainmaterial : String,
        maincolor : String,
        usage : Number,
        photo : String // We need to use GridFS to store this, need to research
                       // Here's starter info on this: https://www.mongodb.com/docs/manual/core/gridfs/
    })



}

