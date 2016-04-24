Using the Async Library to Manage "Callback Hell"
=================================================

## Overview

In the past few lessons we learned about and then got a chance to write callbacks. As such, you are now in posession of the most basic and most ubiquitous method for managing asynchrony in JS applications. Congratuations!

However, there are a few things that we need to keep in mind when using the callback pattern. Because callbacks do have weaknesses. These weaknesses often manifest in what is referred to rather ominously as...wait for it...CALLBACK HELL!

So that is what we will focus on in this lesson: what are these problems with callbacks that lead to callback hell, and how can we deal with them. By the end of the lesson, you will be able to: 

1. Explain Callback Hell.
2. Avoid Callback Hell by using the Async library.

## Callback Hell

So what is this infamous Callback Hell? In fact, callback hell can be a difficult thing to describe despite the fact that when you encounter it you definitely know that it's, well, hellish. Nonetheless, let's get to the bottom of this phenomenon.

Generally speaking, callback hell is something that we tend to encounter when dealing with more complex execution flows that involve multiple, interrelated, asynchronous processes. In order to how this situation can arise, let's return to our original peanut butter sandwhich program from the first lesson.

In that program, our algorithm gathered ingredients through two asynchronous processes: grocery shopping and bread baking. Really, though, these two proceses were interrelated because how can we bake bread if we don't have the ingredients needed to make bread? Let's rethink our program taking that into account. Now that we know about callbacks, we can express that interelatedness with some pseudocode:

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

Now that you have a sense of the weaknesses of callbacks, let's talk about common practices for managing or avoiding callback hell. The truth is that there are a variety of methods for avoiding callback hell that you are likely to encounter, and the various methods for managing asynchrony are a key domain in which Javascript and Node are developing changing. In this lesson, we will cover two of the mostly commonly used methods, which have been in use for some time now, and which therefore you will encounter frequently. Then, in the next lesson, we'll examine one of the newer patterns called Promises, which are now becoming standard to Node and Javascript.

One of the most common ways that programmers avoid callback hell involves a simple stylistic tweak of using "named" functions instead of "anonymous" functions when defining the callback. An anonymous function, as you may recall is just one without a name, e.g. `function() { // does something }`;a named function is one that has been named, e.g. `var myFunc = function() { // does something }`. 

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

That said, there are some improvements here. One advantage gained here is that we aren't any longer dealing with the complex nesting of anonymous functions. This is good because our brains don't have to interpet all that indentation. Plus, the different sets of program logic within each callback are now nicely separated into their own blocks, complete with named functions that will help someone who looks at the code later know what that particular callback does.

So while certainly not a huge improvement, this stylistic shift does have some advantages and can be particularly useful if our callback contains a lot of code. It's not a bad trick to have in our tool set, especially because it's an approach that we are very likely to see in legacy code.
