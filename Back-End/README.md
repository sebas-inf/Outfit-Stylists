# Before you run...
- Install Mongodb Community Ed. on your computer, preferably with Compass for ease of viewing, but you can also use the Mongodb plugin in vscode
- Run mongod.exe from your install in program files with the --dbpath parameter set to the sample_database folder path
    - This runs a local database connection with the data right inside the project.

# Looking at example_client.js
If you run it with no parameters, you will send a request to 
create a new sample article, and then a new outfit,

If you run it with one or more parameters, you run the new example request to send an article to the currently logged in user
If no users are logged in, this should just add it to the test user's wardrobe.

# Adding Clothing items
To add a piece of clothing, you must provide a post request with the following to route '/user/sendarticle':
// Changes: you can now just call the array "data" or keep it "articleData"
// Also directly uses stored logged in userid
- wardrobeName : String // Optional, default wardrobe named "My Wardrobe"
- data : {
    // Clothing details
    - name : String
    - description : String
    - category : String // Lowercase written category, ie 'pants'
    - mainmaterial : String
    - maincolor : String
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
// Changes: you can now just call the array "data" or "outfitData"
// Also directly uses stored logged in userid
the json should be formatted as an array of 
- wardrobeName : String // Optional, default wardrobe named "My Wardrobe"
- data : {
    // Outfit details
    - name : String
    - description : String
    - required_articles : { String (object id)*}
    - optional_articles : { String (object id)*}
    (*object ids provided from the id property in the returned json of the wardrobe)
}
Another example is in example_client.js

# Deletion
To delete an article or outfit, just send a request with an (id: objectid) to the '/user/deletearticle' and '/user/deleteoutfit' routes respectively.

# Updating
To update an article or outfit, simply send the changed data in a similar array to adding an item, but also include an id parameter that you get from the wardrobe get request.
The routes are '/user/updatearticle' and '/user/updateoutfit'
Be mindful that changing an outfit this way will replace the entire array rather than adding.
The json should look like so:
{
    id : id of article or outfit
    data : {
        propertytochange1 : changed value
        propertytochange2 : changed value // and so on
    }
}
## Adding or removing specific articles from an outfit
use the routes '/user/updateoutfit/additems' and '/user/updateoutfit/removeitems' to add and remove items specifically. 
the expected json is as so:
{
    id : outfit id
    optional_articles : { list of ids to add or remove }
    required_articles : { list of ids to add or remove }
}


# Seeing a list of clothes in default created wardrobe
Send a get request to '/user/wardrobe/'
Sends a json of all clothing items in "My Wardrobe" wardrobe (or "Example" wardrobe, for test user).

# Seeing a list of clothes in a specific wardrobe
Send a *POST* request to '/user/wardrobe/specific' 
with the request having one property: wardrobeName = name string 
Sends a json of all clothing items in "My Wardrobe" wardrobe.

# Seeing a list of outfits
Send a get request to '/user/wardrobe/outfits/'
If an outfit is loaded, you will get the above described properties along with an id property.


