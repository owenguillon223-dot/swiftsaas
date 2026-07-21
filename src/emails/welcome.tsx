import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

interface WelcomeEmailProps {
  nom: string;
}

export default function WelcomeEmail({ nom }: WelcomeEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Bienvenue sur SwiftSaaS !</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f6f6f6" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "8px" }}>
          <Heading style={{ fontSize: "20px" }}>Bienvenue, {nom} 👋</Heading>
          <Text>
            Merci de votre inscription sur SwiftSaaS. Votre compte est prêt, vous pouvez dès maintenant
            accéder à votre tableau de bord.
          </Text>
          <Text>À très vite,<br />L'équipe SwiftSaaS</Text>
        </Container>
      </Body>
    </Html>
  );
}
