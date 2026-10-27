// Tout ce que le site et l'assistant savent sur TP & FILS Services SARL (FR + EN).
// Sources : fiche LinkedIn, Instagram @tpfils, Facebook, Pages Jaunes du Cameroun, fiche Google.
// Modifiez ici : la page et l'assistant se mettent à jour ensemble.

export const BIZ = {
  name: "TP & FILS Services SARL",
  short: "TP & Fils",
  founded: 2014,
  address: { fr: "Zone Portuaire de Douala, entre la Direction Générale de BRÖLI et le Garage SOCOMAR", en: "Douala Port Zone, between BRÖLI headquarters and the SOCOMAR garage" },
  po: "BP 4511 Douala, Littoral, Cameroun",
  maps: "https://www.google.com/maps/search/?api=1&query=TP%20%26%20FILS%20Services%20SARL%20Douala",
  mapEmbed: "https://www.google.com/maps?q=TP%20%26%20FILS%20Services%20SARL%2C%20Douala&output=embed",
  hours: { fr: "Lundi – Vendredi : 8h00 – 18h00 · Samedi : 9h00 – 16h00", en: "Monday – Friday: 8:00 AM – 6:00 PM · Saturday: 9:00 AM – 4:00 PM" },
  hoursShort: { fr: "Lun – Ven 8h–18h · Sam 9h–16h", en: "Mon – Fri 8am–6pm · Sat 9am–4pm" },
  rating: { score: "4,3", scoreEn: "4.3", count: 3 },
  socials: [
    { name: "Facebook", url: "https://www.facebook.com/p/TP-Fils-Services-Sarl-100070817411021/", icon: "f" },
    { name: "Instagram", url: "https://www.instagram.com/tpfils/", icon: "ig" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/societe-tp-fils-services-sarl/", icon: "in" },
  ],
  slogan: { fr: "Toujours à votre écoute pour une meilleure qualité de service.", en: "Always listening, for better quality of service." },
  tagline: { fr: "Plus qu'un service, une solution !", en: "More than a service, a solution!" },
  motto: { fr: "Toujours plus loin avec vous !", en: "Going further, together!" },
  promise: { fr: "Chez nous, la satisfaction de notre client est notre priorité.", en: "With us, customer satisfaction is our priority." },
};

export const SERVICES = [
  { id: "pneus", icon: "tire", img: "atelier-pneus.jpg", featured: true,
    fr: { name: "Pneumatiques : notre spécialité", short: "Pneus neufs toutes dimensions et toutes marques, montage, équilibrage, parallélisme.", body: "Spécialiste en pneumatique : vente de pneus neufs toutes dimensions et toutes marques pour voitures, 4x4, utilitaires, camions et engins. Montage et équilibrage pour une conduite sûre et confortable, réglage du parallélisme pour une tenue de route optimale et une usure réduite des pneus, réparation et regonflage. Envoyez-nous la dimension inscrite sur le flanc de votre pneu (ex. 315/80 R22.5) pour une disponibilité et un prix rapides." },
    en: { name: "Tires: our specialty", short: "New tires in every size and brand, fitting, balancing, wheel alignment.", body: "Tire specialists: new tires in every size and every brand for cars, SUVs, vans, trucks and heavy equipment. Fitting and balancing for a safe, comfortable drive, wheel alignment for optimal road holding and less tire wear, plus tire repair and inflation. Send us the size printed on your tire's sidewall (e.g. 315/80 R22.5) for quick availability and pricing." } },
  { id: "transport", icon: "truck", img: "camion-actros.jpg", featured: true,
    fr: { name: "Transport routier national & international", short: "Transport de marchandises au Cameroun et à l'international, avec suivi.", body: "Transport de marchandises par la route, au niveau national et international, au départ de la zone portuaire de Douala. Mise à disposition de camions et suivi de vos chargements en temps réel. Vos délais, notre priorité ; vos biens, notre engagement. Indiquez-nous la nature de la marchandise, le tonnage et la destination pour un devis." },
    en: { name: "National & international road freight", short: "Moving goods across Cameroon and abroad, with tracking.", body: "Road freight, national and international, departing from the Douala port zone. Trucks made available for your loads, with real-time tracking. Your deadlines are our priority; your goods are our commitment. Tell us the type of goods, tonnage and destination for a quote." } },
  { id: "logistique", icon: "warehouse", img: "portail-semi-remorque.jpg", featured: true,
    fr: { name: "Logistique, stockage & entreposage", short: "Stockage, entreposage, gestion de flux et distribution.", body: "Une logistique complète pour vos marchandises : stockage et entreposage, gestion de flux et distribution. De l'arrivée au port jusqu'à la livraison finale, nous organisons la chaîne pour vous." },
    en: { name: "Logistics, storage & warehousing", short: "Storage, warehousing, flow management and distribution.", body: "End-to-end logistics for your goods: storage and warehousing, flow management and distribution. From arrival at the port to final delivery, we organize the chain for you." } },
  { id: "dedouanement", icon: "doc", img: "port-chargement.jpg",
    fr: { name: "Dédouanement & assistance logistique", short: "Dédouanement, assistance logistique, conseil et accompagnement.", body: "Nos prestations de services vous accompagnent dans vos opérations : dédouanement de vos marchandises, assistance logistique, conseil et accompagnement. Un interlocuteur unique pour simplifier vos démarches au Port de Douala." },
    en: { name: "Customs clearance & logistics support", short: "Customs clearance, logistics support, advice and guidance.", body: "Our services support your operations: customs clearance for your goods, logistics assistance, advice and guidance. One point of contact to simplify your procedures at the Port of Douala." } },
  { id: "hiab", icon: "crane", img: "camion-grue.jpg",
    fr: { name: "Location de camions Hiab & levage", short: "Camions grue (Hiab) pour le levage et la manutention.", body: "Location de camions équipés de grue Hiab pour le levage, le chargement et la manutention de charges lourdes : conteneurs, matériaux, équipements. Indiquez-nous le poids, le type de charge et le lieu d'intervention." },
    en: { name: "Hiab crane truck rental & lifting", short: "Crane (Hiab) trucks for lifting and handling.", body: "Rental of trucks fitted with Hiab cranes for lifting, loading and handling heavy loads: containers, materials, equipment. Tell us the weight, type of load and the job site." } },
  { id: "lubrifiants", icon: "oil", img: "lubrifiants-elf.jpg",
    fr: { name: "Distribution d'huiles & lubrifiants", short: "Huiles moteur, boîte et hydraulique pour VL et PL.", body: "Distribution de pneus, d'huiles et de lubrifiants de qualité : huiles moteur, huiles de boîte et de pont, huiles hydrauliques et graisses, pour véhicules légers, poids lourds et engins. Nous vous conseillons le bon grade selon votre moteur et votre usage." },
    en: { name: "Oils & lubricants distribution", short: "Engine, gearbox and hydraulic oils for cars and trucks.", body: "Distribution of tires, oils and quality lubricants: engine oils, gearbox and axle oils, hydraulic oils and greases for cars, heavy trucks and equipment. We'll advise the right grade for your engine and how you use it." } },
  { id: "vidange", icon: "drop", img: "vidange-graissage.jpg",
    fr: { name: "Vidange & graissage", short: "Vidange des véhicules légers et lourds, graissage complet.", body: "Vidange moteur des véhicules légers (VL) et poids lourds (PL), remplacement des filtres et graissage complet. Un entretien régulier, c'est un moteur qui dure et moins de pannes sur la route." },
    en: { name: "Oil change & greasing", short: "Oil changes for cars and heavy trucks, full greasing.", body: "Engine oil changes for cars and heavy trucks, filter replacement and full greasing. Regular maintenance means a longer engine life and fewer breakdowns on the road." } },
  { id: "garage", icon: "wrench", img: "camions-entree.jpg",
    fr: { name: "Garage camions & petites voitures", short: "Entretien et réparation des poids lourds et des véhicules légers.", body: "Notre garage prend en charge l'entretien et la réparation des camions comme des petites voitures : diagnostic, mécanique, maintenance préventive. Idéal pour les particuliers, les transporteurs et les flottes d'entreprise." },
    en: { name: "Truck & car garage", short: "Maintenance and repair for heavy trucks and cars.", body: "Our garage handles maintenance and repair for trucks and cars alike: diagnostics, mechanical work and preventive maintenance. Ideal for individuals, hauliers and company fleets." } },
  { id: "pieces", icon: "gear", img: null,
    fr: { name: "Pièces détachées & accessoires", short: "Pièces et accessoires pour véhicules légers et lourds.", body: "Pièces détachées et accessoires automobiles pour véhicules légers et poids lourds. Dites-nous la marque, le modèle et la pièce recherchée : nous vérifions la disponibilité pour vous." },
    en: { name: "Spare parts & accessories", short: "Parts and accessories for cars and heavy vehicles.", body: "Spare parts and vehicle accessories for cars and heavy trucks. Tell us the make, model and part you need and we'll check availability for you." } },
  { id: "location", icon: "car", img: null,
    fr: { name: "Location de véhicules", short: "Véhicules et 4x4 en location pour vos déplacements.", body: "Location de véhicules, dont des 4x4 et SUV, pour vos déplacements professionnels ou personnels. Contactez-nous avec vos dates et le type de véhicule souhaité." },
    en: { name: "Vehicle rental", short: "Cars and 4x4s for rent for your trips.", body: "Vehicle rental, including 4x4s and SUVs, for business or personal travel. Contact us with your dates and the type of vehicle you need." } },
  { id: "personnel", icon: "team", img: null,
    fr: { name: "Mise à disposition de personnel", short: "Chauffeurs, manutentionnaires et techniciens pour vos opérations.", body: "Mise à disposition de personnel qualifié pour vos opérations : une équipe à votre service, formée au professionnalisme et à la sécurité. Décrivez-nous votre besoin (profils, durée, lieu)." },
    en: { name: "Staffing", short: "Drivers, handlers and technicians for your operations.", body: "Qualified staff for your operations: a team at your service, trained in professionalism and safety. Tell us what you need (profiles, duration, location)." } },
  { id: "laverie", icon: "wash", img: "lavage-auto.jpg",
    fr: { name: "Laverie moderne", short: "Lavage de véhicules légers et lourds.", body: "Une laverie moderne pour rendre à votre véhicule, voiture ou camion, toute sa propreté. Pratique pendant que votre véhicule est chez nous pour l'entretien." },
    en: { name: "Modern vehicle wash", short: "Washing for cars and heavy vehicles.", body: "A modern wash bay to get your car or truck clean again. Handy while your vehicle is with us for maintenance." } },
];

// Nos valeurs (supports marketing de l'entreprise)
export const WHY = [
  { icon: "bolt", fr: ["Rapidité", "Vos délais, notre priorité."], en: ["Speed", "Your deadlines, our priority."] },
  { icon: "shield", fr: ["Sécurité", "Vos biens, notre engagement."], en: ["Safety", "Your goods, our commitment."] },
  { icon: "gear", fr: ["Efficacité", "Des solutions durables."], en: ["Efficiency", "Lasting solutions."] },
  { icon: "team", fr: ["Professionnalisme", "Une équipe à votre service."], en: ["Professionalism", "A team at your service."] },
];

// Photos réelles de l'entreprise (galerie « Nos installations »)
export const GALLERY = [
  { img: "camion-actros.jpg", fr: "Un de nos camions Mercedes-Benz Actros", en: "One of our Mercedes-Benz Actros trucks" },
  { img: "siege-panneaux.jpg", fr: "Notre siège en zone portuaire", en: "Our headquarters in the port zone" },
  { img: "camion-grue.jpg", fr: "Camion équipé d'une grue Hiab", en: "Truck fitted with a Hiab crane" },
  { img: "atelier-pneus.jpg", fr: "Atelier pneumatiques : montage et équilibrage", en: "Tire workshop: fitting and balancing" },
  { img: "camions-entree.jpg", fr: "Entretien des camions à l'entrée du site", en: "Truck maintenance at the site entrance" },
  { img: "lubrifiants-elf.jpg", fr: "Huiles et lubrifiants disponibles sur place", en: "Oils and lubricants in stock" },
  { img: "pneus-poids-lourds.jpg", fr: "Pneus poids lourds neufs", en: "New heavy-truck tires" },
  { img: "portail-semi-remorque.jpg", fr: "Semi-remorque devant nos locaux", en: "Semi-trailer in front of our premises" },
  { img: "equilibreuse.jpg", fr: "Équilibreuse de roues", en: "Wheel balancer" },
  { img: "siege-facade.jpg", fr: "Nos locaux, Douala", en: "Our premises, Douala" },
  { img: "camion-renault.jpg", fr: "Camion à l'entrée du site", en: "Truck at the site entrance" },
  { img: "restaurant.jpg", fr: "Espace restauration sur place", en: "On-site dining area" },
];

export const FOUNDER = {
  name: "Pierre TALLA",
  fr: { role: "Fondateur & Directeur Général", text: "Fondée en 2014 par M. Pierre TALLA, TP & FILS Services SARL est devenue une entreprise camerounaise de référence dans le transport, la logistique et les services au Port de Douala, avec aujourd'hui plus de 55 collaborateurs. Sa vision : offrir aux particuliers comme aux entreprises un partenaire de confiance, capable de tout gérer sous un même toit, des pneumatiques jusqu'au dédouanement.", quote: "Merci pour votre leadership, votre vision et votre engagement sans faille qui font de notre entreprise une référence dans le transport, la logistique et les services.", quoteBy: "L'équipe de TP & FILS Services SARL" },
  en: { role: "Founder & Managing Director", text: "Founded in 2014 by Mr. Pierre TALLA, TP & FILS Services SARL has become a leading Cameroonian company in transport, logistics and services at the Port of Douala, with a team of 55+ professionals today. His vision: give individuals and businesses a trusted partner that can handle everything under one roof, from tires to customs clearance.", quote: "Thank you for your leadership, your vision and your unwavering commitment, which make our company a reference in transport, logistics and services.", quoteBy: "The TP & FILS Services SARL team" },
};

export const FAQ = [
  { fr: ["Où êtes-vous situés ?", "Dans la Zone Portuaire de Douala, entre la Direction Générale de BRÖLI et le Garage SOCOMAR. Boîte postale : BP 4511 Douala."], en: ["Where are you located?", "In the Port Zone of Douala, between BRÖLI headquarters and the SOCOMAR garage. P.O. Box: BP 4511 Douala."] },
  { fr: ["Quels sont vos horaires ?", "Du lundi au vendredi de 8h00 à 18h00, et le samedi de 9h00 à 16h00 (heure du Cameroun). Pour une urgence, appelez-nous ou écrivez sur WhatsApp."], en: ["What are your hours?", "Monday to Friday 8:00 AM to 6:00 PM, and Saturday 9:00 AM to 4:00 PM (Cameroon time). For an emergency, call or message us on WhatsApp."] },
  { fr: ["Vous travaillez sur les camions et poids lourds ?", "Oui. Garage, pneus, vidange, graissage et pièces pour véhicules légers ET poids lourds."], en: ["Do you work on trucks and heavy vehicles?", "Yes. Garage, tires, oil changes, greasing and parts for cars AND heavy trucks."] },
  { fr: ["Comment obtenir un prix ?", "Les prix dépendent de la dimension, de la marque ou du volume. Écrivez-nous sur WhatsApp ou appelez-nous : nous vous répondons rapidement avec un devis."], en: ["How do I get a price?", "Prices depend on size, brand or volume. Message us on WhatsApp or call: we'll get back to you quickly with a quote."] },
  { fr: ["Faites-vous le dédouanement ?", "Oui. Nos prestations incluent le dédouanement, l'assistance logistique, le conseil et l'accompagnement au Port de Douala."], en: ["Do you handle customs clearance?", "Yes. Our services include customs clearance, logistics assistance, advice and guidance at the Port of Douala."] },
  { fr: ["Transportez-vous à l'international ?", "Oui : transport routier de marchandises national et international, avec suivi en temps réel de vos chargements."], en: ["Do you transport internationally?", "Yes: national and international road freight, with real-time tracking of your loads."] },
  { fr: ["Louez-vous des camions grue ?", "Oui, nous proposons la location de camions Hiab (camions grue) pour le levage et la manutention."], en: ["Do you rent crane trucks?", "Yes, we rent Hiab crane trucks for lifting and handling."] },
  { fr: ["Travaillez-vous avec les entreprises ?", "Oui : transporteurs, flottes d'entreprise, chantiers et industriels. Nous proposons aussi des prestations de services et industrielles."], en: ["Do you work with companies?", "Yes: hauliers, company fleets, worksites and industry. We also provide business and industrial services."] },
];
