#!/usr/bin/env node
/**
 * Générateur automatique de SaaS — SwiftSaaS
 * -------------------------------------------
 * Usage :
 *   npm run generate:saas -- --nom "MonSaaS" --description "Un outil qui..." --dossier ../mon-saas
 *
 * Ce script :
 *  1. Copie le boilerplate SwiftSaaS vers un nouveau dossier
 *  2. Remplace le nom du produit dans les fichiers clés (package.json, metadata, landing page)
 *  3. (Optionnel) Si ANTHROPIC_API_KEY est définie, génère une accroche et une liste de
 *     fonctionnalités personnalisées pour la landing page à partir de la description fournie.
 *
 * Il ne remplace pas un vrai travail de personnalisation, mais fait gagner l'essentiel
 * du temps de mise en place (structure, config, textes de base).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RACINE_PROJET = path.resolve(__dirname, "..");

interface OptionsGeneration {
  nom: string;
  description: string;
  dossierSortie: string;
}

function parseArguments(): OptionsGeneration {
  const args = process.argv.slice(2);
  const obtenir = (cle: string, defaut: string) => {
    const index = args.indexOf(`--${cle}`);
    return index !== -1 && args[index + 1] ? args[index + 1] : defaut;
  };

  return {
    nom: obtenir("nom", "MonSaaS"),
    description: obtenir("description", "Un SaaS généré avec SwiftSaaS."),
    dossierSortie: path.resolve(
      process.cwd(),
      obtenir("dossier", `../${slugify(obtenir("nom", "mon-saas"))}`)
    ),
  };
}

function slugify(texte: string) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Dossiers/fichiers à ne pas copier vers le nouveau projet
const EXCLUSIONS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".env",
  "scripts",
]);

function copierRecursivement(source: string, destination: string) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  for (const entree of fs.readdirSync(source, { withFileTypes: true })) {
    if (EXCLUSIONS.has(entree.name)) continue;

    const cheminSource = path.join(source, entree.name);
    const cheminDestination = path.join(destination, entree.name);

    if (entree.isDirectory()) {
      copierRecursivement(cheminSource, cheminDestination);
    } else {
      fs.copyFileSync(cheminSource, cheminDestination);
    }
  }
}

function remplacerDansFichier(cheminFichier: string, remplacements: [RegExp, string][]) {
  if (!fs.existsSync(cheminFichier)) return;
  let contenu = fs.readFileSync(cheminFichier, "utf-8");
  for (const [motif, valeur] of remplacements) {
    contenu = contenu.replace(motif, valeur);
  }
  fs.writeFileSync(cheminFichier, contenu, "utf-8");
}

async function genererTexteMarketing(description: string): Promise<{
  accroche: string;
  fonctionnalites: string[];
} | null> {
  const cleApi = process.env.ANTHROPIC_API_KEY;
  if (!cleApi) {
    console.log(
      "ℹ️  ANTHROPIC_API_KEY non définie : les textes par défaut seront conservés."
    );
    return null;
  }

  try {
    const reponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": cleApi,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Voici la description d'un produit SaaS : "${description}".
Réponds UNIQUEMENT avec un JSON valide (sans texte autour, sans balises markdown) de la forme :
{"accroche": "une phrase d'accroche courte et percutante en français", "fonctionnalites": ["fonctionnalité 1", "fonctionnalité 2", "fonctionnalité 3", "fonctionnalité 4"]}`,
          },
        ],
      }),
    });

    const donnees = await reponse.json();
    const texte = donnees?.content?.find((bloc: any) => bloc.type === "text")?.text;
    if (!texte) return null;

    const nettoye = texte.replace(/```json|```/g, "").trim();
    return JSON.parse(nettoye);
  } catch (erreur) {
    console.warn("⚠️  Impossible de générer les textes marketing automatiquement :", erreur);
    return null;
  }
}

async function main() {
  const options = parseArguments();

  console.log(`\n🚀 Génération du SaaS "${options.nom}"`);
  console.log(`   Description : ${options.description}`);
  console.log(`   Dossier de sortie : ${options.dossierSortie}\n`);

  if (fs.existsSync(options.dossierSortie)) {
    console.error(`❌ Le dossier ${options.dossierSortie} existe déjà. Choisissez un autre --dossier.`);
    process.exit(1);
  }

  console.log("📁 Copie du boilerplate...");
  copierRecursivement(RACINE_PROJET, options.dossierSortie);

  console.log("✏️  Personnalisation des textes...");
  const slug = slugify(options.nom);

  // package.json
  remplacerDansFichier(path.join(options.dossierSortie, "package.json"), [
    [/"name": "swiftsaas"/, `"name": "${slug}"`],
    [/"description": ".*"/, `"description": "${options.description.replace(/"/g, "'")}"`],
  ]);

  // Metadata (titre / description du site)
  remplacerDansFichier(path.join(options.dossierSortie, "src/app/layout.tsx"), [
    [/title: ".*"/, `title: "${options.nom} — Propulsé par SwiftSaaS"`],
    [/description:\s*\n?\s*".*"/, `description: "${options.description.replace(/"/g, "'")}"`],
  ]);

  // Landing page : nom affiché dans le header
  remplacerDansFichier(path.join(options.dossierSortie, "src/app/page.tsx"), [
    [/SwiftSaaS<\/span>/, `${options.nom}</span>`],
    [
      /Lancez votre SaaS en quelques jours, pas en quelques mois/,
      options.nom,
    ],
  ]);

  const textesGeneres = await genererTexteMarketing(options.description);
  if (textesGeneres?.accroche) {
    remplacerDansFichier(path.join(options.dossierSortie, "src/app/page.tsx"), [
      [
        /Un boilerplate complet, en français, prêt pour la production[^<]*/,
        textesGeneres.accroche,
      ],
    ]);
    console.log("✨ Textes marketing personnalisés générés avec succès.");
  }

  console.log(`\n✅ Projet généré dans : ${options.dossierSortie}`);
  console.log("\nProchaines étapes :");
  console.log(`   cd ${path.relative(process.cwd(), options.dossierSortie)}`);
  console.log("   cp .env.example .env   # puis complétez les variables");
  console.log("   npm install");
  console.log("   npm run db:push");
  console.log("   npm run dev\n");
}

main();
