# AI Electrician Feature Setup Guide

This guide explains how to set up and use the AI Electrician chat feature powered by Google's Gemini AI.

## Prerequisites

1. Google AI API key (free tier available)
2. Next.js application with TypeScript support
3. Tailwind CSS and shadcn/ui components

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Add your Gemini API key to your `.env.local` file:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your real API key.

### 3. Install Dependencies

The required dependency has already been installed:

- `@google/generative-ai` - Google's Generative AI SDK

### 4. Features Included

The AI Electrician feature includes:

- **Smart Chat Interface**: Interactive chat with an AI electrician
- **Safety-First Approach**: Always prioritizes electrical safety
- **Quick Questions**: Pre-configured common electrical questions
- **Professional Recommendations**: Suggests when to call a licensed electrician
- **24/7 Availability**: Get instant electrical advice anytime
- **Conversation History**: Maintains context throughout the chat session

### 5. How to Access

1. **For Customers**:

   - Go to Customer Dashboard
   - Click "AI Electrician Chat" in the Quick Actions sidebar
   - Start asking electrical questions

2. **Direct Access**:
   - Navigate to `/ai-electrician` in your browser

### 6. What the AI Can Help With

- Circuit breaker troubleshooting
- Outlet and switch problems
- Light fixture installation guidance
- Electrical safety tips
- Basic wiring questions
- Energy efficiency advice
- Code compliance guidance
- Emergency electrical situations

### 7. Safety Features

- Always recommends turning off power before electrical work
- Identifies dangerous situations requiring professional help
- Provides step-by-step safety instructions
- Emphasizes proper electrical safety protocols

### 8. API Endpoints

- `POST /api/ai-electrician` - Handles chat requests to Gemini AI

### 9. File Structure

```
app/
  ai-electrician/
    page.tsx              # Main AI electrician page
  api/
    ai-electrician/
      route.ts            # API route for Gemini integration
components/
  ai-electrician-chat.tsx # Chat component
lib/
  gemini.ts              # Gemini service wrapper
```

### 10. Troubleshooting

**API Key Issues:**

- Ensure your API key is correctly set in `.env.local`
- Check that the API key has proper permissions
- Verify the API key is valid and active

**Chat Not Working:**

- Check browser console for errors
- Ensure you're logged in to the application
- Verify the API route is accessible

**Rate Limiting:**

- Gemini free tier has usage limits
- Consider upgrading to paid tier for heavy usage

### 11. Customization

You can customize the AI behavior by modifying the system prompt in:

- `app/api/ai-electrician/route.ts` (server-side)

### 12. Security Notes

- API calls are made server-side to protect your API key
- User authentication is required to access the feature
- No sensitive user data is sent to the AI

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your API key configuration
3. Ensure all dependencies are properly installed
4. Check that the environment variables are loaded correctly

The AI Electrician is designed to be helpful while always prioritizing safety. For any dangerous electrical work, it will recommend consulting with a licensed professional electrician.
