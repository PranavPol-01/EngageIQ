import random
from faker import Faker
from astrapy import DataAPIClient
import os
from dotenv import load_dotenv
from django.http import JsonResponse  # Assuming the DB handler functions are properly imported
from .models import UserLog
from django.views.decorators.csrf import csrf_exempt

# Load environment variables from the .env file
load_dotenv()

# Retrieve the Astra DB token and URL from environment variables
astra_db_token = os.getenv("ASTRA_DB_TOKEN")
astra_db_url = os.getenv("ASTRA_DB_URL")

# Initialize the client
client = DataAPIClient(astra_db_token)

# Connect to the database using the Astra DB connection URL
db = client.get_database_by_api_endpoint(astra_db_url)

# Function to get the 'accounts' collection
def get_accounts_collection():
    return db.get_collection("accounts")

# Function to create random post data
def createpostdata(username, count=5):
    fake = Faker()
    posts = []
    for _ in range(count):
        posts.append({
            "link": fake.url(),
            "username": username,
            "likes": random.randint(100, 5000),
            "comments": random.randint(10, 1000),
        })
    print(f"Generated {len(posts)} posts for {username}.")
    return posts

# Function to create random carousel data
def createcarouseldata(username, count=5):
    fake = Faker()
    carousels = []
    for _ in range(count):
        carousels.append({
            "link": fake.url(),
            "username": username,
            "likes": random.randint(500, 10000),
            "comments": random.randint(20, 2000),
        })
    print(f"Generated {len(carousels)} carousels for {username}.")
    return carousels
# Main function to push all data (reels, posts, carousels) to the database
def pushtodb(username, reel_data):
    # Validate input
    if not isinstance(reel_data, list) or not reel_data:
        raise ValueError("Invalid reel data provided. Must be a non-empty list.")

    collection = get_accounts_collection()

    # Find or create account document
    account_document = collection.find_one({"name": username})
    if not account_document:
        print(f"Creating new account for {username}.")
        account_document = {
            "name": username,
            "reels": [],
            "posts": [],
            "carousels": [],
        }

    # Add reel data
    account_document["reels"].extend(reel_data)
    print(f"Added {len(reel_data)} reels to account {username}.")

    # Generate and add post data
    post_data = createpostdata(username)
    account_document["posts"].extend(post_data)

    # Generate and add carousel data
    carousel_data = createcarouseldata(username)
    account_document["carousels"].extend(carousel_data)

    # Remove _id from the document if present (since Cassandra doesn't allow modifying it)
    account_document = {k: v for k, v in account_document.items() if k != "_id"}

    # Update the database document
    collection.update_one({"name": username}, {"$set": account_document}, upsert=True)
    print(f"Data successfully pushed to the database for {username}.")


def fetch_data(username):
    """
    Temporary function to be called if the last successful Astra DB update is found.
    Fetches data from the database for the user and returns it.
    """
    print(f"Temporary function called for {username}")
    
    try:
        collection = get_accounts_collection()
        
        # Check if the user exists in the database
        account_document = collection.find_one({"name": username})

        if account_document:
            # If user exists, return their data (reels, posts, carousels)
            reels_data = account_document.get("reels", [])
            posts_data = account_document.get("posts", [])
            carousels_data = account_document.get("carousels", [])
            
            # Respond with the user's data
            return JsonResponse({
                "username": username,
                "reels": reels_data,
                "posts": posts_data,
                "carousels": carousels_data,
                "status": "success"
            })

        else:
            return JsonResponse({
                'message': f"User {username} not found in the database.",
                'status': 'failed'
            })

    except Exception as e:
        print(f"Error fetching data for {username}: {str(e)}")
        return JsonResponse({
            'error': f"An error occurred: {str(e)}",
            'status': 'failed'
        })

@csrf_exempt
def delete_user(request):
    """
    Endpoint to delete the account for the given username from both Astra DB and Django DB.
    """
    if request.method == 'DELETE':
        try:
            username = request.GET.get('username')

            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)

            print(f"Attempting to delete account for username: {username}")

            # Get the accounts collection from Astra DB
            collection = get_accounts_collection()

            # Find the user document in Astra DB
            account_document = collection.find_one({"name": username})

            if account_document:
                # If the user exists in Astra DB, delete the document from Astra DB
                collection.delete_one({"name": username})
                print(f"Account for {username} has been deleted from Astra DB.")

            else:
                return JsonResponse({
                    'message': f"User {username} not found in Astra DB.",
                    'status': 'failed'
                })

            # Delete user from Django DB (UserLog model or other relevant model)
            user_log = UserLog.objects.filter(username=username).first()

            if user_log:
                # If the user exists in Django DB, delete the user record
                user_log.delete()
                print(f"Account for {username} has been deleted from Django DB.")

            else:
                print(f"User {username} not found in Django DB.")

            return JsonResponse({
                'message': f"Account for username {username} has been successfully deleted from both databases.",
                'status': 'success'
            })

        except Exception as e:
            return JsonResponse({
                'error': f"An error occurred: {str(e)}",
                'status': 'failed'
            }, status=500)

    return JsonResponse({'error': 'Only DELETE requests allowed'}, status=405)

@csrf_exempt
def clear_databases(request):
    """
    Endpoint to clear all accounts from both Astra DB and Django DB.
    """
    if request.method == 'POST':  # We'll use POST to trigger clearing
        try:
            # Clear the 'accounts' collection in Astra DB
            collection = get_accounts_collection()

            # Deleting all documents from the 'accounts' collection in Astra DB
            collection.delete_many({})
            print(f"All accounts have been deleted from Astra DB.")

            # Clear all entries in Django DB (UserLog model or other relevant models)
            UserLog.objects.all().delete()
            print(f"All user accounts have been deleted from Django DB.")

            return JsonResponse({
                'message': "All accounts have been successfully deleted from both databases.",
                'status': 'success'
            })

        except Exception as e:
            return JsonResponse({
                'error': f"An error occurred: {str(e)}",
                'status': 'failed'
            }, status=500)

    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)