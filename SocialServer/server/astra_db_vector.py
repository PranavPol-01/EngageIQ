from faker import Faker
from astrapy import DataAPIClient
import os
import random
from dotenv import load_dotenv
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Load environment variables from the .env file
load_dotenv()

# Retrieve the Astra DB token and URL from environment variables
astra_db_token = os.getenv("ASTRA_DB_TOKEN")
astra_db_url = os.getenv("ASTRA_DB_URL")

# Initialize the Astra DB client
client = DataAPIClient(astra_db_token)
db = client.get_database_by_api_endpoint(astra_db_url)

# Function to get the 'accounts_vector' collection
def get_accounts_vector_collection():
    return db.get_collection("accounts_vector")

# Generate random vector data (reels/posts/carousels as vectors)
def generate_random_vectors(count=5, dim=10):
    """Generates random vectors of given dimension."""
    vectors = []
    for _ in range(count):
        vectors.append([round(random.uniform(0, 1), 4) for _ in range(dim)])
    return vectors

# Push data to the "accounts_vector" collection
def pushtodb_vector(username, reel_vectors):
    """
    Pushes vector data (reels/posts/carousels) to the AstraDB collection 'accounts_vector'.
    """
    if not isinstance(reel_vectors, list) or not reel_vectors:
        raise ValueError("Invalid reel data provided. Must be a non-empty list.")

    collection = get_accounts_vector_collection()

    # Find or create user document in 'accounts_vector'
    user_document = collection.find_one({"name": username})
    if not user_document:
        print(f"Creating new vector account for {username}.")
        user_document = {
            "name": username,
            "reels": [],
            "posts": [],
            "carousels": [],
        }

    # Add reels data (vector format)
    user_document["reels"].extend(reel_vectors)
    print(f"Added {len(reel_vectors)} reel vectors for user {username}.")

    # Generate and add post vector data
    post_vectors = generate_random_vectors(count=5, dim=10)
    user_document["posts"].extend(post_vectors)
    print(f"Generated and added {len(post_vectors)} post vectors for user {username}.")

    # Generate and add carousel vector data
    carousel_vectors = generate_random_vectors(count=5, dim=15)
    user_document["carousels"].extend(carousel_vectors)
    print(f"Generated and added {len(carousel_vectors)} carousel vectors for user {username}.")

    # Remove `_id` field if present
    user_document = {k: v for k, v in user_document.items() if k != "_id"}

    # Upsert the document into the database
    collection.update_one({"name": username}, {"$set": user_document}, upsert=True)
    print(f"Vector data successfully pushed to 'accounts_vector' for user {username}.")
