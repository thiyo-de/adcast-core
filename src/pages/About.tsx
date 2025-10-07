import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Video } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-lg bg-primary p-3">
              <Video className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">About AdCast</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              AdCast is your premier destination for discovering and watching amazing video content 
              from around the web. We curate the best videos across multiple categories to bring you 
              an exceptional viewing experience.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              We believe that great content should be accessible to everyone. Our platform connects 
              viewers with quality video content while supporting content creators through our 
              partnership network.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              <li>Curated video content across multiple categories</li>
              <li>High-quality streaming from trusted partner platforms</li>
              <li>Easy-to-use search and discovery features</li>
              <li>Mobile-friendly viewing experience</li>
              <li>Regular updates with fresh content</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Important Note</h2>
            <p className="text-muted-foreground">
              Some videos may require a VPN to access depending on your region, as content availability 
              varies based on geographical restrictions imposed by our partner platforms.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
