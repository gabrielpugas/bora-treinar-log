
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex flex-col gap-8">
      <section className="text-center py-10 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-workout">
          Bora Treinar
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Acompanhe seus treinos, registre suas cargas e acompanhe seu progresso
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-workout hover:opacity-90">
            <Link to="/gym">Treinos na Academia</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/home">Treinos em Casa</Link>
          </Button>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Academia</CardTitle>
            <CardDescription>Treinos organizados para equipamentos de academia</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm">
              Acesse treinos completos otimizados para ambiente de academia, com exercícios 
              específicos para cada grupo muscular.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/gym">Ver treinos de academia</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Em Casa</CardTitle>
            <CardDescription>Treinos que podem ser feitos em casa</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm">
              Acesse treinos que podem ser realizados em casa, com exercícios 
              adaptados para pouco ou nenhum equipamento.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/home">Ver treinos em casa</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Como Usar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">1. Escolha seu treino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Selecione entre treinos de academia ou em casa, depois escolha a semana e o dia.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">2. Execute o treino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize os exercícios, séries, repetições e observações para cada exercício.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">3. Registre as cargas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Anote as cargas utilizadas em cada exercício para acompanhar seu progresso.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
