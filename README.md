# Rich Models
**DISCLAIMER: This is a potential replacement for ngResource in Angular 2, and will either change a lot or go away completely. Please don't use in production projects**

## Setup
1. Fork repo
2. npm install -g karma karma-mocha karma-chai karma-chrome-launcher
3. git clone your fork
4. cd richmodels
5. karma start

## Ideas

 - Promises, Yo. Combined with chaining and FP they're awesome.
 - Mixin just the functionality your model needs.
 - Sometimes when saving a model you want to update it with the server's response like ngResource does, except with ngResource it's not optional.
 - When service calls are successful you only care about the data returned from the server
 - When service calls fails you want the full http response
 - A clean & chainable API is desirable
 - Error handling can be both general (logging etc.) and specific to models. Multiple promise.catch() calls enable this easily.

## Potential Concerns

 - Mixin approach could lead to making it difficult to track down where functions are coming from.
 - model.js could grow large as functionality is added to it
