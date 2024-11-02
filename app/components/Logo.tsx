import * as React from "react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center space-x-2 text-primary hover:text-primary/80"
      aria-label="Home"
    >
      <img src="/icons/hermetica-logo.png" alt="logo" className="w-8 h-8" />
      <span className="text-sm font-medium">
        {import.meta.env.VITE_APP_NAME}
      </span>
    </Link>
  );
}
