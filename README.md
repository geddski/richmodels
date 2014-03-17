# Rich Models

## Setup
1. Fork repo
2. npm install -g bower karma karma-mocha karma-chai
3. git clone your fork
4. cd richmodels && bower install
5. karma start (then open browser to http://localhost:9876/)

## Ideas

 - Promises, Yo. Combined with chaining and FP they're awesome.
 - Mixin just the functionality your model needs.
 - Sometimes when saving a model you want to update it with the server's response like ngResource does, except with ngResource it's not optional.
 - When service calls are successful you only care about the data returned from the server
 - When service calls fails you want the full http response
 - A clean & chainable API is desirable
 - Error handling can be both general (logging etc.) and specific to models. Multiple promise.catch() calls enable this easily.

## Concerns

 - Mixin approach could lead to making it difficult to track down where functions are coming from.
 - richmodel.js could grow large as we add functionality to it
