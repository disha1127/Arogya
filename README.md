# KidTracker - Children's Health Management System

A comprehensive web application for tracking and managing children's health care needs.

## Features

- 👩‍⚕️ Symptom Checker
- 🍎 Diet Planner
- 📊 Health Tracker
- 💊 Medication Reminders
- 🏥 Hospital Locator
- 📜 Government Schemes Information
- 📚 Health Articles
- 📁 Medical Documents Management
- 🆘 Emergency SOS

## Tech Stack

- Frontend: React + TypeScript
- Backend: Express.js
- Database: Neon (PostgreSQL)
- UI: Radix UI + Tailwind CSS
- State Management: React Query

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- PostgreSQL database (We use Neon)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=your_database_connection_string
NODE_ENV=development
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/disha1127/kidtracker.git
cd kidtracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
- Create a database in [Neon](https://neon.tech)
- Update the DATABASE_URL in your .env file

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Start production server:
```bash
npm start
```

## Deployment

This application can be deployed to various platforms:

1. For the frontend:
   - GitHub Pages
   - Vercel
   - Netlify

2. For the backend:
   - Heroku
   - Railway
   - DigitalOcean

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 