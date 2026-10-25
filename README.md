# TP & FILS Services SARL: site web

Site officiel (aperçu) de **TP & FILS Services SARL**, Port de Douala, Cameroun. Fondée en 2014 par M. Pierre TALLA.

**Aperçu :** https://ftalla18.github.io/tpfils-services/

## Contenu
- **Français par défaut, bouton FR / EN** en haut de page (le choix est mémorisé).
- 12 services : pneumatiques (spécialité), transport routier national & international, logistique & entreposage, dédouanement, camions Hiab, huiles & lubrifiants, vidange & graissage, garage camions & voitures, pièces détachées, location de véhicules, mise à disposition de personnel, laverie moderne.
- Section fondateur, valeurs (Rapidité · Sécurité · Efficacité · Professionnalisme), FAQ, carte, réseaux sociaux.
- **Demande de devis** : le formulaire s'ouvre directement dans WhatsApp (ou par e-mail), prêt à envoyer.
- **Assistant (chatbot)** : répond en français ou en anglais, ton professionnel et chaleureux, uniquement à partir des informations de l'entreprise. Il n'invente jamais de prix : il oriente vers WhatsApp / téléphone. Aucun compte, aucune clé, aucun frais.

## Modifier le contenu
Toutes les informations (services, téléphones, adresse, horaires, FAQ, fondateur) sont dans **`js/knowledge.js`**. Une modification met à jour la page ET l'assistant.

## Photos
- `assets/img/pierre-talla.jpg` : photo du fondateur (affichée automatiquement si présente).
- `assets/img/logo-tp-services.png` : nouveau logo (utilisé automatiquement si présent, sinon l'ancien logo).
- Photos d'illustration : Wikimedia Commons (licences CC, crédits en bas de page). À remplacer idéalement par de vraies photos de l'entreprise.

## Mise en ligne sur Google
La ligne `<meta name="robots" content="noindex, nofollow">` dans `index.html` cache le site des moteurs de recherche pendant l'aperçu. La supprimer une fois le site validé.

## Lancer en local
```bash
python3 -m http.server 8000   # puis ouvrir http://localhost:8000
```
