# 🧠 Sublime IQ - AI-Powered Microcourse Generator

> **"Learning has never been this personalized. Enter any topic, get a complete microcourse in seconds."**

Transform your curiosity into structured knowledge with Sublime IQ - the revolutionary AI microcourse generator that creates personalized learning experiences tailored to any topic you want to master.

## ✨ What is Sublime IQ?

Sublime IQ is an intelligent learning platform that harnesses the power of AI to generate comprehensive microcourses on virtually any subject. Whether you're diving into quantum physics, learning about sourdough baking, or exploring machine learning algorithms, Sublime IQ creates a structured 5-6 part learning journey complete with:

- 📚 **Detailed lesson content** in markdown format
- 🎥 **Curated YouTube video recommendations** for each lesson
- 📝 **Clear lesson summaries** and learning objectives
- 🎯 **Progressive learning structure** that builds knowledge step-by-step

### How It Works

1. **Enter Your Topic**: Simply type in what you want to learn
2. **AI Generation**: Our Gemini AI-powered engine creates a structured curriculum
3. **Enhanced Learning**: Each lesson includes both written content and relevant YouTube videos
4. **Interactive Experience**: Navigate through lessons with an intuitive sidebar interface

## 🚀 Features

- **Instant Course Generation**: Get a complete microcourse in seconds
- **AI-Curated Content**: Leverages Google Gemini for high-quality, educational content
- **Video Integration**: Automatically finds relevant YouTube videos using YouTube Data API
- **Responsive Design**: Beautiful, modern UI built with Next.js and Tailwind CSS
- **Progressive Learning**: Structured lessons that build upon each other
- **Academic Focus**: Prioritizes quality educational content over entertainment

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **Video Content**: YouTube Data API v3
- **Package Manager**: pnpm
- **Development**: Turbopack for fast development

## ⚡ Quick Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Google Gemini API Key
- YouTube Data API Key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sublime-iq.git
   cd sublime-iq
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   YOUTUBE_API_KEY=your_youtube_data_api_key_here
   ```

   **Getting API Keys:**

   - **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to create your API key
   - **YouTube Data API Key**: Go to [Google Cloud Console](https://console.cloud.google.com/), enable YouTube Data API v3, and create credentials

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` and start generating microcourses!

## 🎯 Usage

1. Enter any topic you want to learn about in the input field
2. Click "Generate Microcourse"
3. Wait for the AI to create your personalized curriculum
4. Navigate through lessons using the sidebar
5. Watch recommended videos and read detailed content for each lesson

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for learners everywhere. Start your learning journey today with Sublime IQ!**
