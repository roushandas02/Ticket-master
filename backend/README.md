Signup(POST)->http://localhost:5000/api/auth/signup
    Payload
    {
        "name": "Roushan Das",
        "email": "roushandas02@gmail.com",
        "college": "Jadhavpur University",/"roll": "2021CSB062",
        "password": "roushan1"
    }
    Response
    {
        "name": "Roushan Das",
        "email": "roushandas03@gmail.com",
        "college": "Jadhavpur University",
        "passwordHash": "$2b$12$SIF257uzXC12L9jEwoXFBOI9ax2VMQ90SIVgcpu3jOVAEV8dHGlnC",
        "role": "member",
        "iiestian": false,
        "_id": "692f6f014f07d5ec07f0ad17",
        "createdAt": "2025-12-02T22:58:09.140Z",
        "updatedAt": "2025-12-02T22:58:09.140Z",
        "__v": 0
    }



Login(POST)->http://localhost:5000/api/auth/login
    Payload
    {
        "email": "roushandas02@gmail.com",
        "password": "roushan1"
    }
    Response
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTJmNmEwOTdiZTI0NTRiZTE1MGM2MTUiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzY0NzE1MzAxLCJleHAiOjE3NjQ3MTYyMDF9.RIY6GNAL0T4c-zs_3QIyM4q9vWyfOq2pCShzdpoW4f8",
        "user": {
            "_id": "692f6a097be2454be150c615",
            "name": "Roushan Das",
            "email": "roushandas02@gmail.com",
            "college": "Jadhavpur University",
            "passwordHash": "$2b$12$PKrRvEf8V/8y67VfKddFOe8ttXwyzXmgW3O6pqygBMG/K7XdFgkYO",
            "role": "member",
            "iiestian": false,
            "createdAt": "2025-12-02T22:36:57.371Z",
            "updatedAt": "2025-12-02T22:36:57.371Z",
            "__v": 0
        }
    }



Refresh(GET)->http://localhost:5000/api/auth/refresh
(To get the access token and renew refresh token)
    Response
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTJmNmEwOTdiZTI0NTRiZTE1MGM2MTUiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzY0NzE2MTU3LCJleHAiOjE3NjQ3MTcwNTd9.S3s73UPHFFEZi_oDiyso_ZTpLALIhhXHTOMleaD98h8"
    }




Logout(GET)->http://localhost:5000/api/auth/logout
    Response
    {
        "message": "Logged out successfully"
    }





With each API call, attach authorization header 
Bearer <Access Token>

Whenever the Response is { message: 'Invalid or expired access token' }
->Hit the Refresh endpoint to refresh access token

Whenever the reply is { message: "No refresh token" }
->Redirect them to login again