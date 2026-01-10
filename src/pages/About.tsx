import { Sparkles, Heart, Shield, TrendingUp } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-aesthetic">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-soft border border-white/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">About Us</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Kate Aesthetic
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Your destination for curated fashion that speaks to modern aesthetics. We believe in offering unique style variations that empower you to express your individuality through carefully selected pieces.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
              <div className="w-12 h-12 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide fashion enthusiasts with a seamless shopping experience, offering quality products with diverse color and size options. We're committed to making contemporary fashion accessible, affordable, and enjoyable for everyone.
              </p>
            </div>

            <div className="p-8 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
              <div className="w-12 h-12 mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the go-to platform for aesthetic fashion in Nigeria, recognized for our curated collections, customer-first approach, and commitment to delivering trend-forward pieces that celebrate individual style and self-expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We stand by values that ensure every customer has an exceptional experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Curated Quality</h3>
              <p className="text-sm text-muted-foreground">
                Every piece in our collection is handpicked for quality, style, and versatility. We ensure you get value for your money with products that last.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Shopping</h3>
              <p className="text-sm text-muted-foreground">
                Your security is our priority. We offer safe payment methods and protect your personal information with industry-standard encryption.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card backdrop-blur-soft">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer First</h3>
              <p className="text-sm text-muted-foreground">
                Your satisfaction drives everything we do. From fast checkout to instant WhatsApp notifications, we make shopping effortless and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="p-8 md:p-12 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Kate Aesthetic was born from a passion for modern fashion and a vision to make style accessible to everyone. We understand that fashion is more than just clothing—it's a form of self-expression, confidence, and creativity.
              </p>
              <p>
                What sets us apart is our commitment to offering multiple variants for each product. Whether you're looking for a specific color to match your mood or a size that fits perfectly, we've got you covered. Our platform is designed to give you the freedom to explore and choose what truly resonates with you.
              </p>
              <p>
                Based in Nigeria, we serve fashion enthusiasts who appreciate quality, variety, and convenience. Every order is handled with care, and we keep you updated via WhatsApp so you're always in the loop.
              </p>
              <p>
                Join our growing community of style-conscious shoppers. Discover pieces that speak to your aesthetic, enjoy seamless checkout, and experience fashion shopping the way it should be—simple, exciting, and tailored to you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
