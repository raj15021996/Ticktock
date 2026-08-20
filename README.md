# Timesheet Management

A responsive timesheet management application built with Next.js, TypeScript, and Tailwind CSS.

The application allows users to log in, view their timesheets, filter timesheets by date range and status, view weekly details, and add, edit, and delete timesheet entries.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

Install the project dependencies:

```bash
npm install
```

## Run Development Server**

```bash
npm run dev
```

## Demo Login

# The application uses dummy credentials for login.
| Name            | Email                                             | Password       |
| --------------- | ------------------------------------------------- | -------------- |
| Raj Kumar       | [rajkumar@bitcot.com](mailto:rajkumar@bitcot.com) | `Bitcot@123`   |
| Avril Rodrigues | [avril@tentwenty.me](mailto:avril@tentwenty.me)   | `password@123` |
| Max Ray         | [max.ray@gmail.com](mailto:max.ray@gmail.com)     | `password@123` |


## Tech Used
- Next.js
- TypeScript
- React
- Tailwind CSS
- Axios
- React Day Picker
- js-cookie
- Lucide React
- React-toastella

## Features
- Login page with validation
- Protected routes
- Timesheet list
- Date range and status filters
- Pagination
- View weekly timesheet
- Add, edit and delete entries
- Mock APIs using Next.js API routes
- Responsive design

## Notes
- This project uses mock data and does not use a real database.
- Login and timesheet APIs are created using Next.js API routes.
- Timesheet data is stored in memory, so changes will reset when the server restarts.
- The login token is only for demo purposes.
- Date range filtering requires both start and end dates.

## Time Spent

Approximately 16 hours.

- Project setup and configuration: 1 hour
- UI development: 4 hours
- Responsive design: 2 hours
- Login and route protection: 1.5 hours
- Mock API development: 2.5 hours
- Axios integration: 1 hour
- Timesheet CRUD functionality: 2 hours
- Testing, bug fixing and cleanup: 2 hours