'use client'

// Icons as SVG components
const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
)

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
)

const UtensilsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
)

const TagsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const TypeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
)

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const HelpCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

export default function GuidePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="admin-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
          <BookIcon className="w-8 h-8 text-forest" />
        </div>
        <h1 className="text-3xl font-serif text-forest mb-2">Guide d&apos;Administration</h1>
        <p className="text-ink-soft">Bienvenue Oum Soumayya ! Ce guide vous explique comment utiliser votre interface d&apos;administration.</p>
        <p className="text-sm text-ink-soft/70 mt-2">
          Accès : <a href="https://monremede.com/gestion-mon-remede-oum" className="text-gold hover:underline">monremede.com/gestion-mon-remede-oum</a>
        </p>
      </div>

      {/* Navigation rapide */}
      <div className="admin-card p-6">
        <h2 className="text-lg font-semibold text-forest mb-4">Navigation rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="#blog" className="flex items-center gap-2 p-3 rounded-lg bg-forest/5 hover:bg-forest/10 transition-colors text-forest">
            <FileTextIcon className="w-5 h-5" />
            <span>Blog</span>
          </a>
          <a href="#recettes" className="flex items-center gap-2 p-3 rounded-lg bg-forest/5 hover:bg-forest/10 transition-colors text-forest">
            <UtensilsIcon className="w-5 h-5" />
            <span>Recettes</span>
          </a>
          <a href="#categories" className="flex items-center gap-2 p-3 rounded-lg bg-forest/5 hover:bg-forest/10 transition-colors text-forest">
            <TagsIcon className="w-5 h-5" />
            <span>Catégories</span>
          </a>
          <a href="#images" className="flex items-center gap-2 p-3 rounded-lg bg-forest/5 hover:bg-forest/10 transition-colors text-forest">
            <ImageIcon className="w-5 h-5" />
            <span>Images</span>
          </a>
        </div>
      </div>

      {/* Section Blog */}
      <section id="blog" className="admin-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <FileTextIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-forest">Gérer les Articles de Blog</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-forest mb-2">Voir tous les articles</h3>
            <ol className="list-decimal list-inside space-y-1 text-ink-soft">
              <li>Cliquez sur <strong>Blog</strong> dans le menu</li>
              <li>Utilisez les filtres : <em>Tous</em>, <em>Publiés</em>, <em>Brouillons</em></li>
              <li>Utilisez la barre de recherche pour trouver un article</li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium text-forest mb-2">Créer un nouvel article</h3>
            <ol className="list-decimal list-inside space-y-1 text-ink-soft">
              <li>Cliquez sur <strong>+ Nouvel article</strong></li>
              <li>Remplissez les champs (voir tableau ci-dessous)</li>
              <li>Cliquez sur <strong>Enregistrer</strong> (brouillon) ou <strong>Publier</strong></li>
            </ol>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Champ</th>
                  <th>Obligatoire</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Titre</td>
                  <td><span className="text-green-600">✓ Oui</span></td>
                  <td>Le titre de votre article</td>
                </tr>
                <tr>
                  <td className="font-medium">Slug</td>
                  <td><span className="text-green-600">✓ Oui</span></td>
                  <td>L&apos;adresse web (se génère automatiquement)</td>
                </tr>
                <tr>
                  <td className="font-medium">Extrait</td>
                  <td><span className="text-gray-400">Non</span></td>
                  <td>Résumé court pour les aperçus</td>
                </tr>
                <tr>
                  <td className="font-medium">Contenu</td>
                  <td><span className="text-gray-400">Non</span></td>
                  <td>Le texte complet de l&apos;article</td>
                </tr>
                <tr>
                  <td className="font-medium">Image principale</td>
                  <td><span className="text-gray-400">Non</span></td>
                  <td>Photo de couverture (ratio 16:9)</td>
                </tr>
                <tr>
                  <td className="font-medium">Galerie</td>
                  <td><span className="text-gray-400">Non</span></td>
                  <td>Photos supplémentaires</td>
                </tr>
                <tr>
                  <td className="font-medium">Catégories</td>
                  <td><span className="text-gray-400">Non</span></td>
                  <td>Pour organiser vos articles</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Pour supprimer un article</p>
                <p className="text-amber-700 text-sm">L&apos;article doit d&apos;abord être dépublié (brouillon). La suppression est définitive.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Recettes */}
      <section id="recettes" className="admin-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <UtensilsIcon className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-forest">Gérer les Recettes</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-forest mb-2">Créer une nouvelle recette</h3>
            <ol className="list-decimal list-inside space-y-1 text-ink-soft">
              <li>Cliquez sur <strong>+ Nouvelle recette</strong></li>
              <li>Remplissez les informations de base (titre, description)</li>
              <li>Ajoutez les détails (temps, portions, difficulté)</li>
              <li>Ajoutez les ingrédients un par un</li>
              <li>Ajoutez les étapes de préparation</li>
              <li>Ajoutez les bienfaits santé et conseils</li>
              <li>Cliquez sur <strong>Enregistrer</strong> ou <strong>Publier</strong></li>
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-forest mb-2">Ingrédients</h4>
              <p className="text-sm text-ink-soft mb-2">Pour chaque ingrédient, indiquez :</p>
              <ul className="text-sm text-ink-soft space-y-1">
                <li>• <strong>Quantité</strong> : Ex: &quot;2 c. à soupe&quot;, &quot;500g&quot;</li>
                <li>• <strong>Ingrédient</strong> : Ex: &quot;huile d&apos;olive&quot;</li>
                <li>• <strong>Notes</strong> : Ex: &quot;bio de préférence&quot;</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-forest mb-2">Étapes</h4>
              <p className="text-sm text-ink-soft mb-2">Pour chaque étape, indiquez :</p>
              <ul className="text-sm text-ink-soft space-y-1">
                <li>• <strong>Description</strong> : Les instructions</li>
                <li>• <strong>Astuce</strong> : Conseil pratique (optionnel)</li>
                <li>• <strong>Photo</strong> : Image de l&apos;étape (optionnel)</li>
              </ul>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Champ</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Temps de préparation</td>
                  <td>En minutes (ex: 15)</td>
                </tr>
                <tr>
                  <td className="font-medium">Temps de cuisson</td>
                  <td>En minutes (ex: 30)</td>
                </tr>
                <tr>
                  <td className="font-medium">Portions</td>
                  <td>Nombre de personnes (ex: 4)</td>
                </tr>
                <tr>
                  <td className="font-medium">Difficulté</td>
                  <td>Facile / Moyen / Difficile</td>
                </tr>
                <tr>
                  <td className="font-medium">Bienfaits santé</td>
                  <td>Les vertus de la recette</td>
                </tr>
                <tr>
                  <td className="font-medium">Conseils</td>
                  <td>Astuces et variantes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <section id="categories" className="admin-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <TagsIcon className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-forest">Gérer les Catégories</h2>
        </div>

        <div className="space-y-6">
          <p className="text-ink-soft">Les catégories vous permettent d&apos;organiser vos articles et recettes.</p>

          <div>
            <h3 className="font-medium text-forest mb-2">Créer une catégorie</h3>
            <ol className="list-decimal list-inside space-y-1 text-ink-soft">
              <li>Cliquez sur <strong>Catégories</strong> dans le menu</li>
              <li>Cliquez sur <strong>+ Nouvelle catégorie</strong></li>
              <li>Entrez le titre (le slug se génère automatiquement)</li>
              <li>Ajoutez une description (optionnel)</li>
              <li>Choisissez une couleur</li>
              <li>Cliquez sur <strong>Créer</strong></li>
            </ol>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#2D4A3E]/10">
              <div className="w-4 h-4 rounded-full bg-[#2D4A3E]"></div>
              <span className="text-sm">Forêt</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#8b9e7e]/10">
              <div className="w-4 h-4 rounded-full bg-[#8b9e7e]"></div>
              <span className="text-sm">Sauge</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#c4a35a]/10">
              <div className="w-4 h-4 rounded-full bg-[#c4a35a]"></div>
              <span className="text-sm">Or</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#d4aea5]/10">
              <div className="w-4 h-4 rounded-full bg-[#d4aea5]"></div>
              <span className="text-sm">Rose</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Suppression de catégorie</p>
                <p className="text-amber-700 text-sm">Vous ne pouvez pas supprimer une catégorie utilisée par des articles ou recettes. Retirez-la d&apos;abord de tous les contenus.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Images */}
      <section id="images" className="admin-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-forest">Gérer les Images</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-forest mb-3">Dimensions recommandées</h3>
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th>Type d&apos;image</th>
                    <th>Ratio</th>
                    <th>Dimensions idéales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">Article de blog</td>
                    <td>16:9</td>
                    <td>1200 × 675 pixels</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Recette</td>
                    <td>4:3</td>
                    <td>1200 × 900 pixels</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Galerie</td>
                    <td>4:3</td>
                    <td>800 × 600 pixels</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Étape de recette</td>
                    <td>4:3</td>
                    <td>800 × 600 pixels</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-forest mb-2">Comment ajouter une image</h3>
            <ol className="list-decimal list-inside space-y-1 text-ink-soft">
              <li>Cliquez sur la zone d&apos;upload (cadre en pointillés)</li>
              <li>Sélectionnez votre image sur votre ordinateur</li>
              <li>L&apos;image s&apos;affiche avec un aperçu</li>
              <li>Pour changer : cliquez sur l&apos;icône crayon</li>
              <li>Pour supprimer : cliquez sur l&apos;icône poubelle</li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium text-forest mb-2">Galerie d&apos;images</h3>
            <p className="text-ink-soft mb-2">Vous pouvez ajouter plusieurs photos supplémentaires :</p>
            <ul className="text-ink-soft space-y-1">
              <li>• Cliquez sur <strong>+ Ajouter des images</strong> ou glissez vos fichiers</li>
              <li>• Modifiez le texte alternatif (description pour l&apos;accessibilité)</li>
              <li>• Réorganisez en glissant-déposant les images</li>
              <li>• Supprimez avec l&apos;icône poubelle</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LightbulbIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Conseil pour les images</p>
                <p className="text-blue-700 text-sm">Utilisez des images nettes et bien éclairées. Compressez les fichiers trop lourds (idéalement moins de 500 Ko).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Éditeur */}
      <section id="editeur" className="admin-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <TypeIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-forest">L&apos;Éditeur de Texte</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-forest mb-3">Barre d&apos;outils</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="font-bold">G</span>
                <p className="text-xs text-ink-soft mt-1">Gras</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="italic">I</span>
                <p className="text-xs text-ink-soft mt-1">Italique</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="font-semibold">H2</span>
                <p className="text-xs text-ink-soft mt-1">Titre section</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="font-semibold">H3</span>
                <p className="text-xs text-ink-soft mt-1">Sous-titre</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span>•</span>
                <p className="text-xs text-ink-soft mt-1">Liste à puces</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span>1.</span>
                <p className="text-xs text-ink-soft mt-1">Liste numérotée</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span>&quot;&quot;</span>
                <p className="text-xs text-ink-soft mt-1">Citation</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <span>🔗</span>
                <p className="text-xs text-ink-soft mt-1">Lien</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-forest mb-3">Raccourcis clavier</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-ink-soft">Gras</span>
                <kbd className="px-2 py-1 bg-white rounded border text-sm">Ctrl + B</kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-ink-soft">Italique</span>
                <kbd className="px-2 py-1 bg-white rounded border text-sm">Ctrl + I</kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-ink-soft">Nouveau paragraphe</span>
                <kbd className="px-2 py-1 bg-white rounded border text-sm">Entrée</kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-ink-soft">Retour à la ligne</span>
                <kbd className="px-2 py-1 bg-white rounded border text-sm">Shift + Entrée</kbd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Conseils */}
      <section id="conseils" className="admin-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <LightbulbIcon className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-forest">Conseils Pratiques</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-forest mb-3">Checklist avant publication</h3>
            <div className="space-y-2">
              {[
                'Le titre est clair et accrocheur',
                'Le slug est correct (pas de caractères spéciaux)',
                'L\'image principale est de bonne qualité',
                'Le contenu est relu et sans fautes',
                'Les catégories sont assignées',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-ink-soft">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-forest mb-2">Organisation recommandée</h3>
            <ul className="text-ink-soft space-y-1">
              <li>• Créez des catégories claires (ex: &quot;Petit-déjeuner&quot;, &quot;Remèdes naturels&quot;)</li>
              <li>• Utilisez les mêmes catégories pour articles et recettes liés</li>
              <li>• Mettez en vedette vos meilleurs contenus</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section id="faq" className="admin-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <HelpCircleIcon className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="text-xl font-semibold text-forest">Questions Fréquentes</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Mon article n'apparaît pas sur le site ?",
              a: "Vérifiez qu'il est bien publié (pas en brouillon)."
            },
            {
              q: "Je ne peux pas supprimer un article ?",
              a: "Il faut d'abord le dépublier avant de pouvoir le supprimer."
            },
            {
              q: "Mon image ne s'affiche pas bien ?",
              a: "Vérifiez les dimensions recommandées (voir section Images)."
            },
            {
              q: "Je ne peux pas supprimer une catégorie ?",
              a: "Elle est utilisée par des articles ou recettes. Retirez-la d'abord de ces contenus."
            },
            {
              q: "Comment mettre un article en avant ?",
              a: "Cochez la case \"Article vedette\" ou \"Recette vedette\"."
            },
          ].map((item, i) => (
            <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-forest mb-1">{item.q}</p>
              <p className="text-ink-soft text-sm">→ {item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center text-sm text-ink-soft py-4">
        Guide créé pour Mon Remède — Dernière mise à jour : Janvier 2025
      </div>
    </div>
  )
}
