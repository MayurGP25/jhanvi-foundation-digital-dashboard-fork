# NGO Beneficiary Management Express Application

A complete web application built with Express.js that replicates the UI and functionality of the empower-connect project for managing NGO beneficiaries and service providers.

## Features

- **Dashboard Interface**: Clean, modern UI similar to the original empower-connect design
- **Beneficiary Management**: Add and view beneficiaries with their skills and details
- **Provider Management**: Manage service providers and their offerings
- **Skill Matching**: Automatically match beneficiaries with suitable service providers
- **Responsive Design**: Works well on desktop and mobile devices
- **No Authentication Required**: Direct access to the dashboard (as requested)

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Icons**: Lucide Icons
- **Styling**: Custom CSS with modern design principles

## Installation

1. Install dependencies:
```bash
cd ngo-express-app
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Or start the production server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ngo-express-app/
├── server.js              # Express server with API routes
├── package.json           # Project dependencies and scripts
├── public/               # Static files served by Express
│   ├── index.html        # Main dashboard UI
│   ├── styles.css        # Custom styles matching empower-connect design
│   └── script.js         # Frontend JavaScript for interactivity
└── README.md            # This file
```

## API Endpoints

- `GET /` - Serve the main dashboard
- `GET /api/beneficiaries` - Get all beneficiaries
- `POST /api/beneficiaries` - Add a new beneficiary
- `GET /api/providers` - Get all service providers
- `POST /api/providers` - Add a new provider
- `GET /api/skill-matching` - Get skill matches between beneficiaries and providers

## Usage

### Adding Beneficiaries
1. Navigate to the "Add Beneficiary" tab
2. Fill in the beneficiary's details including skills
3. Submit the form to add them to the system

### Managing Providers
1. Go to the "Providers" tab
2. Add new service providers with their offered services
3. View all existing providers in the table below

### Skill Matching
1. Switch to the "Skill Matching" tab
2. Click "Generate Matches" to see beneficiaries matched with suitable providers
3. Matches are based on overlapping skills between beneficiaries and provider services

## Sample Data

The application comes with sample beneficiaries and providers to demonstrate the functionality:

- **Beneficiaries**: John Doe (Plumbing, Electrician), Jane Smith (Cook, Maid)
- **Providers**: Tech Solutions Inc, Home Services Co

## Customization

You can easily customize:
- Skill categories in both `server.js` and `index.html`
- UI colors and styling in `styles.css`
- Additional form fields by modifying the HTML and corresponding API handlers

## License

MIT License
