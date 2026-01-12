import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'

export async function POST(request) {
  try {
    const submission = await request.json()

    // Créer un nouveau document PDF pour les créateurs
    const doc = new jsPDF()

    // Configuration de base
    doc.setFontSize(20)
    doc.text('Creator Agreement', 20, 20)

    doc.setFontSize(12)
    let yPosition = 40

    // Ajouter les informations spécifiques aux créateurs
    // Adaptez ces champs selon votre structure de données
    const fields = [
      { label: 'Creator Name', value: submission.full_name },
      { label: 'Email', value: submission.email },
      { label: 'Date', value: new Date(submission.created_at).toLocaleDateString() },
      { label: 'Type', value: 'Creator Agreement' },
    ]

    fields.forEach(field => {
      if (field.value) {
        doc.text(`${field.label}: ${field.value}`, 20, yPosition)
        yPosition += 10
      }
    })

    // Ajouter des informations spécifiques aux créateurs
    // Exemples de champs possibles:
    // if (submission.social_media_handle) {
    //   doc.text(`Social Media: ${submission.social_media_handle}`, 20, yPosition)
    //   yPosition += 10
    // }
    // if (submission.content_type) {
    //   doc.text(`Content Type: ${submission.content_type}`, 20, yPosition)
    //   yPosition += 10
    // }

    // Ajouter les termes du contrat créateur
    yPosition += 10
    doc.setFontSize(14)
    doc.text('Terms & Conditions:', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    const terms = [
      '1. Content creation and delivery timelines',
      '2. Rights and usage permissions',
      '3. Compensation terms',
      '4. Confidentiality agreement',
    ]

    terms.forEach(term => {
      doc.text(term, 20, yPosition)
      yPosition += 7
    })

    // Générer le PDF en buffer
    const pdfBuffer = doc.output('arraybuffer')

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=creator-agreement-${submission.id}.pdf`,
      },
    })
  } catch (error) {
    console.error('Error generating creator PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate creator PDF' },
      { status: 500 }
    )
  }
}
