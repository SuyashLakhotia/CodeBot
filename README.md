# CodeBot

CodeBot is a chatbot that helps beginners learn how to code. To make the otherwise daunting task of learning how to code for the first time easier, CodeBot incorporates witty replies, GIFs &amp; human-readable errors to create an incredibly fun experience for a complete novice. Currently, it goes through a few basic exercises in Python (adapted from [Codecademy](https://www.codecademy.com/learn/python)) while answering any questions on the way. The back-end runs on Node.js, MongoDB & [api.ai](https://api.ai) while the front-end is written in vanilla HTML, CSS & JavaScript. The initial prototype for CodeBot was built during the Facebook Singapore Hackathon 2016.

![Screenshot of CodeBot](/z-Screenshots/1.png)

### Team

1. [Suyash Lakhotia](https://github.com/SuyashLakhotia)
2. [Nikhil Venkatesh](https://github.com/nikv96)
3. [Chaitanya Joshi](https://github.com/chaitjo)
4. [Bobby Ranjan](https://github.com/bbbranjan)

## Setup

### Prerequisites

- Install [Node.js & npm](https://nodejs.org/en/download/)
	- Update `npm` using `$ npm install npm -g`
- Install [MongoDB](https://docs.mongodb.com/master/installation/)
- Install [RoboMongo](https://robomongo.org/download) (Optional)

#### Homebrew Commands (for Mac)

```
$ brew install node              # Install Node.js
$ brew install mongodb           # Install MongoDB
$ brew cask install robomongo    # Install RoboMongo (Optional)
$ brew services start mongodb    # Start MongoDB
```

### Running CodeBot

1. Clone this repo or download the .zip [here](https://github.com/SuyashLakhotia/CodeBot/archive/master.zip).
2. Navigate to this repo on your terminal and run `$ npm install` to install all the dependencies.
3. Start MongoDB using the instructions [here](https://docs.mongodb.com/manual/installation/).
4. Initialize the database using `$ node dbCreator.js`.
5. Create a directory &mdash; `/userScripts` &mdash; and an empty file named `test.py` inside to process the user's submitted Python scripts.
6. Run CodeBot on `http://localhost:3000/` using `$ node index.js`.

```
$ npm install
$ brew services start mongodb    # Start MongoDB (via Homebrew)
$ node dbCreator.js
$ mkdir userScripts && cd userScripts && touch test.py && cd ..
$ node index.js
```

## Source Code
```
| - modules
|   | - codeChecker.js       // Checks User Submitted Python Code
|   | - levenshtein.js       // Word Distance Calculator (dependency of codeChecker.js)
|   | - messageHandler.js    // Handles User Messages over Chat
|   | - pythonDict.js        // Dictionary of Python Keywords (dependency of codeChecker.js)
| - node_modules             // Node.js Dependencies (see package.json)
| - public                   // Front-End Files (served at '/')
|   | - assets               // Images, GIFs, etc.
|   | - css                  // CSS Stylesheets
|   |   | - main.css
|   | - js                   // Client-Side Scripts
|   |   | - main.js
|   | - favicon.ico          // Favicon
| - userScripts              // Stores User Submitted Python Code
|   | - test.py
| - dbCreator.js             // Initializes Database
| - index.html               // Client-Side Chat Interface
| - index.js                 // Node.js Main Script
```

## TODO

- [ ] All Python Errors → Human-Readable Errors
- [ ] Refine Curriculum / Database Content
- [ ] Improve Existing Bot Replies
- [ ] Add More Variation in Bot Replies
- [ ] Make Bot Instructions for Exercises Friendlier
- [ ] Improve In-line Code Styling for Instructions & Example Code
- [x] ~~Clean Up `codeChecker.js`~~
- [x] ~~Clean Up Front-End Code~~
- [x] ~~Post-Hackathon Cleanup of Code & Git History~~
- [x] ~~Add Setup Instructions to README~~
- [x] ~~Remove Hardcoding in `nextExercise()`~~
- [x] ~~Split `index.js` into Separate Files~~
- [x] ~~Redo Database Structure~~