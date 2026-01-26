import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { client } from '@/sanity/lib/client'
import { BRAND_KIT, type PromptSuggestion, type AspectRatio } from '@/types/design-studio'

interface ArticleContent {
  _id: string
  title: string
  excerpt?: string
  body?: Array<{ children?: Array<{ text?: string }> }>
}

export async function POST(request: NextRequest) {
  try {
    const { articleId, articleType = 'post' } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId est requis' },
        { status: 400 }
      )
    }

    // Fetch article content from Sanity
    const article = await client.fetch<ArticleContent | null>(
      `*[_type == $type && _id == $id][0]{
        _id,
        title,
        excerpt,
        body
      }`,
      { type: articleType, id: articleId }
    )

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Extract text from body blocks
    const bodyText = article.body
      ?.map((block) =>
        block.children?.map((child) => child.text || '').join(' ')
      )
      .join(' ')
      .slice(0, 1500) || ''

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY non configuré' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    const prompt = `${BRAND_KIT.claudeSystemPrompt}

Voici le contenu d'un article à illustrer :

**Titre :** ${article.title}
${article.excerpt ? `**Extrait :** ${article.excerpt}` : ''}
${bodyText ? `**Contenu :** ${bodyText}` : ''}

---

Génère exactement 4 prompts d'images différents pour illustrer cet article. Chaque prompt doit :
1. Être en anglais
2. Décrire une scène ou composition visuelle spécifique
3. Être adapté au style de la marque (naturel, organique, apaisant)
4. Avoir environ 50-80 mots

Pour chaque prompt, suggère aussi le ratio d'aspect idéal parmi : 16:9 (paysage pour blog), 1:1 (carré), 2:3 (vertical).

Réponds UNIQUEMENT au format JSON suivant, sans texte avant ou après :
{
  "prompts": [
    { "text": "prompt en anglais...", "suggestedRatio": "16:9" },
    { "text": "prompt en anglais...", "suggestedRatio": "16:9" },
    { "text": "prompt en anglais...", "suggestedRatio": "1:1" },
    { "text": "prompt en anglais...", "suggestedRatio": "2:3" }
  ]
}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    const responseText = textBlock ? textBlock.text : ''

    // Parse JSON from response
    let parsed: { prompts: Array<{ text: string; suggestedRatio: string }> }
    try {
      parsed = JSON.parse(responseText)
    } catch {
      // Try to extract JSON from response if it's wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse prompt suggestions')
      }
    }

    // Transform to PromptSuggestion format
    const suggestions: PromptSuggestion[] = parsed.prompts.map((p, index) => ({
      id: `suggestion-${index + 1}`,
      text: p.text,
      suggestedRatio: (p.suggestedRatio || '16:9') as AspectRatio,
    }))

    return NextResponse.json({ prompts: suggestions })
  } catch (error) {
    console.error('Generate prompts error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des suggestions' },
      { status: 500 }
    )
  }
}
