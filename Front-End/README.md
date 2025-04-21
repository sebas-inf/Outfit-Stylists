# How to Run the Outfit Suggestion Tests

Hey! If you wanna run the tests for the `OutfitSuggestion.jsx` thingy, here's how.

## Stuff You Need First

*   Make sure you have Node.js installed on your computer. You can get it from the node website.
*   You also need npm (it comes with Node) or maybe yarn if you use that.

## Specific Code Stuff Needed (Dependencies)

The `npm install` command installs everything listed in `package.json`. For the tests specifically (`OutfitSuggestion.test.jsx`), the important ones are in `devDependencies` in that file:

*   `vitest`: This is the main thing that runs the tests.
*   `@testing-library/react`: Helps test React components, like checking if stuff appears on the screen.
*   `@testing-library/jest-dom`: Adds extra checks for testing things in the HTML (like if an element is visible). Works with vitest too!
*   `@testing-library/user-event`: Lets the tests pretend to be a user clicking buttons and typing stuff.
*   `jsdom`: Creates a fake web browser environment so the tests can run without opening a real browser.

You don't usually install these one-by-one, `npm install` gets them all based on the `package.json` file when you run it in the `Outfit-Stylists/Front-End` folder. Just make sure that file is copied to the other machine too!

## Get Ready

1.  Open your terminal (like Command Prompt or Terminal app).
2.  Go into the `Outfit-Stylists/Front-End` folder. Like `cd path/to/Outfit-Stylists/Front-End`.
3.  Run `npm install`. This downloads all the code stuff we need (it reads the `package.json` file). It might take a minute.

## Run the Tests!

*   Make sure you're still in the `Outfit-Stylists/Front-End` folder in your terminal.
*   Type `npm test` and press Enter.
*   This will run *all* the tests in the project, including the `OutfitSuggestion.test.jsx` one. You'll see some output saying if they passed or failed.

*   If you *only* want to run the Outfit Suggestion test, you can try this (might work?):
    `npm test src/components/OutfitSuggestion.test.jsx`

That's it! Hope it works. 
