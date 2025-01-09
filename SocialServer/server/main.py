import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
import time

# Load the environment variables
load_dotenv()

# Get the cookies string and parse it as JSON
cookies = json.loads(os.getenv('INSTAGRAM_COOKIES'))


def scroll_to_bottom(page, max_scrolls=20):
    """
    Function to scroll to the bottom and collect HTML.
    Parameters:
        - page: Page object
        - max_scrolls: Maximum number of scroll attempts
    Returns:
        - Collected HTML
    """
    all_html = ""
    prev_height = 0
    scrolls = 0

    while scrolls < max_scrolls:
        page.wait_for_load_state('networkidle')

        # Scroll to the bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)  # Wait for content to load

        # Collect the page content
        all_html += page.content()

        # Check if new content is loaded
        curr_height = page.evaluate("document.body.scrollHeight")
        if curr_height == prev_height:
            print("No new content to load. Ending scroll.")
            break

        prev_height = curr_height
        scrolls += 1
        print(f"Scroll #{scrolls} completed.")

    return all_html


def main_func(username):
    """
    Main function to scrape Instagram reels for a specific user.
    Parameters:
        - username: Instagram username
    Returns:
        - Page HTML
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        context = browser.new_context()
        context.add_cookies(cookies)

        page = context.new_page()
        page.goto(f'https://www.instagram.com/{username}/reels/')
        page.wait_for_load_state('networkidle')

        print("Starting scroll...")
        html = scroll_to_bottom(page)

        browser.close()
        return html
