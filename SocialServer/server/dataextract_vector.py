from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
import numpy as np


# Initialize SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')


def extract_urls(soup, username):
    """
    Extract reel URLs for the given username.
    """
    links = soup.find_all('a', {'class': 'x1i10hfl'})
    reels_urls = {
        link.get('href') for link in links if link.get('href', '').startswith(f'/{username}/reel/')
    }
    print(f"Extracted {len(reels_urls)} unique reel URLs.")
    return list(reels_urls)


def extract_likes(soup, urls):
    """
    Extract likes, comments, and views from the soup and associate them with the provided URLs.
    """
    likes_divs = soup.find_all('div', {'class': '_aajz'})
    likes, comments, views = [], [], []

    for div in likes_divs:
        parsed_div = BeautifulSoup(str(div), 'html.parser').find_all('span')
        likes.append(parsed_div[0].text if len(parsed_div) > 0 else '0')
        comments.append(parsed_div[3].text if len(parsed_div) > 3 else '0')
        views.append(parsed_div[6].text if len(parsed_div) > 6 else '0')

    results = [
        {'reel_url': url, 'likes': likes[i], 'comments': comments[i], 'views': views[i]}
        for i, url in enumerate(urls) if i < len(urls)
    ]
    print(f"Processed {len(results)} reels.")
    return results


def convert_numeric_values(data):
    """
    Convert likes, comments, and views to numeric format for easier sorting.
    """
    for item in data:
        for key in ['likes', 'comments', 'views']:
            value = item[key]
            if 'K' in value:
                item[key] = int(float(value.replace('K', '')) * 1000)
            elif 'M' in value:
                item[key] = int(float(value.replace('M', '')) * 1_000_000)
            else:
                item[key] = int(value.replace(',', ''))
    print("Converted numeric values.")
    return data


def convert_to_vectors(data, username):
    """
    Convert reel data and metadata to vectors.
    """
    vector_data = []

    # Encode username as a vector
    username_vector = model.encode(username)

    for item in data:
        # Encode reel URL as a vector
        reel_url_vector = model.encode(item['reel_url'])

        # Combine numeric fields into a single array
        numeric_vector = np.array([item['likes'], item['comments'], item['views']], dtype=float)

        # Concatenate all vectors (username, reel URL, numeric fields)
        combined_vector = np.concatenate((username_vector, reel_url_vector, numeric_vector))

        # Append to result
        vector_data.append(combined_vector)

    print(f"Converted {len(vector_data)} reels to vector form.")
    return vector_data


def start_extractor_vector(html_page, username):
    """
    Main extraction process.
    """
    soup = BeautifulSoup(html_page, 'html.parser')

    # Extract URLs
    print("Extracting vector reel URLs...")
    urls = extract_urls(soup, username)

    # Extract likes, comments, and views
    print("Extracting likes/comments/views...")
    data = extract_likes(soup, urls)

    # Convert numeric values
    print("Converting numeric values...")
    numeric_data = convert_numeric_values(data)

    # Convert everything to vector form
    print("Converting data to vectors...")
    vector_data = convert_to_vectors(numeric_data, username)

    return vector_data
