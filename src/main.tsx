/**
 * Application entry point - Bootstraps React app with strict mode and global styles
 * @file Main application renderer
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
