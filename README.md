### 📕📗📘📙 Hunter Elective Forum

Hunter Elective Forum is a full stack application built by 

[WenBin Lin](https://github.com/wenbin1354)

[Lihong Zhou](https://github.com/Whatismyusername)

[Brian Arjona](https://github.com/BrianArjona)



The site is currently deployed [here](https://school-forum.netlify.app/):

https://school-forum.netlify.app/

### ✨ Description 
One pain point Hunter students experience is the not-knowing of the variety of elective classes. It is pretty difficult for students to explore different options because most of the official platforms leave this section to be ambiguous The main source of elective information comes from peer students through group chats or in-person discussions. So we build this platform to help students to share their elective experiences and help other students to make better decisions.

### ⚙ Technologies Used
- `React` as the frontend framework
- `Material UI` for styling
- `Redux` for state management
- `Django` with `Firebase Admin SDK` as the backend
- `Firebase` for authentication and database

### 💨 To Get Started Locally

#### 📝 Prerequisites

- [Python](https://www.python.org/downloads/)
- [npm](https://www.npmjs.com/get-npm)

#### 🏃‍♀️ Running the app locally

For local development you will need two terminals open, one for the api-backend and another for the react-client.

_Clone_ this app, then:

```bash
# api-backend terminal 1
# you might want to create a virtual environment for this project
python -m venv djangoenv
# Activate the virtual environment (on Windows)
djangoenv\Scripts\activate
# Activate the virtual environment (on macOS/Linux)
source djangoenv/bin/activate

# install dependencies
cd api
pip install -r requirements.txt

# run server
cd auth
python manage.py runserver
```

```bash
# react-client terminal 2
cd client
npm install
npm start
```

- api-backend will launch at: http://127.0.0.1:8000
- react-client will launch at: http://localhost:5173

### 🎨 For Deployment

#### Frontend

We use [Netlify](https://www.netlify.com/) to deploy our frontend.

#### Backend

We use [DigitalOcean](https://www.digitalocean.com/) Ubuntu Droplet to deploy our backend. Using `Gunicorn` as the WSGI server and `Nginx` as the reverse proxy server. `Certbot` is used to enable HTTPS. A custom domain is used for the backend to enable the use of cookies from `name.com`
