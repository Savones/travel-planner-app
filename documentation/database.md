# Database

- MongoDB
- Users make trips
- A trip can have multiple locations

## Users table

 Field         | Type     | Required 
--------------|----------|----------
 _id          | ObjectId | Yes      
 username     | String   | Yes      
 passwordHash | String   | Yes      

## Trips table

 Field      | Type     | Required 
------------|----------|----------
 _id        | ObjectId | Yes      
 title      | String   | Yes      
 user       | ObjectId | Yes      
 locations  | Array    | No       

## Location array (in trips table)

 Field     | Type     | Required 
----------|----------|----------
 _id      | ObjectId | Yes      
 location | String   | Yes      
 startDate| Date     | No      
 endDate  | Date     | No      
 accommodation | String     | No  
 sights | Array     | No

 Only location (and id) required. Other information can be added later.  