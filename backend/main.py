from fastapi import FastAPI
from .models import UserInput

# Create an instance of the FastAPI class.
app = FastAPI()

# This is our first endpoint, it's still here to say "Hello World".
@app.get("/")
def read_root():
    return {"Hello": "World"}

# This is our new endpoint for generating a fitness program.
# The `@app.post("/generate-program")` decorator tells FastAPI
# to handle POST requests to the "/generate-program" path.
@app.post("/generate-program")
# The `user_input: UserInput` part is very important!
# It tells FastAPI to expect a JSON payload that matches the structure
# of our UserInput model. FastAPI will automatically validate the data.
def generate_program(user_input: UserInput):
    # Here, we use a f-string to create a dynamic message
    # based on the data sent by the frontend.
    program_message = (
        f"Congratulations on starting your fitness journey! "
        f"We've created a personalized plan for you to '{user_input.goal}' "
        f"at an '{user_input.fitness_level}' level, "
        f"training '{user_input.frequency}'."
    )
    
    # We return a dictionary with a key "program", just like your frontend's mock data.
    return {"program": program_message}