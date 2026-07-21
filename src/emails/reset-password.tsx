import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

interface ResetPasswordEmailProps {
  lien: string;
}

export default function ResetPasswordEmail({ lien }: ResetPasswordEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Réinitialisation de votre mot de passe SwiftSaaS</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f6f6f6" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "8px" }}>
          <Heading style={{ fontSize: "20px" }}>Réinitialisation du mot de passe</Heading>
          <Text>
            Vous avez demandé la réinitialisation de votre mot de passe. Ce lien est valable 1 heure.
          </Text>
          <Button
            href={lien}
            style={{
              backgroundColor: "#18181b",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Réinitialiser mon mot de passe
          </Button>
          <Text style={{ fontSize: "12px", color: "#666" }}>
            Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
