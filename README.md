# RTO Client Management System

A comprehensive web application for Regional Transport Office (RTO) agencies in India to manage client details and automate document expiry notifications.

## Features

### Dashboard
- **Total Clients Widget**: Shows the total number of registered clients
- **Expiring Documents Widget**: Displays clients with documents expiring within 30 days
- **SMS Alerts Status**: Shows the status of automated notification system
- **Current Month Display**: Shows current date and month

### Client Management
- **Add New Clients**: Complete form to add client personal and document information
- **View All Clients**: Search and filter through all registered clients
- **Update Client Details**: Edit existing client information
- **Delete Clients**: Remove clients from the system

### Document Tracking
- **Driving License**: Track license numbers and expiry dates
- **Vehicle Registration**: Monitor vehicle registration expiry
- **Insurance**: Track insurance policy expiry dates
- **Pollution Certificate (PUC)**: Monitor pollution certificate expiry

### SMS Notification System
- **30-Day Reminders**: Send SMS alerts 30 days before document expiry
- **25-Day Reminders**: Send SMS alerts 25 days before document expiry
- **20-Day Reminders**: Send SMS alerts 20 days before document expiry
- **SMS Logs**: Track all sent SMS notifications

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Notifications**: Sonner for toast messages
- **Date Handling**: date-fns library

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rto-client-management
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
# Create PostgreSQL database
createdb -h localhost rto_management

# Update .env file with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/rto_management"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
bun dev
```

The application will be available at `http://localhost:3000`

## Database Schema

### Clients Table
- Personal information (name, phone, email, address)
- Document details (license number, vehicle registration)
- Expiry dates for all documents
- Timestamps for creation and updates

### SMS Logs Table
- Client reference
- SMS content and type
- Delivery status
- Timestamp

## SMS Integration

The application includes a placeholder SMS system. To integrate with a real SMS provider:

1. Choose an SMS service provider (e.g., Twilio, MSG91, TextLocal)
2. Update the SMS API route (`/app/api/sms/route.ts`)
3. Add your SMS provider credentials to environment variables
4. Implement the actual SMS sending logic

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/rto_management"
# Add SMS provider credentials here when integrating
```

## Usage

1. **Dashboard**: View overview of clients and expiring documents
2. **Add Clients**: Use the "Add Client" button to register new clients
3. **Manage Clients**: Click "View All Clients" to see, search, and manage existing clients
4. **Send SMS**: Use the SMS notification buttons to send reminders to clients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
