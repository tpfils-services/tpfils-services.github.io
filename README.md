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
- Logo officiel extrait des supports marketing (`logo-tp-services.png`, fond transparent). Pas de photo du fondateur (à sa demande) : un emblème avec le logo et sa signature à la place.
- 14 vraies photos de l'entreprise (camions, siège, atelier pneus, lubrifiants, restaurant), retouchées et agrandies pour le web. Les originaux restent en local dans `assets/originals/` (non publiés).
- 3 photos d'illustration Wikimedia Commons (port de Douala, chargement, vidange), crédits en bas de page.

## Horaires & contact
Lundi – Vendredi 8h–18h · Samedi 9h–16h (heure du Cameroun). Téléphones et e-mail ne sont pas affichés en clair : les boutons WhatsApp / Appeler / E-mail ouvrent directement l’application (voir `js/contact.js`).

## Mise en ligne sur Google
La ligne `<meta name="robots" content="noindex, nofollow">` dans `index.html` cache le site des moteurs de recherche pendant l'aperçu. La supprimer une fois le site validé.

## Lancer en local
```bash
python3 -m http.server 8000   # puis ouvrir http://localhost:8000
```

## QR code
`qr/qr-tpfils.png` (QR seul, avec logo) et `qr/qr-tpfils-affiche.png` (affiche imprimable). Vérifiés avec un lecteur ZXing à toutes les tailles.
Pour changer l'adresse : `python qr/make_qr.py https://nouvelle-adresse/` (nécessite `pip install pillow "qrcode[pil]"`).
