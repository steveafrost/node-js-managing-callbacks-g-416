Using the Async Library to Manage "Callback Hell"
=================================================

## Overview

In the past few lessons we learned about and then got a chance to write callbacks. As such, you are now in possession of the most basic and most ubiquitous method for managing asynchrony in JS applications. Congratulations!

However, there are a few things that we need to keep in mind when using the callback pattern. Because callbacks do have weaknesses. These weaknesses often manifest in what is referred to rather ominously as...wait for it...CALLBACK HELL!

So that is what we will focus on in this lesson: what are these problems with callbacks that lead to callback hell, and how can we deal with them. By the end of the lesson, you will be able to: 

1. Explain Callback Hell.
2. Avoid Callback Hell by using the Async library.

## Callback Hell

So what is this infamous Callback Hell? In fact, callback hell can be a difficult thing to describe despite the fact that when you encounter it you definitely know that it's, well, hellish. Nonetheless, let's get to the bottom of this phenomenon.

Generally speaking, callback hell is something that we tend to encounter when dealing with more complex execution flows that involve multiple, interrelated, asynchronous processes. In order to how this situation can arise, let's return to our original peanut butter sandwich program from the first lesson.

In that program, our algorithm gathered ingredients through two asynchronous processes: grocery shopping and bread baking. Really, though, these two processes were interrelated because how can we bake bread if we don't have the ingredients needed to make bread? Let's rethink our program taking that into account. Now that we know about callbacks, we can express that interrelatedness with some pseudocode:

```
function makePBAndJ() {
  prepareWorkSpace();
  var shoppingList = {'jam', 'peanut butter', 'flour', 'yeast', 'salt'};
  doShopping(shoppingList, function(ingredients) {
    bakeBread(ingredients, function() {
      var coolingTime = 1000 * 60 * 60 * 2;
      setTimeout(function() {
        prepareTheSandwich(ingredients, function() {
          console.log("Boom! Peanut Butter and Jelly Sandwich.")
        });
      }, coolingTime);
    });
  });
}
```

Here then we have what is called CALLBACK HELL. Are you scared?

