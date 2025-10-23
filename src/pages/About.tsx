import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Truck, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Մեր Մասին</h1>
            <p className="text-xl text-muted-foreground">
              Beauty Shop - Ձեր վստահելի գործընկերը գեղեցկության աշխարհում
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8 space-y-6">
              <p className="text-lg leading-relaxed">
                Մենք նվիրված ենք բերելու ամենաբարձրորակ կոսմետիկական արտադրանքը 
                մեր հաճախորդներին։ Beauty Shop-ը հիմնադրվել է 2020 թվականին՝ 
                նպատակ ունենալով դարձնել պրեմիում գեղեցկության ապրանքները 
                մատչելի բոլորին։
              </p>
              <p className="text-lg leading-relaxed">
                Մեր բոլոր արտադրանքները մանրակրկիտ ընտրված են և փորձարկված 
                են բարձրագույն ստանդարտներով։ Մենք համագործակցում ենք միայն 
                վստահելի արտադրողների հետ, ովքեր կիսում են մեր արժեքները՝ 
                որակ, անվտանգություն և բնապահպանություն։
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Մեր Առաքելությունը</h3>
                <p className="text-muted-foreground">
                  Օգնել յուրաքանչյուր հաճախորդի զգալ իրեն գեղեցիկ և 
                  վստահ իր մաշկի մեջ բարձրորակ և անվտանգ արտադրանքներով։
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Մեր Արժեքները</h3>
                <p className="text-muted-foreground">
                  Ճշմարտությունը, որակը և հաճախորդների բավարարվածությունը 
                  մեր գործունեության հիմքն են։
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Անվճար Առաքում</h3>
                <p className="text-muted-foreground">
                  30,000 դրամից ավել պատվերների համար մենք առաջարկում 
                  ենք անվճար և արագ առաքում ամբողջ Հայաստանում։
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">100% Երաշխիք</h3>
                <p className="text-muted-foreground">
                  Մենք երաշխավորում ենք մեր բոլոր արտադրանքների 
                  ինքնատիպությունը և որակը։
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
