# Database

- MongoDB
- Users make trips
- A trip can have multiple locations

## Users table

 Field         | Type     | Required 
--------------|----------|----------
 _id          | ObjectId | Yes      
 username     | String   | Yes (unique)     
 passwordHash | String   | Yes      

## Trips table

 Field      | Type     | Required 
------------|----------|----------
 _id        | ObjectId | Yes      
 title      | String   | Yes      
 user       | ObjectId | Yes      
 locations  | Array    | No      
 imageUrl  | String    | No 
 budget  | Object (amount, currency)    | No 
 users  | Array (user, role)    | No 

## Location array (in trips table)

 Field     | Type     | Required 
----------|----------|----------
 _id      | ObjectId | Yes      
country | String   | No   
city | String   | No
notes | String   | No
country | String   | No   
accommodation | String   | No  
startDate | Date   | No   
endDate | Date   | No   
backgroundColor | String   | No (default: #ffffff)


 ## Budget object

 Field      | Type     | Required 
------------|----------|----------
 amount        | Number | No      
 currency        | String | No (default: EUR)     

 Only location (and id) required. Other information can be added later.  
