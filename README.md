# Vespa Certificate Admin

A modern web application for generating and managing Vespa certificates. This application allows users to submit their information through a beautiful form interface and generates professional-looking certificates that can be downloaded or shared.

## Features

- 🚀 **Modern UI/UX** - Built with Next.js 14 and Tailwind CSS for a responsive and beautiful interface
- 📝 **Dynamic Form** - User-friendly form with real-time validation
- 📊 **Google Sheets Integration** - Automatically stores submissions in Google Sheets
- 🖼️ **Certificate Generation** - Creates professional certificate images
- 🔒 **Secure** - Server-side form submission handling
- 📱 **Fully Responsive** - Works on all device sizes

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Animation**: Framer Motion
- **Backend**: Next.js API Routes
- **Data Storage**: Google Sheets API
- **UI Components**: Radix UI Primitives with custom styling

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm or yarn
- Google Cloud Platform account with Google Sheets API enabled
- Google Service Account credentials

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vespa-certificate-admin.git
   cd vespa-certificate-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_key_json
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SHEET_NAME=Sheet1
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Google Sheets Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a service account and download the JSON key file
5. Share your Google Sheet with the service account email address
6. Copy the JSON content and add it to your `.env.local` file as `GOOGLE_SERVICE_ACCOUNT_KEY`

## Project Structure

```
vespa-certificate-admin/
├── app/                    # Next.js app directory
│   ├── api/                 # API routes for form submission
│   ├── components/          # Reusable components
│   ├── public/              # Static files (images, fonts)
│   ├── styles/             # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page with certificate form
├── components/             # Shared components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
└── public/                 # Public assets
```

## Environment Variables

| Variable Name | Description | Required |
|--------------|-------------|----------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google Service Account JSON key | Yes |
| `GOOGLE_SHEET_ID` | ID of the Google Sheet | Yes |
| `GOOGLE_SHEET_NAME` | Name of the worksheet | No (default: Sheet1) |

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

<p align="center">
  Made with ❤️ by Vespa Community
</p>
