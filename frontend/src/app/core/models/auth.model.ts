// 🔐 Représente les données envoyées lors d'une inscription
export interface RegisterPayload {
  nom: string;
  prenom: string;
  dateNaissance?: Date;
  genre?: string;
  nationalite?: string;
  numTel?: string;
  adresse?: string;
  cin?: string;
  email: string;
  password: string;
}

// 🔐 Représente les données envoyées lors d'une connexion
export interface LoginPayload {
  email: string;
  password: string;
}
// 🔐 JWT décodé
export interface DecodedToken {
  email?: string;
  sub?: string;
  roles?: string[];
  role?: string;
  [key: string]: any; // Flexibilité pour ajouter d'autres claims si besoin
}

// (Optionnel) 🔍 Pour vérifier l’état d’un compte
export interface AccountStatusResponse {
  email: string;
  isActivated: boolean;
  twoFactorEnabled?: boolean;
}
export interface AuthenticationResponse {
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  requires2FA?: boolean; // ✅ Ajoute cette propriété
}

