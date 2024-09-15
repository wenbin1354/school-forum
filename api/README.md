# Django

## Initial Setup
```bash
git clone https://github.com/Whatismyusername/school-forum.git
cd api

# Do this only once !!
python -m venv djangoenv


# Activate the virtual environment (on Windows)
djangoenv\Scripts\activate
.venv\Scripts\Activate.ps1

# Activate the virtual environment (on macOS/Linux)
source djangoenv/bin/activate

# to deactivate the virtual environment
deactivate
```


## Install Dependencies
```bash
cd api
pip install -r requirements.txt

# to update requirements.txt
pip freeze > requirements.txt
```


## Run Server
```bash
cd auth
python manage.py runserver
```
Server will be running on http://127.0.0.1:8000/