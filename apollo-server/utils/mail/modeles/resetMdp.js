/*
Données modifiables :
  - nom_utilisateur: Pseudo de l'utilisateur
  - lien_reset: Lien de réinitialisation de mot de passe
*/

export default `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Codinschool</title>
</head>

<body>
  <h1>CodinSchool</h1>
  <h2>Réinitialisation du mot de passe</h2>
  <p>
    Bonjour %nom_utilisateur%. Vous avez demandé la réinitialisation votre mot de passe de compte CodinSchool.
  </p>
  <p>
    Naviguer vers le lien suivant afin de réinitialiser le mot de passe de votre compte.
  </p>
  <p>
    <a href="%lien_reset%" target="_blank" rel="noopener noreferrer">%lien_reset%</a>
  </p>

  <p>Merci et à bientôt sur notre plateforme.</p>
  <p><strong>CodinSchool.</strong></p>
</body>
</html>
`
