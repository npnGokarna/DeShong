Approach 1:

Utilized libphonenumber-js library to validate the phone number entered by the user as a string. More suitable for production code,
as this implementation encompasses various contraints for a phone number to be valid across multiple regions of the world.

How to test:
Step 1 : install libphonenumber-js using following script inside the project home: `npm install libphonenumber-js --save`
Step 2: run the code.

Approach 2:

Approach 2 is not as accurate as approach 1, but i attempted to identify possible phone numbers and converted the resulting string into E.164 format
for this, I have utilized regex expression that filters the given strings and provides potentially valid phone numbers,
but as i have stated in the code itself, it has numerous limitations and assumptions.


