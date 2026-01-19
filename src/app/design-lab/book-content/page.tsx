'use client'

import BookV1 from './variations/book-v1'
import BookV2 from './variations/book-v2'
import BookV3 from './variations/book-v3'
import BookV4 from './variations/book-v4'
import BookV5 from './variations/book-v5'

export default function BookContentDesignLab() {
  return (
    <main className="min-h-screen">
      <div className="bg-forest-deep text-cream py-8 text-center sticky top-0 z-50">
        <h1 className="font-display text-2xl">Design Lab — Dans ce livre, vous découvrirez</h1>
        <p className="text-sage-light text-sm mt-2">5 variations • Scroll pour comparer</p>
      </div>

      <BookV1 />
      <BookV2 />
      <BookV3 />
      <BookV4 />
      <BookV5 />
    </main>
  )
}
