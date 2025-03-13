# Before you run...
- Install Mongodb Community Ed. on your computer, preferably with Compass for ease of viewing, but you can also use the Mongodb plugin in vscode
- Run mongod.exe from your install in program files with the --dbpath parameter set to the sample_database folder path
    - This runs a local database connection with the data right inside the project.

# Adding Clothing items
To add a piece of clothing, you must provide a post request with the following to route '/user/sendarticle':
- userLoginID : String
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

# Showing clothing items
For right now, the route '/user/wardrobe/showexample'
will, after running the database locally, create 5 items under a username 'FirstUser' with a wardrobe, 'Example',
and will provide json with the following details for each item:
{
    id : string
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

# Resetting the database to starting examples
If you connect to locahost:port/reset, the database will be reset to the default examples for you!

# Adding an outfit
Direct a post request to route /user/createoutfit
the json should be formatted as an array of 
- userLoginID : String
- wardrobeName : String
- outfitData : {
    // Outfit details
    - name : String
    - description : String
    - required_articles : { String \\ object id }
    - optional_articles : { String \\ object id}
    \\ object ids provided from the id property in the returned json of the wardrobe
}
Another example is in example_client.js
# Seeing a list of outfits
Send a get request to '/user/wardrobe/outfits/'
If an outfit is loaded, you will get the above described properties along with an id property.


