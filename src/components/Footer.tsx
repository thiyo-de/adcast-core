import { Link } from "react-router-dom";
import { Video } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-12 sm:mt-20">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="rounded-lg bg-primary p-1.5 sm:p-2">
                <Video className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="text-base sm:text-lg font-heading font-bold text-gradient">AdCast</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover and watch amazing video content from around the web.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors inline-block py-1 min-h-[44px] flex items-center">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors inline-block py-1 min-h-[44px] flex items-center">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Admin</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors inline-block py-1 min-h-[44px] flex items-center">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AdCast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
