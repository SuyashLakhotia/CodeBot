# CodeBot

Created for and during the Facebook Singapore Hackathon 2016.

CodeBot is a chatbot that helps beginners learn how to code. To make the otherwise daunting task of learning how to code for the first time easier, CodeBot incorporates witty replies, GIFs &amp; human-readable errors to create an incredibly fun experience for a complete novice. Currently, it goes through a few basic exercises in Python (adapted from [Codecademy](https://www.codecademy.com/learn/python)) while answering any questions on the way. The back-end runs on Node.js, MongoDB & [api.ai](https://api.ai) while the front-end is written in vanilla HTML, CSS & JavaScript.

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

## TODO

- [ ] Post-Hackathon Cleanup of Code & Git History
- [x] ~~Add Setup Instructions to README~~
- [ ] Refine Curriculum / Database Content
- [ ] Comment Out Debug Statements on Node Server
- [ ] Split `index.js` into Separate Files
- [ ] Improve Existing Bot Replies
- [ ] Add More Variation in Bot Replies
- [ ] Make Bot Instructions for Exercises Friendlier
- [ ] Improve In-line Code Styling for Instructions & Example Code
- [ ] Remove Hardcoding in `nextExercise()`
