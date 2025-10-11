import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5001"

# -----------------------------
# Test Data
# -----------------------------
user = {
    "username": "jayaraj",
    "email": "jayaraj@example.com",
    "password": "strongpassword",
    "gender": "male"
}

# tasks
task1 = {
    "title": "Learn Docker",
    "description": "I'm learning Docker",
    "progress": 0,
    "due_date": (datetime.now() + timedelta(days=7)).isoformat(),
    "type": "STUDY"
}

task2 = {
    "title": "Learn Kubernetes",
    "description": "hi",
    "progress": 0,
    "due_date": (datetime.now() + timedelta(days=14)).isoformat(),
    "type": "STUDY"
}


# -----------------------------
# Helper functions
# -----------------------------
def print_response(r):
    print(f"URL: {r.url}")
    print(f"Status: {r.status_code}")
    try:
        print("Response:", r.json())
    except:
        print("Response text:", r.text)
    print("-" * 50)

# -----------------------------
# Signup
# -----------------------------
print("1. SIGNUP")
r = requests.post(f"{BASE_URL}/auth/signup", json=user)
print_response(r)

# -----------------------------
# Login
# -----------------------------
print("2. LOGIN")
r = requests.post(f"{BASE_URL}/auth/login", json={"username": user["username"], "password": user["password"]})
print_response(r)

# -----------------------------
# Create Tasks
# -----------------------------
print("3. CREATE TASKS")
r1 = requests.post(f"{BASE_URL}/api/users/{user['username']}/tasks", json=task1)
print_response(r1)
r2 = requests.post(f"{BASE_URL}/api/users/{user['username']}/tasks", json=task2)
print_response(r2)

# -----------------------------
# List Tasks
# -----------------------------
print("4. LIST TASKS")
r = requests.get(f"{BASE_URL}/api/users/{user['username']}/tasks")
print_response(r)
task_list = r.json()
if task_list:
    first_task_id = task_list[0]["id"]
    second_task_id = task_list[1]["id"]

    print(first_task_id, second_task_id)

# -----------------------------
# Update Task (PATCH)
# -----------------------------
print("5. UPDATE FIRST TASK (completed=True, progress=100)")
r = requests.patch(
    f"{BASE_URL}/api/users/{user['username']}/tasks/{first_task_id}",
    json={"completed": True, "progress": 100, "type": "HOBBY"}
)
print_response(r)

# -----------------------------
# Delete Task
# -----------------------------
print("6. DELETE SECOND TASK")
r = requests.delete(f"{BASE_URL}/api/users/{user['username']}/tasks/{second_task_id}")
print_response(r)

# -----------------------------
# Logout
# -----------------------------
print("7. LOGOUT")
r = requests.post(f"{BASE_URL}/auth/logout", params={"username": user["username"]})
print_response(r)
