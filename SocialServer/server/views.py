from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from threading import Thread
import json
from .models import UserLog  # Import the model
from . import dataextraction, main, astra_db_handler, dataextract_vector  # Already existing imports
from .astra_db_handler import pushtodb  # Already existing import
from .astra_db_vector import pushtodb_vector  # Already existing import
# from .astra_connector import db  # Import the connected db object
from django.core.management import call_command
import numpy as np  # Add this import

@csrf_exempt
def check_last_success(request):
    """
    Endpoint to check if the last push to the Astra DB was successful
    for the given username. If successful, a data fetch function is called.
    """
    if request.method == 'POST':
        try:
            username = request.GET.get('username')

            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)

            print(f"Checking last successful push for username: {username}")

            # Retrieve the UserLog entry for the given username
            user_log = UserLog.objects.filter(username=username).first()

            if user_log and user_log.last_successful_update:
                # If there is a successful push and the update is recent, call fetch_data function
                last_update_time = user_log.last_successful_update
                print(f"Last successful push: {last_update_time}")

                # Call fetch_data instead of temp_function
                response = astra_db_handler.fetch_data(username)
                
                # Return the response received from fetch_data
                return response

            else:
                # If no successful push or no record for the username
                return JsonResponse({
                    'message': f"No successful push found for username {username}",
                    'status': 'failed'
                })

        except Exception as e:
            return JsonResponse({
                'error': str(e),
                'status': 'failed'
            }, status=500)

    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)


@csrf_exempt
def handle_post(request):
    if request.method == 'POST':
        try:
            username = request.GET.get('username')

            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)
            
            print("Received request for username:", username)

            # Check if the username already exists in the database
            user_log, created = UserLog.objects.get_or_create(
                username=username,
                defaults={'last_request_time': now()}
            )

            if not created:
                # If the username exists, update the timestamp
                user_log.last_request_time = now()
                user_log.save()

                # Respond with existing data if already present
                response = JsonResponse({
                    'message': f'Request already exists for username {username}.',
                    'error_details': user_log.error_details,
                    'last_request_time': user_log.last_request_time,
                    'status': 'success'
                })
            else:
                response = JsonResponse({'message': f'Request received for {username}'}, status=200)
            
            Thread(target=process_request_in_background, args=(username, user_log)).start()
            print(f"Thread started for username: {username}")
            return response

        except Exception as e:
            return JsonResponse({
                'error': f"An error occurred while processing the request: {str(e)}",
                'status': 'failed'
            }, status=500)

@csrf_exempt
def handle_post_vector(request):
    if request.method == 'POST':
        try:
            username = request.GET.get('username')

            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)
            
            print("Received request for username:", username)

            # Check if the username already exists in the database
            user_log, created = UserLog.objects.get_or_create(
                username=username,
                defaults={'last_request_time': now()}
            )

            if not created:
                # If the username exists, update the timestamp
                user_log.last_request_time = now()
                user_log.save()

                # Respond with existing data if already present
                response = JsonResponse({
                    'message': f'Request already exists for username {username}.',
                    'error_details': user_log.error_details,
                    'last_request_time': user_log.last_request_time,
                    'status': 'success'
                })
            else:
                response = JsonResponse({'message': f'Request received for {username}'}, status=200)
            
            Thread(target=process_request_in_background_vector, args=(username, user_log)).start()
            print(f"Thread started for username: {username}")
            return response

        except Exception as e:
            return JsonResponse({
                'error': f"An error occurred while processing the request: {str(e)}",
                'status': 'failed'
            }, status=500)    
        
def process_request_in_background(username, user_log):
    """
    Process the request in the background and save data to the database.
    Updates error details if the process fails.
    """
    try:
        print(f"Started background processing for username: {username}")
        # Fetch HTML content using the username
        html_content = main.main_func(username)
        
        print("HTML content fetched")

        # Extract data
        results = dataextraction.start_extractor(html_content, username)

        print("Data extraction complete, starting to push to DB.")

        # Log the final JSON data
        print("Final JSON Response:")
        print(json.dumps(results, indent=4))

        # Push the extracted data to Astra DB
        if isinstance(results, list) and results:
            pushtodb(username, results)
            print(f"Data successfully pushed to the database for {username}.")
            
            # If successful, update the last successful update time
            user_log.last_successful_update = now()
            user_log.error_details = None  # Clear any previous error details if it's a success
            user_log.save()
        
        else:
            print(f"No valid data to push to the database for {username}.")
            # In case of no data to push, log an error as empty results
            user_log.error_details = 'No valid data to push to Astra DB.'
            user_log.last_error_time = now()  # Store the time when the error occurred
            user_log.save()

    except Exception as e:
        # Update the user log with error details
        user_log.error_details = str(e)
        user_log.last_error_time = now()  # Store the error time
        user_log.save()
        print(f"Error processing username {username}: {str(e)}")

