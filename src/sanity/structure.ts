import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      // Blog section
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Articles'),
              S.documentTypeListItem('recipe').title('Recettes'),
              S.documentTypeListItem('category').title('Catégories'),
            ])
        ),

      S.divider(),

      // Boutique
      S.listItem()
        .title('Boutique')
        .child(
          S.list()
            .title('Boutique')
            .items([
              S.documentTypeListItem('product').title('Produits'),
              S.documentTypeListItem('testimonial').title('Témoignages'),
            ])
        ),

      S.divider(),

      // CRM / Prospects
      S.listItem()
        .title('CRM')
        .child(
          S.list()
            .title('CRM')
            .items([
              S.documentTypeListItem('questionnaireSubmission').title('Questionnaires'),
              S.documentTypeListItem('client').title('Clients'),
              S.documentTypeListItem('leadMagnetSubscriber').title('Abonnés Lead Magnet'),
            ])
        ),

      S.divider(),

      // Paramètres
      S.listItem()
        .title('Paramètres')
        .child(
          S.list()
            .title('Paramètres')
            .items([
              S.documentTypeListItem('author').title('Auteurs'),
            ])
        ),
    ])
