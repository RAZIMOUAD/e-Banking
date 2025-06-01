export interface RegisterStep {
  id: number;
  title: string;
  description?: string;
  fields: string[]; // noms des contrôles du FormGroup à afficher pour cette étape
}

export const REGISTER_STEPS: RegisterStep[] = [
  {
    id: 1,
    title: 'Informations personnelles',
    description: 'Remplissez vos données personnelles de base',
    fields: ['nom', 'prenom', 'dateNaissance', 'genre', 'nationalite'],
  },
  {
    id: 2,
    title: 'Coordonnées de contact',
    description: 'Comment pouvons-nous vous joindre ?',
    fields: ['numTel', 'adresse', 'email'],
  },
  {
    id: 3,
    title: 'Sécurité du compte',
    description: 'Créez vos identifiants de connexion',
    fields: ['cin', 'password'],
  }
];