![](http://ezmiller.s3.amazonaws.com/public/flatiron-imgs/hell.gif)

Well, regardless of your reaction let's look at what's going on here and why you might oughta be scared by this pseudocode snippet. First, let's make sure we're on the same page about the what's going on in the snippet. What we have here is a function `makePBAndJ()` that begins by calling a function to set up our PB&J workspace and creating a shopping list.

Then comes the interesting part: a nested sequence of function calls, essentially a series of callbacks within callbacks. First, we call the `doShopping` method, passing it the shopping list and a callback function that wraps the next steps. When that callback executes, it then calls another asynchronous method `bakeBread` that takes our next callback, which will be called when the bread has baked. This callback then calculates a `coolDownTime` of two hours in miliseconds and calls the JS built-in asynchronous method `setTimeout` that takes our final callback and the calculated cool down time. Finally, when our next callback is called after the cool down, the `prepareTheSandwich` method is called, taking one last callback that when the sandwich is done, outputs "Boom! Peanut Butter and Jelly Sandwich" to the console.

Slightly dizzy? No wonder. This is a rather long chain of async callbacks. The problem here, however, isn't necessarily that the process itself is complex. That may well be unavoidable, as many process are complex, and translating processes so that a computer can understand them often involves adding more complexity. The problem is that the callback pattern, which takes logic that we think of as a series of steps and instead nests that logic in this pyramid-like manner, adds to rather that reduces the complexity of our code. 

It's important to keep in mind, moreover, that what we are dealing with in our example is only a pseudocode snippet. In an actual JS application, instances of callback hell like this are less likely to be so simple. The callbacks may well be filled with long logical structures of their own, making it harder still to follow the steps of async logic. What's more code that is so hard to follow can also, especially on teams, create ripe conditions for the introduction of bugs, and it's bugs that ultimately make applications expensive and difficult to maintain.

## Managing Callback Hell

Now that you have a sense of the weaknesses of callbacks, let's talk about common practices for managing or avoiding callback hell.

The truth is that there are a variety of methods for avoiding callback hell that you are likely to encounter, and the various methods for managing asynchrony are a key domain in which Javascript and Node are developing changing. In this lesson, we will cover two of the mostly commonly used methods, which have been in use for some time now, and which therefore you will encounter frequently. Then, in the next lesson, we'll examine one of the newer patterns called Promises, which are now becoming standard to Node and Javascript.

One of the most common ways that programmers avoid callback hell involves a simple stylistic tweak of using "named" functions instead of "anonymous" functions when defining the callback. An anonymous function, as you may recall is just one without a name, e.g. `function() { // does something }`; a named function is one that has been named, e.g. `var myFunc = function() { // does something }`. 

So how does this help us avoid callback hell? Well, declaring named functions allows us to extract the logic out of the nested pyramid of callbacks. An example will make the difference clear. Taking our previous example of the PB&J program, we can rewrite the above code like so:

```
var bakeBreadCallback = function() {
  var coolingTime = 1000 * 60 * 60 * 2;
  setTimeout(function() {
    prepareTheSandwich(ingredients, function() {
      console.log("Boom! Peanut Butter and Jelly Sandwich.")
    });
  }, coolingTime);
};

var doShoppingCallback = function(ingredients) {
  bakeBread(ingredients, bakeBreadCallback)
};

function makePBAndJ() {
  prepareWorkSpace();
  var shoppingList = {'jam', 'peanut butter', 'flour', 'yeast', 'salt'};
  doShoping(shoppingList, doShoppingCallback);
}
```

What we've done here is define a series of named callback functions -- `bakeBreadCallback` and `doShoppingCallback` -- and supplied those named functions to the corresponding function in our PB&J program API. You might ask if this is really an improvement, and if so, you'd be right?

In many respects, this code is not really all that better. It is still rather laborious to read. In order to read what's going on here we'd need to see that the top level function is `makePBAndJ()`. Then we'd start to see that the `doShoppingCallback` function calls `bakeBread`, which in turn calls the `bakeBreadCallback`. It's still pretty confusing!

That said, there are some improvements here. One advantage gained here is that we aren't any longer dealing with the complex nesting of anonymous functions. This is good because our brains don't have to interpret all that indentation. Plus, the different sets of program logic within each callback are now nicely separated into their own blocks, complete with named functions that will help someone who looks at the code later know what that particular callback does.

So while certainly not a huge improvement, this stylistic shift does have some advantages and can be particularly useful if our callback contains a lot of code. It's not a bad trick to have in our tool set, especially because it's an approach that we are very likely to see in legacy code.

## Managing Callback Hell with the Async Library

You may have noticed in the strategy illustrated above that the goal was to flatten-out the pyramid-like nesting of callbacks so that the code is more readable. While we achieved that to some extent by extracting the code and placing it in named functions, the code is still hard to read because our eyes have to jump around quite a bit to reconstruct the order in which the program executes. 

Luckily, we have some better solutions that not only solve the problem of nesting, but restore a sense of the order in which code executes. One of the most important of these is the [Async library](https://github.com/caolan/async). This library, which can be included in any Node project as as a module, provides a series of functions that allow us to wrangle asynchronous code into a synchronous form so that it is easier to read and reason about.

Let's work through a code-along example together, to see how it can help us deal with asynchrony.

## Code-Along: Using the Async Waterfall Function

To get started, open up the `async-example.js` file in the root. Inside we have a few lines of code just to get us started. At the top, we have some require calls that pull in the modules that we'll be using. Go ahead an install those modules. No need to use the `--save` flag as this is just an exercise.

The other two lines create some constants `WEATHER_API_URL` and `WEATHER_API_KEY`. What we are going to build here is a simple command line app that asks the user to type in a city for which they would like to have weather data. These constants are configuration data that we'll need to obtain weather data from [OpenWeatherMap](http://openweathermap.org/about), a company that provides an api for obtainin weather information.

Okay so let's get started. First, let's think about what we need to do here. Here's a list:

1. Prompt the user for the city on the command line.
2. Request weather information from OpenWeatherMap's API for that city.
3. Output the information on the command line.

As you probably already noticed, steps #1 and #2 here are async processes. We don't know how long it'll take the user to enter the city, and we don't know how long it will take the OpenWeatherMap API to come back with the requested weather data.

Now, as you've already learned, we could achieve this with callbacks, and that'd be okay since this a a simple case, but we can do better! We can use this Async library's [`waterfall` method](https://github.com/caolan/async#waterfall) to restore a sense of synchronicity to our code.

Let's begin by sketching out how this will work with the waterfall method's syntax. The waterfall method takes as arguments an array of functions, which it calls in order, and then a callback that is called once all the other methods have run. The other important characteristic of the waterfall method is that you can pass data from one method to another down the `waterfall`, as it were. So here's the general shape our code will take. Go ahead and type this into our file:

```
async.waterfall([
  (callback) => {
    console.log("Here we'll ask for the user's input.");
    callback();
  },
  (callback) => {
    console.log("Here we'll request the weather data.");
    callback();
  }
], (err, results) => {
  console.log("Here we'll output the result.");
});
```

At this point, if you run this code by doing `node async-example.js` at your command line, you should have the following output:

```
Here we'll ask for the user's input.
Here we'll request the weather data.
Here we'll output the result.
```

See how much easier this is to read! Gone is the confusing indentation. Gone is the need to reconstruct the series of events in your head. The code just looks (more or less) synchronous, even though what's really happening is asynchrony. Much better.

Okay so let's get our little weather app working. In order to get the user's input, we'll be using the **prompt** library. We'll need the following modifications inside the first callback to get that working:

```
async.waterfall([
  (callback) => {
    prompt.get({
      name: 'city',
      description: 'Enter city to fetch its current weather'
    }, (err, result) => {
      if (err) return callback(err);
      callback(null, result.city);
    });
  },
  (city, callback) => {
    console.log('The user entered: ' + city);
    callback();
  }
], (err, results) => {
  console.log("Here we'll output the result.");
});
```

Now we can see the `waterfall` method in action! But what's happening here?

Well, in the first callback we are using the prompt module to ask the user to enter a city. Then once they do, that data is returned in the prompt method's callback function. If there has been an error, we return and call the waterfall method's callback function, sending the error along to be handled in the callback (though currently we haven't set up any error handling). If, however, everything is working, which it should be, then we call the callback, supplying a null for the error argument, and the city that the user entered for the second. And in order to make the city string available in the next function, we've add city as a first argument to that function.

This is all very nice and readable compared to what we had before, no?

Okay, onto the next step. Now we want to actually request the data from OpenWeatherMap's API. Here are the modifications to make that possible:

```
async.waterfall([
  (callback) => {
    prompt.get({
      name: 'city',
      description: 'Enter city to fetch its current weather'
    }, (err, result) => {
      if (err) return callback(err);
      callback(null, result.city);
    });
  },
  (city, callback) => {
    const url = WEATHER_API_URL + city + '&APPID=' + WEATHER_API_KEY +
        '&units=imperial';
    request(url, (err, resp, body) => {
      if (err) return callback(err);
      callback(null, city, body);
    });
  }
], (err, city, weather) => {
  if (err) console.error(err);
  console.log('The weather in ' + city + ":\n", weather);
});
```

And there we have it. Using similar steps as in our previous example, we use the request module to get the data from OpenWeatherMap's API. Once it return, presuming there's been no error, we pass that data along to the final callback, where it's is output. We should see something like this:

![](http://ezmiller.s3.amazonaws.com/public/flatiron-imgs/async-example-run.gif)

## Resources

* The Async Library: https://github.com/caolan/async
* The OpenWeatherMap API: http://openweathermap.org/current
* Kyle Simpson, "Chapter 2: Callbacks" in **You Don't Know JS: Async & Performance**.
* Another Good discussion of callback hell at [callbackhell.com](http://callbackhell.com/)
