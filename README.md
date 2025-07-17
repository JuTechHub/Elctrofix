# ElectroFix - Electrical Repair Platform

A comprehensive electrical repair platform connecting customers with verified electricians, featuring AI-powered assistance and real-time communication.

## 🚀 Features

- **Customer Dashboard**: Post electrical problems, track service requests, and communicate with electricians
- **Mechanic Dashboard**: View and accept service requests, manage jobs, and chat with customers
- **AI Electrician**: Powered by Google's Gemini AI for instant electrical guidance and safety tips
- **Real-time Chat**: Socket.io-powered communication between customers and electricians
- **Firebase Authentication**: Secure user registration and login system
- **Support Center**: Comprehensive help documentation and safety guidelines
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide React
- **Backend**: Next.js API routes, Socket.io
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Integration**: Google Gemini AI
- **Real-time Communication**: Socket.io
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Firebase project
- Google Gemini AI API key

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/electrical-repair-platform.git
   cd electrical-repair-platform
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables in `.env.local`:

   ```env
   # Gemini AI API Key
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** (if not already done)

   ```bash
   git remote add origin https://github.com/your-username/electrical-repair-platform.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add your environment variables in the Vercel dashboard
   - Deploy!

### Environment Variables for Production

Make sure to add these environment variables in your Vercel dashboard:

- `GEMINI_API_KEY`
- `NEXT_PUBLIC_GEMINI_API_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📱 Usage

### For Customers

1. Register/Login to your account
2. Navigate to Customer Dashboard
3. Click "Post New Problem" to submit an electrical issue
4. Wait for electricians to respond
5. Use real-time chat to communicate with assigned electrician
6. Access AI Electrician for immediate guidance

### For Electricians

1. Register/Login with electrician account
2. Navigate to Mechanic Dashboard
3. View available service requests
4. Accept jobs that match your expertise
5. Communicate with customers through integrated chat
6. Update job status and complete work

## 🔧 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── ai-electrician/    # AI chat interface
│   └── support/           # Support and help pages
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── chat/             # Chat components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
└── public/               # Static assets
```

## 🔒 Security Features

- Firebase Authentication with email verification
- Secure HTTP-only cookies for session management
- Input validation and sanitization
- Protected API routes
- Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Aman Kumar**

- Email: [amanjee8055@gmail.com](mailto:amanjee8055@gmail.com)
- LinkedIn: [aman-kumar-7a82432a4](https://www.linkedin.com/in/aman-kumar-7a82432a4)
- GitHub: [JuTechHub](https://github.com/JuTechHub)

## 🚨 Important Safety Note

This platform provides electrical guidance for educational purposes. For complex electrical work, always consult with licensed professionals. Safety first!

## 📞 Support

For technical support or questions about the platform, please reach out through:

- Email: amanjee8055@gmail.com
- Emergency Line: 9905048916

---

Made with ❤️ by Aman Kumar
