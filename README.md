# Welcome to TinyHabits

## How can I edit & run this project locally?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps to run locally (Windows PowerShell friendly):

```powershell
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies (PowerShell note below).
# Use `npm.cmd` on Windows PowerShell if you see an execution policy error.
npm.cmd install

# Step 4: Start the development server with auto-reloading and an instant preview.
# Vite is configured to listen on port 8080 by default in this repo.
npm.cmd run dev

# To create a production build
npm.cmd run build

# To preview the production build
npm.cmd run preview
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Deploy using your preferred hosting provider (Vercel, Netlify, GitHub Pages, etc.). Follow the host's instructions for Vite/React deployments.
