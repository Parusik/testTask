# Roles 

## Task:
`
Create a tiny server app based on Nodejs. The app should implement simple organization user structure management operations. The following user roles should be supported:
a. Administrator (top-most user) b. Boss (any user with at least 1 subordinate) c. Regular user (user without subordinates)
Each user except Administrator must have a boss (strictly one).
The following REST API endpoints should be exposed:
`
#### 1. Register user 
#### 2. Authenticate as a user 
#### 3. Return list of users, taking into account the following:
 - administrator should see everyone 
 - boss should see herself and all subordinates (recursively) 
 - regular user can see only herself
  
#### 4. Change user's boss (only boss can do that and only for her subordinates)
Verify there are no circular dependencies within boss-subordinate relations.



> Propose and use data formats which you feel are appropriate.

> Feel free to use any framework / library / backend storage you find suitable.

