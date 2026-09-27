import jsPDF from 'jspdf'

import type {
  Evolution,
  Medication,
  Occurrence,
  Resident,
  Vital,
} from '../../types'

interface ResidentReportData {
  resident: Resident
  medications: Medication[]
  vitals: Vital[]
  evolutions: Evolution[]
  occurrences: Occurrence[]
}

export function exportResidentReport({
  resident,
  medications,
  vitals,
  evolutions,
  occurrences,
}: ResidentReportData) {
  const pdf = new jsPDF()

  const pageWidth =
    pdf.internal.pageSize.getWidth()

  const pageHeight =
    pdf.internal.pageSize.getHeight()

  const margin = 18

  const contentWidth =
    pageWidth - margin * 2

  let y = margin

  function addPageIfNeeded(
    height = 10,
  ) {
    if (
      y + height >
      pageHeight - 18
    ) {
      pdf.addPage()
      y = margin
    }
  }

  function addTitle(
    title: string,
  ) {
    addPageIfNeeded(16)

    pdf.setFontSize(13)

    pdf.setFont(
      'helvetica',
      'bold',
    )

    pdf.setTextColor(
      30,
      41,
      59,
    )

    pdf.text(
      title,
      margin,
      y,
    )

    y += 8

    pdf.setDrawColor(
      226,
      232,
      240,
    )

    pdf.line(
      margin,
      y,
      pageWidth - margin,
      y,
    )

    y += 7
  }

  function addField(
    label: string,
    value: string,
    width = contentWidth,
  ) {
    const safeValue =
      value || 'Não informado'

    addPageIfNeeded(12)

    pdf.setFontSize(8)

    pdf.setFont(
      'helvetica',
      'bold',
    )

    pdf.setTextColor(
      100,
      116,
      139,
    )

    pdf.text(
      label.toUpperCase(),
      margin,
      y,
    )

    y += 4

    pdf.setFontSize(10)

    pdf.setFont(
      'helvetica',
      'normal',
    )

    pdf.setTextColor(
      15,
      23,
      42,
    )

    const lines =
      pdf.splitTextToSize(
        safeValue,
        width,
      )

    pdf.text(
      lines,
      margin,
      y,
    )

    y +=
      lines.length * 5 + 5
  }

  function addTwoFields(
    leftLabel: string,
    leftValue: string,
    rightLabel: string,
    rightValue: string,
  ) {
    addPageIfNeeded(14)

    const columnWidth =
      (contentWidth - 10) / 2

    pdf.setFontSize(8)

    pdf.setFont(
      'helvetica',
      'bold',
    )

    pdf.setTextColor(
      100,
      116,
      139,
    )

    pdf.text(
      leftLabel.toUpperCase(),
      margin,
      y,
    )

    pdf.text(
      rightLabel.toUpperCase(),
      margin +
        columnWidth +
        10,
      y,
    )

    y += 4

    pdf.setFontSize(10)

    pdf.setFont(
      'helvetica',
      'normal',
    )

    pdf.setTextColor(
      15,
      23,
      42,
    )

    const leftLines =
      pdf.splitTextToSize(
        leftValue ||
          'Não informado',
        columnWidth,
      )

    const rightLines =
      pdf.splitTextToSize(
        rightValue ||
          'Não informado',
        columnWidth,
      )

    pdf.text(
      leftLines,
      margin,
      y,
    )

    pdf.text(
      rightLines,
      margin +
        columnWidth +
        10,
      y,
    )

    const maxLines =
      Math.max(
        leftLines.length,
        rightLines.length,
      )

    y +=
      maxLines * 5 + 5
  }

  function addFooter() {
    const totalPages =
      pdf.getNumberOfPages()

    for (
      let page = 1;
      page <= totalPages;
      page += 1
    ) {
      pdf.setPage(page)

      pdf.setFontSize(8)

      pdf.setFont(
        'helvetica',
        'normal',
      )

      pdf.setTextColor(
        148,
        163,
        184,
      )

      pdf.text(
        `Prontuário Eletrônico • ${resident.name}`,
        margin,
        pageHeight - 10,
      )

      pdf.text(
        `Página ${page} de ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        {
          align: 'right',
        },
      )
    }
  }

  // Cabeçalho
  pdf.setFillColor(
    37,
    99,
    235,
  )

  pdf.rect(
    0,
    0,
    pageWidth,
    28,
    'F',
  )

  pdf.setTextColor(
    255,
    255,
    255,
  )

  pdf.setFontSize(18)

  pdf.setFont(
    'helvetica',
    'bold',
  )

  pdf.text(
    'Relatório do Prontuário',
    margin,
    13,
  )

  pdf.setFontSize(9)

  pdf.setFont(
    'helvetica',
    'normal',
  )

  pdf.text(
    'Prontuário Eletrônico do Residente',
    margin,
    20,
  )

  y = 40

  // Dados do residente
  addTitle(
    'Dados do residente',
  )

  addTwoFields(
    'Nome',
    resident.name,
    'Status',
    resident.status,
  )

  addTwoFields(
    'Data de nascimento',
    formatDate(
      resident.birthDate,
    ),
    'Idade',
    `${resident.age} anos`,
  )

  addTwoFields(
    'Data de admissão',
    formatDate(
      resident.admission,
    ),
    'Data de encerramento',
    resident.closureDate
      ? formatDate(
          resident.closureDate,
        )
      : 'Não encerrado',
  )

  addTwoFields(
    'Quarto',
    resident.room,
    'Leito',
    resident.bed,
  )

  addTwoFields(
    'Acomodação',
    resident.accommodation,
    'Grau de dependência',
    resident.dependency,
  )

  addTwoFields(
    'Risco de queda',
    resident.fallRisk,
    'Plano de saúde',
    resident.healthPlan,
  )

  addTwoFields(
    'CPF',
    resident.cpf,
    'SUS',
    resident.sus,
  )

  if (resident.closureReason) {
    addField(
      'Motivo do encerramento',
      resident.closureReason,
    )
  }

  // Informações clínicas
  addTitle(
    'Informações clínicas',
  )

  addField(
    'Diagnósticos',
    resident.diagnoses.length > 0
      ? resident.diagnoses.join(
          ', ',
        )
      : 'Nenhum diagnóstico informado.',
  )

  addField(
    'Alergias',
    resident.allergies.length > 0
      ? resident.allergies.join(
          ', ',
        )
      : 'Nenhuma alergia informada.',
  )

  addField(
    'Dieta',
    resident.diet,
  )

  addField(
    'Mobilidade',
    resident.mobility,
  )

  addField(
    'Observações de cuidado',
    resident.careNotes,
  )

  // Responsável
  addTitle('Responsável')

  addTwoFields(
    'Nome',
    resident.guardian.name,
    'Parentesco',
    resident.guardian.relation,
  )

  addTwoFields(
    'Telefone',
    resident.guardian.phone,
    'Telefone de emergência',
    resident.guardian.emergencyPhone,
  )

  // Medicamentos
  addTitle('Medicamentos')

  if (medications.length === 0) {
    addField(
      '',
      'Nenhum medicamento registrado.',
    )
  } else {
    medications.forEach(
      (medication) => {
        addPageIfNeeded(32)

        pdf.setFontSize(10)

        pdf.setFont(
          'helvetica',
          'bold',
        )

        pdf.setTextColor(
          15,
          23,
          42,
        )

        pdf.text(
          medication.name,
          margin,
          y,
        )

        y += 5

        pdf.setFontSize(9)

        pdf.setFont(
          'helvetica',
          'normal',
        )

        pdf.text(
          `Dosagem: ${medication.dosage}`,
          margin,
          y,
        )

        y += 4

        pdf.text(
          `Via: ${medication.route}`,
          margin,
          y,
        )

        y += 4

        pdf.text(
          `Horário: ${medication.time} • Frequência: ${medication.frequency}`,
          margin,
          y,
        )

        y += 4

        pdf.text(
          `Status: ${medication.status}`,
          margin,
          y,
        )

        y += 7
      },
    )
  }

  // Sinais vitais
  addTitle('Sinais vitais')

  if (vitals.length === 0) {
    addField(
      '',
      'Nenhum sinal vital registrado.',
    )
  } else {
    vitals.forEach(
      (vital) => {
        addPageIfNeeded(45)

        pdf.setFontSize(10)

        pdf.setFont(
          'helvetica',
          'bold',
        )

        pdf.setTextColor(
          15,
          23,
          42,
        )

        pdf.text(
          `${formatDate(vital.date)} • ${vital.time}`,
          margin,
          y,
        )

        y += 6

        addTwoFields(
          'Peso',
          vital.weight
            ? `${vital.weight} kg`
            : 'Não informado',
          'Altura',
          vital.height
            ? `${vital.height} cm`
            : 'Não informado',
        )

        addTwoFields(
          'Pressão arterial',
          vital.pressure,
          'Temperatura',
          vital.temperature
            ? `${vital.temperature} °C`
            : 'Não informado',
        )

        addTwoFields(
          'Frequência cardíaca',
          vital.heartRate
            ? `${vital.heartRate} bpm`
            : 'Não informado',
          'Saturação',
          vital.saturation
            ? `${vital.saturation}%`
            : 'Não informado',
        )

        addField(
          'Glicemia',
          vital.glucose
            ? `${vital.glucose} mg/dL`
            : 'Não informado',
        )
      },
    )
  }

  // Evoluções
  addTitle('Evoluções')

  if (evolutions.length === 0) {
    addField(
      '',
      'Nenhuma evolução registrada.',
    )
  } else {
    evolutions.forEach(
      (evolution) => {
        addPageIfNeeded(45)

        pdf.setFontSize(10)

        pdf.setFont(
          'helvetica',
          'bold',
        )

        pdf.setTextColor(
          15,
          23,
          42,
        )

        pdf.text(
          `${formatDate(evolution.date)} • ${evolution.time}`,
          margin,
          y,
        )

        y += 5

        pdf.setFontSize(9)

        pdf.setFont(
          'helvetica',
          'bold',
        )

        pdf.text(
          `Tipo: ${evolution.type}`,
          margin,
          y,
        )

        y += 5

        const description =
          pdf.splitTextToSize(
            evolution.description,
            contentWidth,
          )

        pdf.setFont(
          'helvetica',
          'normal',
        )

        pdf.text(
          description,
          margin,
          y,
        )

        y +=
          description.length *
            4.5 +
          4

        pdf.setFontSize(8)

        pdf.setTextColor(
          100,
          116,
          139,
        )

        pdf.text(
          `Registrado por: ${evolution.author}`,
          margin,
          y,
        )

        y += 8
      },
    )
  }

  // Ocorrências
  addTitle('Ocorrências')

  if (occurrences.length === 0) {
    addField(
      '',
      'Nenhuma ocorrência registrada.',
    )
  } else {
    occurrences.forEach(
      (occurrence) => {
        addPageIfNeeded(50)

        pdf.setFontSize(10)

        pdf.setFont(
          'helvetica',
          'bold',
        )

        pdf.setTextColor(
          15,
          23,
          42,
        )

        pdf.text(
          `${formatDate(occurrence.date)} • ${occurrence.time}`,
          margin,
          y,
        )

        y += 5

        pdf.setFontSize(9)

        pdf.setFont(
          'helvetica',
          'bold',
        )

        pdf.text(
          `Tipo: ${occurrence.type}`,
          margin,
          y,
        )

        y += 4

        pdf.text(
          `Gravidade: ${occurrence.severity}`,
          margin,
          y,
        )

        y += 5

        pdf.setFont(
          'helvetica',
          'normal',
        )

        const description =
          pdf.splitTextToSize(
            occurrence.description,
            contentWidth,
          )

        pdf.text(
          description,
          margin,
          y,
        )

        y +=
          description.length *
            4.5 +
          4

        const action =
          pdf.splitTextToSize(
            `Conduta: ${occurrence.action}`,
            contentWidth,
          )

        pdf.text(
          action,
          margin,
          y,
        )

        y +=
          action.length *
            4.5 +
          8
      },
    )
  }

  // Rodapé
  addFooter()

  const fileName =
    `prontuario-${slugify(
      resident.name,
    )}.pdf`

  pdf.save(fileName)
}

function formatDate(
  value: string,
) {
  if (!value) {
    return 'Não informado'
  }

  const parts =
    value.split('-')

  if (parts.length !== 3) {
    return value
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

function slugify(
  value: string,
) {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      '-',
    )
    .replace(
      /^-+|-+$/g,
      '',
    )
}