List users
curl -i https://samy-backend-ybaxbalfwa-ey.a.run.app/api/users -H "token: token123"

Sign up
curl -i -X POST https://samy-backend-ybaxbalfwa-ey.a.run.app/api/sign-up
-H "Content-Type: application/json"
-H "token: token123"
-d '{"firstName": "Jon",
"lastName": "Doe", 
"street": "Teststraße 1",
"city": "Entenhausen",
"mail": "jondoetheplayer@yahoo.com",
"postCode": "NCC-1701-D",
"password": "testpw"}'

View single user
curl -i https://samy-backend-ybaxbalfwa-ey.a.run.app/api/users/ea9262b9-6883-402c-8cdb-3b5a11b4f353 -H "token: token123"

