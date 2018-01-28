## Inspiration
The worst feeling is going to a grocery store to look for an ingredient just to find that it isn't in stock. That's why I made Recipe Wingman, so I know exactly when my grocery store has my favorite mango flavored Arizona Iced Teas.

## What it does
Recipe Wingman is smart enough to read the ingredients list of nearly any recipe and search Wegmans grocery stores for the item. Recipe Wingman is able to determine the actual ingredient names from measurements and instructions. Recipe Wingman will also list prices, calculate tax, and tell you if other Wegmans locations have the item in stock.

![Context Menu!](https://i.imgur.com/7rHgxc1.jpg)

## How I built it
Recipe Wingman is a Google Chrome extension which is built with HTML, CSS, and a lot of Javascript. Recipe Wingman is self contained so it can theoretically operate on any web page. Recipe Wingman does not use any third-party Javascript library, making it very lightweight! Recipe Wingman also uses a server in order to communicate with the Google Cloud Platform and Wegmans API; that way the private keys are kept safe. The server is written in Python 3.6 using Flask.

## Challenges I ran into
I initially wanted to write the application using Typescript and create a web application. However, that proved to be challenging as I couldn't get past some technical hurdles with getting the Google Cloud Platform to work on Typescript.
Additionally, the Wegmans API is pretty new so there are no examples to look at online. Thankfully, the people at the Wegmans table helped out with setting up a connection to the API.

![Recipe Wingman!](http://i.imgur.com/lbtu53V.png)

## Accomplishments that I'm proud of
I am very proud of getting the Natural Language API to work and figuring out how to utilize it to list the ingredients of a recipe. Additionally, I was really happy to learn how to make proper GET and POST requests without having to use additional abstraction layers. Lastly, I'm glad I was able to create a UI that doesn't make me sick.

## What I learned
I give Javascript a lot of flak, but I actually didn't have a horrible time using Javascript for this project. It let me create a project in a very short amount of time.

## What's next for Recipe Wingman
There are a lot of features I had to leave out due to API constraints and mostly, my own ability. I would love to continue to work on Recipe Wingman in the future.
