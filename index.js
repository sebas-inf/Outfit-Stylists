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
}

