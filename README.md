# Prompt Wars

Prompt Wars is an AI-powered prompt engineering challenge platform where participants generate images using AI tools based on provided prompts.

## Features

- User authentication and account management
- Prompt-based image generation using the Stable Diffusion model
- 5 prompts per user with submission or deletion options
- Tracking of submission status and history
- Admin panel for managing submissions and users

## Getting Started

### Prerequisites

- Node.js 16+ 
- MongoDB database (local or Atlas)
- Hugging Face API key for image generation

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
HUGGING_FACE_API_KEY=your_hugging_face_api_key
```

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/prompt-wars.git
cd prompt-wars
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Register/Login**: Create an account or log in to access the platform.
2. **Dashboard**: Access your prompt generator and view remaining prompts.
3. **Generate Images**: Enter a prompt and generate an AI image.
4. **Submit or Delete**: Choose to submit the image as your entry or delete it to try again.
5. **View Submissions**: Check your submitted and deleted images.

## Project Structure

- `app/` - Next.js application structure
  - `api/` - API routes for authentication, image generation, and submissions
  - `auth/` - Authentication pages (login, register)
  - `components/` - Reusable UI components
  - `dashboard/` - User dashboard to generate and manage prompts
  - `models/` - MongoDB schema models
  - `submissions/` - Submission history and management
  - `utils/` - Utility functions and services

## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom auth with bcrypt
- **API Integration**: Stable Diffusion 2.1 model for image generation

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Hugging Face](https://huggingface.co/)
- [Stable Diffusion 2.1](https://huggingface.co/stabilityai/stable-diffusion-2-1) 