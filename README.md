#Rich Models

## Ideas
-Promises, Yo
-When service calls are successful you only care about the data returned from the server
-When service calls fails you want the full http response
-Error handling can be both general (logging etc.) and specific to models

## Concerns
-Mixin approach could lead to making it difficult to track down where functions are coming from.
-richmodel.js could grow large as we add functionality to it


