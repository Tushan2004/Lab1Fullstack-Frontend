# Hello World React Project

This is a simple React application that communicates with a backend API to manage patient data. The application allows users to view a list of patients and create new patient entries.

## Project Structure

```
hello-world
├── index.html
├── package.json
├── vite.config.js
├── jsconfig.json
├── .gitignore
├── README.md
├── public
│   └── robots.txt
└── src
    ├── main.jsx
    ├── App.jsx
    ├── api
    │   └── patientsApi.js
    ├── components
    │   ├── PatientList.jsx
    │   └── PatientForm.jsx
    ├── pages
    │   └── PatientsPage.jsx
    ├── hooks
    │   └── usePatients.js
    ├── styles
    │   └── app.css
    └── utils
        └── fetcher.js
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd hello-world
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` (or the port specified in your terminal) to view the application.

## Usage

- The application displays a list of patients fetched from the backend API.
- You can add new patients using the form provided in the application.

## API Communication

The application communicates with the backend API through the functions defined in `src/api/patientsApi.js`. The following functions are available:

- `getPatients()`: Fetches the list of patients from the API.
- `createPatient(patient)`: Sends a new patient entry to the API.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.