def ensure_json_serializable(data):
    """
    Ensures that the input data (which might contain np.ndarray or other non-serializable types) 
    is converted to a JSON-serializable format (e.g., lists).
    """
    if isinstance(data, np.ndarray):
        # Convert numpy arrays to lists
        return data.tolist()
    
    elif isinstance(data, list):
        # Recursively convert all nested numpy arrays to lists
        return [ensure_json_serializable(item) if isinstance(item, (list, np.ndarray)) else item for item in data]
    
    return data  # If already serializable, return as
def process_request_in_background_vector(username, user_log):
    """
    Process the request in the background and save data to the database.
    Updates error details if the process fails.
    """
    try:
        # Validate if the username is a string
        if not isinstance(username, str):
            raise ValueError(f"Invalid username: {username}. Must be a string.")

        print(f"Started background processing for username: {username}")

        # Fetch HTML content using the username
        html_content = main.main_func(username)
        print("HTML content fetched")

        # Extract vector data
        vectors = dataextract_vector.start_extractor_vector(html_content, username)
        print("Data extraction complete, received vector data.")

        # Verify if vectors are valid (must be a list of lists or ndarray)
        if isinstance(vectors, list) and vectors and all(isinstance(vec, (list, np.ndarray)) for vec in vectors):
            print(f"Extracted {len(vectors)} vectors. Pushing to DB...")

            # Ensure the vectors are in JSON-serializable format
            vectors = ensure_json_serializable(vectors)

            # Push the extracted vectors to Astra DB
            pushtodb_vector(username, vectors)
            print(f"Data successfully pushed to the database for {username}.")
            
            # Update the last successful update time
            user_log.last_successful_update = now()
            user_log.error_details = None  # Clear any previous error details if successful
            user_log.save()
        
        else:
            print(f"No valid vector data to push to the database for {username}.")
            
            # Handle case where extracted data is invalid
            user_log.error_details = 'No valid vector data to push to Astra DB.'
            user_log.last_error_time = now()  # Store the time when the error occurred
            user_log.save()

    except Exception as e:
        # Update the user log with error details in case of failure
        user_log.error_details = str(e)
        user_log.last_error_time = now()  # Store the time when the error occurred
        user_log.save()
        print(f"Error processing username {username}: {str(e)}")


# def get_collections(request):
#     try:
#         collections = db.list_collection_names()
#         return JsonResponse({"collections": collections})

#     except Exception as e:
#         return JsonResponse({'error': f"Failed to retrieve collections: {str(e)}"}, status=500)


@csrf_exempt
def test_post(request):
    if request.method == 'POST':
        try:
            username = request.GET.get('username')
            
            if not username:
                try:
                    data = json.loads(request.body)
                    username = data.get('username')
                except json.JSONDecodeError:
                    pass
            
            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)
                
            return JsonResponse({
                'message': f'Username {username} received successfully ,this is a test route. use different route for astradb',
                'status': 'success'
            })
            
        except Exception as e:
            return JsonResponse({'error': f"An error occurred: {str(e)}"}, status=500)
            
    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)


@csrf_exempt
def handle_post2(request):
    if request.method == 'POST':
        try:
            username = request.GET.get('username')
            
            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)
                
            print("Starting processing for username:", username)
            html_content = main.main_func(username)
            results = dataextraction.start_extractor(html_content, username)
            
            return JsonResponse(results, safe=False)
            
        except Exception as e:
            return JsonResponse({
                'error': f"An error occurred: {str(e)}",
                'status': 'failed'
            }, status=500)
            
    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)

# In your views.py
from django.http import JsonResponse
from django.core.management import call_command

def run_migrations(request):
    try:
        call_command('migrate')
        return JsonResponse({'message': 'Migrations completed successfully.'})
    except Exception as e:
        return JsonResponse({'error': f"Failed to run migrations: {str(e)}"}, status=500)
