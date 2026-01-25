import {type SchemaTypeDefinition} from 'sanity'

import {blockContent} from './blockContent'
import {author} from './author'
import {category} from './category'
import {post} from './post'
import {recipe} from './recipe'
import {testimonial} from './testimonial'
import {product} from './product'
import {questionnaireSubmission} from './questionnaireSubmission'
import {client} from './client'
import {clientNote} from './clientNote'
import {leadMagnetSubscriber} from './leadMagnetSubscriber'
import {guideReview} from './guideReview'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // Content types
    blockContent,

    // Documents
    author,
    category,
    post,
    recipe,
    testimonial,
    product,
    questionnaireSubmission,

    // CRM
    client,
    clientNote,

    // Lead Magnets
    leadMagnetSubscriber,
    guideReview,
  ],
}
