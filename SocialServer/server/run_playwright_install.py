import subprocess
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os

@csrf_exempt
def install_playwright(request):
    try:
        # Check if this is the correct environment to run Playwright installation
        if not settings.DEBUG:  # Just an example check. You can modify it to suit your needs.
            return JsonResponse({
                'message': 'Playwright install command can only be executed in the development environment.'
            }, status=400)

        # The command you want to run
        command = "python -m playwright install"
        
        # Execute the command
        result = subprocess.run(command, shell=True, text=True, capture_output=True)

        # If the installation was successful
        if result.returncode == 0:
            return JsonResponse({
                'message': 'Playwright install completed successfully!',
                'output': result.stdout
            })
        
        return JsonResponse({
            'message': 'Playwright install failed.',
            'error': result.stderr
        }, status=500)

    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'status': 'failed'
        }, status=500)
