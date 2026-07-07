# The-Suit.co

A modern, professional Next.js web application built with TypeScript, featuring a comprehensive UI component library and responsive design.

## Overview

The-Suit.co is a full-featured web application that leverages cutting-edge technologies to deliver a seamless user experience. Built with Next.js 16, React 19, and TypeScript, this project combines powerful backend capabilities with an intuitive frontend interface.

## 🚀 Tech Stack

### Core Framework
- **Next.js** 16.2.6 - React framework for production
- **React** 19 - UI library
- **TypeScript** 5.7.3 - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS** 4.2.0 - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library
- **Class Variance Authority** - CSS-in-JS utility for managing component variants
- **CLSX** - Utility for constructing className strings

### Form & Validation
- **React Hook Form** 7.54.1 - Performant form handling
- **Zod** 3.24.1 - TypeScript-first schema validation
- **@hookform/resolvers** 3.9.1 - Form validation resolver integration

### UI Components & Libraries
- **Recharts** 2.15.0 - Chart and graph library
- **Embla Carousel** 8.6.0 - Carousel component
- **React Day Picker** 9.13.2 - Date picker component
- **Input OTP** 1.4.2 - OTP input component
- **Sonner** 1.7.1 - Toast notifications
- **Vaul** 1.1.2 - Drawer component
- **React Resizable Panels** 2.1.7 - Resizable panel layout

### Additional Tools
- **next-themes** 0.4.6 - Theme provider and toggling
- **@vercel/analytics** 1.6.1 - Vercel analytics integration
- **date-fns** 4.1.0 - Date utility library
- **tailwind-merge** 3.3.1 - Merge Tailwind CSS classes
- **PostCSS** 8.5.0 - CSS transformations
- **Autoprefixer** 10.4.20 - CSS vendor prefix support

## 📋 Features

- **Responsive Design** - Fully responsive and mobile-friendly interface
- **Dark Mode Support** - Theme switching capabilities with next-themes
- **Rich Component Library** - Comprehensive Radix UI components for building complex interfaces
- **Form Handling** - Powerful form management with validation
- **Data Visualization** - Chart components for data representation
- **Accessibility** - Built with accessibility best practices using Radix UI
- **Type Safety** - Full TypeScript support throughout the application
- **Analytics** - Integrated Vercel analytics for tracking

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AditiiJ8/The-Suit.co.git
   cd The-Suit.co
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5000` to view the application.

## 🛠️ Development

### Available Scripts

- **`npm run dev`** - Start development server on port 5000
- **`npm run build`** - Build the application for production
- **`npm start`** - Start the production server
- **`npm run lint`** - Run ESLint to check code quality

### Project Structure

```
The-Suit.co/
├── app/                 # Next.js app directory (routes)
├── components/          # React components
├── lib/                 # Utility functions and helpers
├── public/              # Static assets
├── styles/              # Global styles
├── .eslintrc           # ESLint configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## 🎨 Styling & Customization

This project uses **Tailwind CSS** with a modern configuration. The design system is built on top of **Radix UI** primitives, providing:

- Unstyled, accessible components
- Customizable styling through Tailwind utilities
- Consistent spacing and typography scales
- Dark mode support out of the box

## 🔧 Configuration Files

- **`tailwind.config.js`** - Tailwind CSS configuration and theme customization
- **`postcss.config.js`** - PostCSS plugins including Tailwind and Autoprefixer
- **`tsconfig.json`** - TypeScript compiler options
- **`.eslintrc`** - ESLint linting rules

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

#### Environment Variables
If your project requires environment variables, add them in the Vercel dashboard under **Settings > Environment Variables**.

### Deploy Anywhere

The application can also be deployed to any Node.js hosting provider:

```bash
npm run build
npm start
```

## 📄 License

This project is available under the MIT License.

## 👨‍💻 Author

Created by [AditiiJ8](https://github.com/AditiiJ8)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, issues, or questions, please open an issue in the [GitHub repository](https://github.com/AditiiJ8/The-Suit.co/issues).

---

**Happy coding! 🎉**
