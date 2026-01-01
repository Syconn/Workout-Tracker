import json

def load_json():
    with open("exercises.json", 'r') as f:
        return json.load(f)

exercises = []

for j in load_json():
    if j["name"] not in exercises:
        exercises.append(j["name"]) 
        
    
with open("exercise_names.json", "w") as f:
    json.dump(exercises, f, indent=4)