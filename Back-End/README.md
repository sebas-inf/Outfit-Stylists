Before you run...
- Install Mongodb Community Ed. on your computer, preferably with Compass for ease of viewing, but you can also use the Mongodb plugin in vscode
- Run mongod.exe from your install in program files with the --dbpath parameter set to the sample_database folder path
    - This runs a local database connection with the data right inside the project.

To add a piece of clothing, you must provide a post request with the following to route '/user/sendarticle':
- username : String
- wardrobeName : String
- articleData : {
    // Clothing details
    - name : String
    - maincolor : String
    - description : String
    - category : String // Lowercase written category, ie 'pants'
    - mainmaterial : String
    - usage : Number // For now
    - photo : Base-64 encoded String of the image }
An example with axios is written in 'example_client.js'
For right now, names of objects must be unique, ie the database will not add an article with the same name as another.

For right now, the route '/user/wardrobe/showexample'
will, after running the database locally, create 5 items under a username 'FirstUser' with a wardrobe, 'Example',
and will provide json with the following details for each item:
{
    name : string
    description : string
    category : string
    mainmaterial : string
    maincolor : string
    usage : number // for now
    username : string
    wardrobeName : string
}

If you run the example insertion script, you will be able to see your added piece of clothing
within the example user's wardrobe.
