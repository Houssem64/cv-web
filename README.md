# Portfolio Website with Admin Panel

A modern portfolio website to showcase your projects, built with Next.js and MongoDB. The site includes a responsive design and an admin panel to manage your project content.

## Features

- **Portfolio Showcase**: Present your projects in a visually appealing way
- **Admin Panel**: Secure dashboard to add, edit, and delete projects
- **Responsive Design**: Looks great on all devices (mobile, tablet, desktop)
- **Modern Stack**: Built with Next.js, Tailwind CSS, MongoDB, and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB connection (local or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_admin_password
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the site

### Build for Production

```bash
npm run build
npm start
```

## Admin Panel

Access the admin panel at `/admin/login`. Use the credentials you specified in your environment variables.

### Managing Projects

In the admin panel, you can:
- View all your projects
- Add new projects
- Edit existing projects
- Delete projects
- Mark projects as featured to display them on the homepage

## Project Structure

```
/src
  /app               # Next.js app directory with pages and routes
    /admin           # Admin panel pages
    /api             # API routes
    /projects        # Project pages
  /components        # Reusable React components
  /lib               # Utility functions and database connection
  /models            # Mongoose models
```

## Customization

### Styling

The website uses Tailwind CSS for styling. You can customize the design by modifying:
- `tailwind.config.js` - Change colors, fonts, and other theme settings
- `src/app/globals.css` - Global CSS styles

### Content

Edit the following files to customize your portfolio content:
- `src/app/page.tsx` - Homepage content
- `src/app/about/page.tsx` - About page content
- `src/app/contact/page.tsx` - Contact page content

## License

This project is licensed under the MIT License.
