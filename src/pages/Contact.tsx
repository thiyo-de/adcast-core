import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gradient">Contact Us</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Have a question or feedback? We'd love to hear from you. Fill out the form below 
            and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input id="name" type="text" placeholder="Your name" required />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <Input id="subject" type="text" placeholder="What's this about?" required />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea 
                id="message" 
                placeholder="Tell us more..." 
                rows={6}
                required 
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
