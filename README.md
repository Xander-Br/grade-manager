# Swiss Grade Manager

A modern and intuitive grade management application built with PocketBase and Vue.js designed for students in the Canton de Vaud educational system.

## Overview

Swiss Grade Manager helps students keep track of their academic performance by allowing them to record grades, calculate averages automatically, organize classes, and share a common calendar. While the system is designed to be integrated with existing Canton de Vaud technologies in the future, the current version functions as a standalone application where users manually manage their grades.

## Features

- **User Authentication**: Create an account or log in using existing credentials
- **Class Management**: Create and organize classes by semester, year, or category
- **Grade Tracking**: Add, edit, and delete grades for each subject
- **Automatic Average Calculation**: Real-time calculation of grade averages with customizable weighting
- **Shared Calendar**: Access a common calendar for important academic dates and deadlines
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Access your grades even without an internet connection
- **Data Visualization**: View your academic progress through intuitive charts and graphs

## Future Integrations

The application is designed to be easily integrated with Canton de Vaud's existing educational technologies:

- Integration with school authentication systems
- Automated grade synchronization (via API hooks when grades are entered in the official system)
- Direct communication with teachers and administrators

## Technology Stack

### Backend

- **PocketBase**: A lightweight open-source backend with built-in authentication, realtime database, and file storage
- **SQLite**: Database for local storage and synchronization

### Frontend

- **Vue.js 3**: Progressive JavaScript framework for building user interfaces
- **Composition API**: For better code organization and reusability
- **Pinia**: State management for Vue applications
- **Vue Router**: For navigation between different views
- **TailwindCSS**: For responsive and modern UI design

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PocketBase server

### Backend Setup

1. Download the latest PocketBase version from [pocketbase.io](https://pocketbase.io/docs/)

2. Extract and run the PocketBase executable:

   ```bash
   ./pocketbase serve
   ```

3. Access the admin UI at `http://localhost:8090/_/` and create an admin account

4. Import the provided collection schemas (available in the `pb_schema` directory)

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/swiss-grade-manager.git
   cd swiss-grade-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the environment variables by creating a `.env` file:

   ```
   VITE_PB_URL=http://localhost:8090
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. The application will be available at `http://localhost:3000`

## Project Structure

```
swiss-grade-manager/
├── public/                 # Static assets
├── pb_migrations/          # PocketBase migrations
├── pb_schema/              # PocketBase collection schemas
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Vue components
│   │   ├── auth/           # Authentication components
│   │   ├── calendar/       # Calendar components
│   │   ├── classes/        # Class management components
│   │   ├── grades/         # Grade tracking components
│   │   └── ui/             # Reusable UI components
│   ├── composables/        # Reusable composition functions
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia stores
│   ├── views/              # Page components
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── index.html              # HTML entry point
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── vite.config.js          # Vite configuration
```

## Database Collections

### Users

- Standard PocketBase users collection with additional fields for school and class information

### Classes

- id (auto-generated)
- name
- description
- teacher
- semester
- year
- created_by (relation to Users)
- created_at
- updated_at

### Subjects

- id (auto-generated)
- name
- description
- teacher
- coefficient (weight for average calculation)
- class_id (relation to Classes)
- created_at
- updated_at

### Grades

- id (auto-generated)
- title
- description
- value (numeric grade)
- weight (importance factor for weighted average)
- date
- subject_id (relation to Subjects)
- user_id (relation to Users)
- created_at
- updated_at

### CalendarEvents

- id (auto-generated)
- title
- description
- start_date
- end_date
- all_day (boolean)
- class_id (relation to Classes, optional)
- subject_id (relation to Subjects, optional)
- created_by (relation to Users)
- visible_to (select: "everyone", "class", "user")
- created_at
- updated_at

## API Endpoints

PocketBase automatically generates RESTful API endpoints for all collections. You can access them at:

- `http://localhost:8090/api/collections/users/records`
- `http://localhost:8090/api/collections/classes/records`
- `http://localhost:8090/api/collections/subjects/records`
- `http://localhost:8090/api/collections/grades/records`
- `http://localhost:8090/api/collections/calendarEvents/records`

## Authentication

The application uses PocketBase's built-in authentication system with email/password login. JWT tokens are used for maintaining sessions.

## Grade Calculation

Grades are calculated using weighted averages. Each subject can have a coefficient that affects its importance in the overall average. Within subjects, individual grades can have weights to reflect their importance.

```javascript
// Example calculation for subject average
const subjectAverage =
  grades.reduce((sum, grade) => sum + grade.value * grade.weight, 0) /
  grades.reduce((sum, grade) => sum + grade.weight, 0);

// Example calculation for overall average
const overallAverage =
  subjects.reduce(
    (sum, subject) => sum + subject.average * subject.coefficient,
    0
  ) / subjects.reduce((sum, subject) => sum + subject.coefficient, 0);
```

## Offline Support

The application implements a service worker for offline capabilities. Data is stored locally using IndexedDB and synchronized with the server when an internet connection is available.

## Deployment

### Production Build

```bash
npm run build
# or
yarn build
```

The production-ready files will be generated in the `dist` directory.

### Deployment Options

1. **PocketBase with embedded frontend**:

   - Build the Vue application
   - Copy the contents of the `dist` directory to PocketBase's `pb_public` folder
   - Run PocketBase

2. **Separate deployments**:
   - Deploy PocketBase on a server (Raspberry Pi, VPS, etc.)
   - Deploy the Vue frontend to a static hosting service (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/swiss-grade-manager](https://github.com/yourusername/swiss-grade-manager)

## Acknowledgements

- [PocketBase](https://pocketbase.io/)
- [Vue.js](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Canton de Vaud Department of Education](https://www.vd.ch/toutes-les-autorites/departements/departement-de-lenseignement-et-de-la-formation-professionnelle-def/)
