List users
curl -i localhost:8080/api/users -H "token: token123"

Sign up
curl -i -X POST localhost:8080/api/sign-up
-H "Content-Type: application/json"
-H "token: token123"
-d '{"surname": "Jon",
"lastname": "Doe", 
"street": "Teststraße 1",
"city": "Entenhausen",
"mail": "jondoetheplayer@yahoo.com",
"postCode": "NCC-1701-D",
"password": "testpw"}'

View single user
curl -i localhost:8080/api/users/ea9262b9-6883-402c-8cdb-3b5a11b4f353 -H "token: token123"
