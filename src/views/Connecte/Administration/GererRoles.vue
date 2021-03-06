<template>
  <div class="ui container">
    <!-- Ecran de chargement de la page -->
    <div v-if="$apollo.queries.permissions.loading && $apollo.queries.roles.loading" class="ui text vertical segment container loading"></div>
    <!--/ Ecran de chargement de la page -->

    <!-- Contenu de la page -->
    <div v-else class="ui container">
      <!-- Modal de confirmation de suppression de rôle -->
      <sui-modal v-model="modalConfirmationSuppression" class="bgTransparent">
        <template v-if="suppressionRoleCible">
          <sui-modal-header>Supprimer le rôle "{{ suppressionRoleCible ? suppressionRoleCible.nom : '' }}"</sui-modal-header>
          <sui-modal-content>
            <sui-modal-description>
              <sui-header>Êtes-vous sûr de vouloir supprimer ce rôle ?</sui-header>
              <p>L'ensemble des utilisateurs possédant ce rôle n'auront plus accès aux permissions qui lui sont associées.</p>
              <p>Cette action est irréversible.</p>

              <div v-if="moi.roles.find(x => x.id === suppressionRoleCible.id)" class="mt-5">
                <h2>
                  <i class="exclamation triangle icon"></i> Attention !
                </h2>
                <h3>
                  Vous possédez le rôle à supprimer. Vérifiez que vous garderez la permission "GESTION_ROLE" après suppression
                  avec un autre de vos rôles. Dans le cas contraire vous n'aurez plus la possibilité d'éditer les rôles.
                </h3>
              </div>
            </sui-modal-description>
          </sui-modal-content>
          <sui-modal-actions>
            <sui-button secondary @click.native="modalConfirmationSuppression = false">Annuler</sui-button>
            <sui-button negative @click.native="supprimerRole(suppressionRoleCible)">Valider la suppression</sui-button>
          </sui-modal-actions>
        </template>
      </sui-modal>
      <!--/ Modal de confirmation de suppression de rôle -->

      <h2 class="ui center aligned header">
        <div class="content">
          Gestion des rôles
        </div>
      </h2>

      <!-- Tableau de gestion des rôles -->
      <table class="ui celled table table-center">
        <thead>
          <tr>
            <th>Effacer</th>
            <th>id</th>
            <th>Rôle</th>
            <!-- TODO: Placer des messages d'explication en title -->
            <th title="Un message d'explication (TODO)">Par défaut</th>

            <th v-for="(aPermission, index) in permissions" :key="'permission-' + index">
              {{ aPermission }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Liste des rôles et leur permission associée -->
          <ApolloMutation
            v-for="aRole in roles" :key="'role-' + aRole.id" tag="tr"
            :mutation="require('@/graphql/Administration/EditerRole.gql')"
            :variables="{
              id: aRole.id,
              role: {
                id: aRole.id,
                nom: aRole.nom,
                parDefaut: aRole.parDefaut,
                permissions: aRole.permissions
              }
            }"
            @error="chargerErreur"
            @done="cacheRole"
          >
            <!-- TODO: Alerte de notification de succès -->
            <!-- TODO: Loading de l'édition de rôle -->
            <template slot-scope="{ mutate }">
              <td>
                <!-- Bouton de suppression de rôle -->
                <button @click="demandeSuppression(aRole)" class="ui icon button negative tiny">
                  <i class="trash alternate icon"></i>
                </button>
                <!--/ Bouton de suppression de rôle -->
              </td>
              <td>{{ aRole.id }}</td>
              <td>
                <div class="ui small input">
                  <input
                    v-model="aRole.nom"
                    @blur="checkVide($event) && mutate()"
                    type="text"
                    class="ui input text-center"
                    placeholder="Nom du rôle"
                  />
                </div>
              </td>
              <td>
                <input type="checkbox" v-model="aRole.parDefaut" @change="mutate()" />
              </td>
              <td
                v-for="(aPermission, index) in permissions"
                :key="`role-${aRole.id}-permission-${index}`"
              >
                <input
                  type="checkbox"
                  :checked="possedePermission(aRole, aPermission)"
                  @change="togglePermission(aRole, aPermission)"
                />
              </td>
            </template>
          </ApolloMutation>
          <!--/ Liste des rôles et leur permission associée -->
        </tbody>
      </table>
      <!--/ Tableau de gestion des rôles -->

      <!-- Bouton d'ajout de rôle -->
      <div class="text-center">
        <router-link to="/Administration/creerRole/" class="ui button right labeled icon text-center" tag="button">
          <i class="plus icon"></i>
          Créer un rôle
        </router-link>
      </div>
      <!--/ Bouton d'ajout de rôle -->

      <Alerte ref="erreurs" :type-alerte="typeAlerte" />
    </div>
    <!--/ Contenu de la page -->
  </div>
