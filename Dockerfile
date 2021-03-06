# Sert à créer une image Docker.

# Un image Docker est immuable, c'est-à-dire qu'elle ne peut être modifiée après création.
# Pour la mettre à jour, il faut donc en créer une nouvelle.

# Les images Docker servent de « base » à tout container Docker.
# En effet, tous les containers créé avec la même image auront les mêmes fichiers lors de leur premier lancement.
# En pratique, lorsqu'un container est créé, il fait une copie de l'image initiale, permettant à plusieurs
# containers avec la même image initiale d'avoir leurs propres fichiers.

# Pour chaque ligne d'un Dockerfile, Docker crée un container avec comme image initiale, l'image résultant
# de l'éxécution du container associé à la ligne précédente.

# L'image retournée par la dernière ligne est la nouvelle image créée.

# On indique que l'image que l'on est en train de construire reprend les
# fichiers et la configuration de l'image « node:10-alpine ».
# NOTE : Il s'agit d'une version allégée d'un système d'exploitation Linux.
FROM node:10-alpine AS codinschool_node

RUN apk add --update g++ make python

FROM codinschool_node

WORKDIR /usr/src/app

COPY . .

RUN npm i -D && npm run build

CMD [ "npm", "run", "servir" ]
