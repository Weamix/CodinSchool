import CodinSchoolError from '../erreur'

export class JetonInvalideError extends CodinSchoolError {
  constructor(jeton, explication, erreur) {
    super(
      'JETON_INVALIDE',
      'Un jeton de connexion invalide a été reçu.',
      {
        jeton
      },
      {
        explication,
        erreur
      }
    )
  }
}

export class AuthentificationRequiseError extends CodinSchoolError {
  constructor() {
    super('AUTH_REQUISE', 'Cette requête requière une authentification.')
  }
}

export class AccesInterditError extends CodinSchoolError {
  constructor(role, interdits) {
    super('ACCES_REFUSE', 'Droits d\'accès insuffisants.', {
      role,
      interdits
    })
  }
}

export class IdentifiantsNonReconnusError extends CodinSchoolError {
  constructor(email) {
    super('IDENTIFIANTS_INVALIDES', 'Adresse email ou mot de passe incorrect.', {
      email
    })
  }
}

export class EmailDejaUtiliseError extends CodinSchoolError {
  constructor(email) {
    super(
      'EMAIL_DEJA_UTILISE',
      `L'adresse ${email} est déjà utilisée. Merci d'en choisir une autre.`,
      {
        email
      }
    )
  }
}

export class EmailOuCodeInvalideError extends CodinSchoolError {
  constructor(email, code, attendu) {
    super('EMAIL_CODE_ACTIVATION_INVALIDE', 'Adresse email ou code d\'activation incorrect.', {
      email,
      code,
      attendu
    })
  }
}

export class CompteNonActiveError extends CodinSchoolError {
  constructor(id) {
    super('COMPTE_NON_ACTIVE', 'Ce compte n\'a pas encore été activé.', {
      id
    })
  }
}