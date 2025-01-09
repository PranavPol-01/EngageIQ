# 📊 EngageIQ

EngageIQ is a powerful social media analysis tool designed to provide insights into user engagement on platforms like Instagram. By leveraging data visualization and machine learning, EngageIQ offers detailed analytics on post performance, user interactions, and content recommendations.

## ✨ Features

- **📈 Post Type Analysis**: Visualize the performance of different post types (e.g., reels, posts, carousels) using line charts.
- **📊 Average Metrics**: Calculate and display average likes, shares, comments, and engagement rates.
- **🏆 Top Post Identification**: Highlight the top-performing post based on engagement metrics.
- **🔗 Metric Correlation**: Analyze the correlation between different engagement metrics using bar charts.
- **💡 Insights and Recommendations**: Provide actionable insights and recommendations to improve social media strategy.

## 🛠️ Technologies Used

- **Frontend**: React, Recharts for data visualization, and Tailwind CSS for styling.
- **Backend**: Python, Django, AstraDB for data storage, and Sentence Transformers for vectorization.
- **Data Processing**: BeautifulSoup for HTML parsing and data extraction.

## 🚀 Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.x
- Virtualenv (optional but recommended)
- AstraDB account and token

### Frontend Setup

1. **📥 Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/engageiq.git
   cd engageiq/EngageIQ
   ```

2. **📦 Install Dependencies**

   ```bash
   npm install
   ```

3. **▶️ Run the Frontend**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

### Backend Setup

1. **📂 Navigate to the Server Directory**

   ```bash
   cd ../SocialServer
   ```

2. **🌐 Create a Virtual Environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **📦 Install Python Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **🔑 Set Up Environment Variables**

   Create a `.env` file in the `server` directory with the following content:

   ```plaintext
   ASTRA_DB_TOKEN=your_astra_db_token
   ASTRA_DB_URL=your_astra_db_url
   ```

5. **▶️ Run the Backend Server**

   ```bash
   python manage.py runserver
   ```

   The backend server will be available at `http://localhost:8000`.

## 🖥️ Usage

1. Open the frontend application in your browser.
2. Enter a username to analyze their social media engagement.
3. Click "Generate Insights" to view the analysis and recommendations.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any questions or feedback, please contact [your-email@example.com](mailto:your-email@example.com).
