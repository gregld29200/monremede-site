'use client'

import { LabShell } from './components/LabShell'
import { VariantA } from './variants/VariantA'
import { VariantB } from './variants/VariantB'
import { VariantC } from './variants/VariantC'
import { VariantD } from './variants/VariantD'
import { VariantE } from './variants/VariantE'

const variants = [
  {
    id: 'A',
    name: 'Book Cover',
    description: 'Les guides sont présentés comme des couvertures de livres au centre. Design inspiré Apple, très épuré avec focus sur le produit.',
  },
  {
    id: 'B',
    name: 'Split Screen',
    description: 'Écran divisé avec contenu à gauche et visuel atmosphérique à droite. Design asymétrique moderne, style marque lifestyle.',
  },
  {
    id: 'C',
    name: 'Editorial',
    description: 'Style magazine de luxe avec typographie expressive et numéros surdimensionnés. Beaucoup d\'espace blanc et hiérarchie claire.',
  },
  {
    id: 'D',
    name: 'Card Stack',
    description: 'Guides présentés comme cartes interactives empilées. Design app premium avec interactions visuelles et stats.',
  },
  {
    id: 'E',
    name: 'Immersive Story',
    description: 'Design narratif qui raconte une histoire au scroll. Grandes sections plein écran, style longform journalistique.',
  },
]

export default function DesignLabPage() {
  return (
    <LabShell variants={variants}>
      <VariantA />
      <VariantB />
      <VariantC />
      <VariantD />
      <VariantE />
    </LabShell>
  )
}
