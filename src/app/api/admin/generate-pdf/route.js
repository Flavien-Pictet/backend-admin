import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'

export async function POST(request) {
  try {
    const submission = await request.json()

    // Créer un nouveau document PDF
    const doc = new jsPDF()

    // Configuration de base
    doc.setFontSize(20)
    doc.text('Agreement Document', 20, 20)

    doc.setFontSize(12)
    let yPosition = 40

    // Ajouter les informations de soumission
    // Adaptez ces champs selon votre structure de données
    const fields = [
      { label: 'Full Name', value: submission.full_name },
      { label: 'Email', value: submission.email },
      { label: 'Date', value: new Date(submission.created_at).toLocaleDateString() },
      { label: 'Agreement Type', value: submission.agreement_type || 'N/A' },
    ]

    fields.forEach(field => {
      if (field.value) {
        doc.text(`${field.label}: ${field.value}`, 20, yPosition)
        yPosition += 10
      }
    })

    // Ajouter d'autres champs personnalisés selon vos besoins
    // Exemple:
    // if (submission.company_name) {
    //   doc.text(`Company: ${submission.company_name}`, 20, yPosition)
    //   yPosition += 10
    // }

    // Générer le PDF en buffer
    const pdfBuffer = doc.output('arraybuffer')

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=agreement-${submission.id}.pdf`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
