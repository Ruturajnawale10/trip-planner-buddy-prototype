# trio-planner-buddy-prototype
This is a FasAPI based backend project. This repository contains prototype codes for Trip Planner Buddy Project.

# To create a python virtual env
For mac and ubuntu : virtualenv venv
For windows :python3 -m virtualenv venv

# To activate virtual env
Run this steps from cmd and not powershell
For windows : venv\Scripts\activate
For mac: source venv/bin/activate

# To deactivate virtual env
For mac: deactivate

# To install requirements.txt python packages
For mac: pip3 install -r requirements.txt

# Download configs folder from confuence


# To run backend Project: (inside src)
first enter/ activate virtual env
For mac and ubuntu : python main.py
# TODO: update run command accordingly for windows
For windows : python -m uvicorn src.main:app

# the url to access apidocs
http://127.0.0.1:8000/docs

#command to generate requirement.txt
pip freeze > requirements.txt