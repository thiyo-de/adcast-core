import { Link } from "react-router-dom";
import { Video } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/60 mt-12 sm:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-primary p-1.5 shadow-md">
                <Video className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-heading font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                AdCast
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Discover and watch amazing video content from around the web.
            </p>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold mb-3 text-foreground text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground text-center sm:text-left">
              <li>
                <Link 
                  to="/terms" 
                  className="hover:text-foreground transition-colors duration-200 py-1 flex items-center"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="hover:text-foreground transition-colors duration-200 py-1 flex items-center"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold mb-3 text-foreground text-sm uppercase tracking-wider">
              Admin
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground text-center sm:text-left">
              <li>
                <Link 
                  to="/admin" 
                  className="hover:text-foreground transition-colors duration-200 py-1 flex items-center"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/60 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AdCast. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};