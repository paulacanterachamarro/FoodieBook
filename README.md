# 🍳 FoodieBook – Discover & Share Recipes

FoodieBook is a modern, single-page web application (SPA) built for the final project of the web development course. It's a place for cooking enthusiasts to discover new recipes and share their own creations.

**Author:** [Your Name Here]
**Hobby:** Cooking & Gastronomy

## 🚀 Live Demo

You can view the fully deployed application here: **[Vercel/Netlify Link Will Be Here After Deployment]**

## 📋 Features Implemented

*   **SPA Architecture**: Built with Next.js App Router, providing fast, seamless navigation without page reloads.
*   **External API Integration**: Dynamically consumes **TheMealDB API** to fetch and display thousands of recipes on the home page. Includes a real-time search feature that queries the API.
*   **User Content Submission & Mock API**: A user-friendly form on the `/submit` page allows users to post their own recipes. These submissions are handled by a Server Action, which acts as our "custom API," validating the data and storing it in a mock JSON database.
*   **GenAI - Recipe Image Generation**: If a user doesn't upload an image for their recipe, our app uses a Google Gemini model to generate a beautiful, unique, and contextually relevant image for the dish.
*   **GenAI - Personalized Recommendations**: An AI-powered tool on the `/recommendations` page suggests recipes tailored to a user's specific dietary restrictions and preferences.
*   **Security Measures**:
    *   **XSS Prevention**: All user-generated content (recipe titles, ingredients, etc.) is rendered as text by default in React, preventing Cross-Site Scripting attacks.
    *   **Input Validation**: The submission form uses robust client-side validation (with `zod` and `react-hook-form`) and server-side validation to ensure data integrity.
*   **Performance Optimization**:
    *   **Image Optimization**: Leverages the built-in `next/image` component to automatically optimize images, serve modern formats like WebP, and apply lazy loading.
    *   **Code Minification**: The production build (`next build`) automatically minifies all JavaScript and CSS assets.
    *   **Lazy Loading**: In addition to images, UI components are structured to load data efficiently, with Suspense boundaries providing a better user experience during data fetching.
*   **Modern & Responsive Design**: The UI is clean, aesthetically pleasing, and fully responsive, offering a great experience on desktops, tablets, and mobile devices. It's built with Tailwind CSS and shadcn/ui components.

## 💻 Tech Stack

*   **Framework**: Next.js (React)
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui
*   **Form Management**: React Hook Form & Zod
*   **AI Integration**: Google Genkit with Gemini models
*   **External API**: TheMealDB
*   **Deployment**: Vercel/Netlify

## 🛠️ How to Run Locally

Follow these steps to get the project running on your local machine.

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd foodiebook-project
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    The project uses Genkit for AI features, which requires a Google AI API key.
    *   Create a file named `.env` in the root of the project.
    *   Add your Google AI API key to it:
        ```
        GOOGLE_API_KEY=your_google_ai_api_key_here
        ```

4.  **Run the Development Server**
    The application and AI flows run in parallel.

    *   In your **first terminal**, start the Next.js development server:
        ```bash
        npm run dev
        ```
        The application will be available at `http://localhost:9002`.

    *   In a **second terminal**, start the Genkit development server:
        ```bash
        npm run genkit:dev
        ```
        This allows the AI features to work locally.

Now you can open `http://localhost:9002` in your browser and use the full application.
