import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Գեղեցկության Նոր Աշխարհ
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Բացահայտեք բնական գեղեցկությունը մեր պրեմիում կոսմետիկայի հավաքածուով
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="text-lg px-8">
                Գնումներ Սկսել
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Ավելին Իմանալ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">100% Բնական</h3>
              <p className="text-muted-foreground">
                Բոլոր մեր արտադրանքները պատրաստված են բնական բաղադրիչներից
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Պրեմիում Որակ</h3>
              <p className="text-muted-foreground">
                Բարձրորակ արտադրանք` մատչելի գներով
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Արագ Առաքում</h3>
              <p className="text-muted-foreground">
                Անվճար առաքում 30,000 դրամից ավել պատվերների դեպքում
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
          <CardContent className="py-12 text-center space-y-4">
            <h2 className="text-3xl font-bold">Սկսեք Ձեր Գեղեցկության Ճանապարհորդությունը</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Միացեք հազարավոր գոհ հաճախորդների, ովքեր վստահում են մեր արտադրանքին
            </p>
            <Link to="/products">
              <Button size="lg" className="mt-4">
                Ցուցակ Դիտել
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
