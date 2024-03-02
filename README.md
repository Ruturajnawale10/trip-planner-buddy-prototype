# Trip Planner Buddy App

This repository contains codes for the Trip Planner Buddy Project developed at San Jose State University. The project utilizes Python, Golang, Redis, React Native, MongoDB, and FastAPI to create a scalable microservice architecture for trip planning.

## Overview

- **Project Name:** Trip Planner Buddy App, SJSU
- **Technologies:** Python, Golang, Redis, React Native, MongoDB, FastAPI, GPT 3.5-Turbo API
- **Duration:** January 2023 – Present

## Features Implemented
- User can search different cities and create a trip
- User can find different places information in a city and add to trip
- User can share trips to other users of the app
- User can search for top rated shared trips
- User can set preferences for types of POIs and get recommendations of places powered by GPT 3.5 Turbo API
- User has access to a chatbot in the trip which answers queries related to the trip and places which is also powered by context based usage of GPT API

## Repository Structure

- `src/`: Contains the backend code for the project.
- `requirements.txt`: Lists the Python packages required to run the project.

## Installation and Setup

To set up the project locally, follow these steps:

1. Clone this repository.
2. Create a Python virtual environment:
    - For macOS and Ubuntu: `virtualenv venv`
    - For Windows: `python3 -m virtualenv venv`
3. Activate the virtual environment:
    - For Windows: `venv\Scripts\activate`
    - For macOS: `source venv/bin/activate`
4. Install the required Python packages:
    - For macOS: `pip3 install -r requirements.txt`
5. Download the `configs` folder from Confluence (link provided separately).

## Running the Backend

Navigate to the `src/` directory and follow these steps:

1. Activate the virtual environment (if not already activated).
2. Run the backend project:
    - For macOS and Ubuntu: `python main.py`
    - For Windows: `python -m uvicorn src.main:app`

The API documentation can be accessed at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## Additional Information

- The API Gateway for this project is located in a separate repository: [API Gateway Repo](https://github.com/Ruturajnawale10/api-gateway).
- To generate the `requirements.txt` file, run `pip freeze > requirements.txt`.