</template>

<script>
import Utilisateur from '@/graphql/Utilisateur/Utilisateur.gql'
import { checkPermissions } from '@/functions'

import Alerte from '@/components/Alerte.vue'

import Permissions from '@/graphql/Administration/Permissions.gql'
import Roles from '@/graphql/Administration/Roles.gql'
import EditerRole from '@/graphql/Administration/EditerRole.gql'
import SupprimerRole from '@/graphql/Administration/SupprimerRole.gql'

export default {
  name: 'GererRoles',
  components: {
    Alerte
  },
  apollo: {
    moi: {
      query: Utilisateur,
      result: checkPermissions(['GESTION_ROLE'])
    },
    permissions: {
      query: Permissions,
      update({__type: { enumValues } }) {
        return enumValues.map(x => x.name)
      }
    },
    roles: Roles
  },
  data() {
    return {
      modalConfirmationSuppression: false,
      suppressionRoleCible: null,
      typeAlerte: 'Erreur'
    }
  },
  methods: {
    // Savoir si un rôle possède une permission
    possedePermission: (role, permission) => role.permissions.includes(permission),

    // Charger une erreur GraphQL envoyée par Apollo dans la liste des erreurs
    chargerErreur(errorObject) {
      const { gqlError } = errorObject
      if (!gqlError) return console.error(errorObject)

      // Affichage de l'erreur dans l'alerte
      this.$refs.erreurs.viderAlerte()
      this.typeAlerte = 'Erreur'
      this.$refs.erreurs.ajouterAlerte(gqlError.message)
    },

    // Vérifier que le champs n'est pas vide
    checkVide({ srcElement: { value } }) {
      if (value === '') {
        // Affichage de l'erreur dans l'alerte
        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Erreur'
        this.$refs.erreurs.ajouterAlerte('Le champs ne peut pas être vide.')
        return false
      }
      return true
    },

    // Afficher la modal de confirmation de suppression de rôle
    demandeSuppression(aRole) {
      this.modalConfirmationSuppression = true
      this.suppressionRoleCible = aRole
    },

    async togglePermission(aRole, aPermission) {
      const role = this.roles.find(x => x.id === aRole.id)

      const apolloClient = this.$apollo.provider.defaultClient
      await apolloClient.mutate({
        mutation: EditerRole,
        variables: {
          id: role.id,
          role: {
            id: role.id,
            nom: role.nom,
            parDefaut: role.parDefaut,
            permissions: this.possedePermission(role, aPermission)
              ? role.permissions.filter(x => x !== aPermission)
              : role.permissions.concat(aPermission)
          }
        },
        update: (_, gqlResponse) => this.cacheRole(gqlResponse)
      })
    },

    // Supprimer un rôle
    async supprimerRole(aRole) {
      const apolloClient = this.$apollo.provider.defaultClient
      await apolloClient.mutate({
        mutation: SupprimerRole,
        variables: {
          id: aRole.id
        },
        update: (store, { data: { supprimerRole: idRoleSupprime } }) => {
          const oldData = store.readQuery({ query: Roles })
          const index = oldData.roles.findIndex(x => x.id === idRoleSupprime)
          if (index !== -1) {
            oldData.roles.splice(index, 1)
            store.writeQuery({ query: Roles, data: oldData })

            this.modalConfirmationSuppression = false
            this.suppressionRoleCible = null
            this.$refs.erreurs.viderAlerte()
            this.typeAlerte = 'Succès'
            this.$refs.erreurs.ajouterAlerte('Le rôle a été supprimé.')
          }
        }
      })
    },

    // Mise à jour du rôle en cache
    cacheRole({ data: { editerRole: roleModif } }) {
      const apolloClient = this.$apollo.provider.defaultClient
      const data = apolloClient.readQuery({ query: Roles })
      const index = data.roles.findIndex(x => x.id === roleModif.id)
      if (index !== -1) {
        data.roles[index] = roleModif
        apolloClient.writeQuery({ query: Roles, data })

        this.$refs.erreurs.viderAlerte()
        this.typeAlerte = 'Succès'
        this.$refs.erreurs.ajouterAlerte(`Le rôle "${roleModif.nom}" a été modifié.`)
      }
    }
  }
}
</script>

<style scoped>
.table-center th, td {
  text-align: center !important;
}
th[title] {
  cursor: help !important;
}
.bgTransparent {
  background-color: transparent !important;
}
</style>
