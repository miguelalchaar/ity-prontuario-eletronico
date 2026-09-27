import type {
    Evolution,
    Medication,
    Occurrence,
    Resident,
    Vital,
  } from '../types'
  
  export const residents: Resident[] = [
    {
      id: 'maria',
      name: 'Maria Aparecida Santos',
      age: 78,
      birthDate: '1948-03-12',
  
      room: '12',
      bed: 'A',
      accommodation: 'Compartilhada',
      status: 'Ativo',
      admission: '2025-02-10',
  
      dependency: 'Grau II',
      fallRisk: 'Alto',
  
      diagnoses: [
        'Hipertensão arterial',
        'Diabetes mellitus tipo 2',
      ],
  
      allergies: ['Dipirona'],
  
      diet: 'Dieta para diabético',
      mobility: 'Caminha com auxílio',
      careNotes:
        'Necessita acompanhamento durante a locomoção. Monitorar glicemia conforme orientação da equipe de saúde.',
  
      photo:
        'https://randomuser.me/api/portraits/women/65.jpg',
  
      cpf: '123.456.789-00',
      sus: '898 0012 3456 7890',
      healthPlan: 'SUS',
  
      guardian: {
        name: 'Ana Paula Santos',
        relation: 'Filha',
        phone: '(33) 98888-1111',
        emergencyPhone: '(33) 99999-1111',
      },
    },
  
    {
      id: 'joao',
      name: 'João Batista Oliveira',
      age: 82,
      birthDate: '1944-07-21',
  
      room: '08',
      bed: 'A',
      accommodation: 'Individual',
      status: 'Ativo',
      admission: '2024-11-18',
  
      dependency: 'Grau III',
      fallRisk: 'Alto',
  
      diagnoses: ['Doença de Alzheimer'],
  
      allergies: ['Nenhuma conhecida'],
  
      diet: 'Dieta pastosa',
      mobility: 'Necessita auxílio integral',
      careNotes:
        'Necessita acompanhamento contínuo para atividades de rotina e locomoção. Manter ambiente seguro e organizado.',
  
      photo:
        'https://randomuser.me/api/portraits/men/75.jpg',
  
      cpf: '234.567.890-11',
      sus: '898 0023 4567 8901',
      healthPlan: 'SUS',
  
      guardian: {
        name: 'Carlos Eduardo Oliveira',
        relation: 'Filho',
        phone: '(33) 97777-2222',
        emergencyPhone: '(33) 98888-2222',
      },
    },
  
    {
      id: 'tereza',
      name: 'Tereza Maria Souza',
      age: 74,
      birthDate: '1952-01-30',
  
      room: '05',
      bed: 'B',
      accommodation: 'Compartilhada',
      status: 'Ativo',
      admission: '2025-06-03',
  
      dependency: 'Grau I',
      fallRisk: 'Baixo',
  
      diagnoses: ['Diabetes mellitus tipo 2'],
  
      allergies: ['Nenhuma conhecida'],
  
      diet: 'Dieta para diabético',
      mobility: 'Caminha sem auxílio',
      careNotes:
        'Realiza atividades de rotina com autonomia. Manter acompanhamento da alimentação e glicemia.',
  
      photo:
        'https://randomuser.me/api/portraits/women/72.jpg',
  
      cpf: '345.678.901-22',
      sus: '898 0034 5678 9012',
      healthPlan: 'SUS',
  
      guardian: {
        name: 'Mariana Souza',
        relation: 'Filha',
        phone: '(33) 96666-3333',
        emergencyPhone: '(33) 97777-3333',
      },
    },
  
    {
      id: 'antonio',
      name: 'Antonio Carlos Ferreira',
      age: 86,
      birthDate: '1940-09-14',
  
      room: '03',
      bed: 'A',
      accommodation: 'Individual',
      status: 'Ativo',
      admission: '2024-08-22',
  
      dependency: 'Grau II',
      fallRisk: 'Médio',
  
      diagnoses: ['Artrose'],
  
      allergies: ['Nenhuma conhecida'],
  
      diet: 'Dieta livre',
      mobility: 'Caminha com bengala',
      careNotes:
        'Apresenta limitação de mobilidade. Observar desconfortos durante a movimentação e atividades diárias.',
  
      photo:
        'https://randomuser.me/api/portraits/men/64.jpg',
  
      cpf: '456.789.012-33',
      sus: '898 0045 6789 0123',
      healthPlan: 'SUS',
  
      guardian: {
        name: 'Fernanda Ferreira',
        relation: 'Neta',
        phone: '(33) 95555-4444',
        emergencyPhone: '(33) 96666-4444',
      },
    },
  ]
  
  export const medications: Medication[] = [
    {
      id: 'med-001',
      residentId: 'maria',
      name: 'Losartana',
      dosage: '50 mg',
      route: 'Via oral',
      time: '08:00',
      frequency: '1 vez ao dia',
      status: 'Administrado',
    },
    {
      id: 'med-002',
      residentId: 'maria',
      name: 'Metformina',
      dosage: '850 mg',
      route: 'Via oral',
      time: '12:00',
      frequency: '2 vezes ao dia',
      status: 'Pendente',
    },
    {
      id: 'med-003',
      residentId: 'maria',
      name: 'Metformina',
      dosage: '850 mg',
      route: 'Via oral',
      time: '19:00',
      frequency: '2 vezes ao dia',
      status: 'Programado',
    },
    {
      id: 'med-004',
      residentId: 'joao',
      name: 'Donepezila',
      dosage: '10 mg',
      route: 'Via oral',
      time: '08:00',
      frequency: '1 vez ao dia',
      status: 'Administrado',
    },
    {
      id: 'med-005',
      residentId: 'tereza',
      name: 'Metformina',
      dosage: '500 mg',
      route: 'Via oral',
      time: '12:00',
      frequency: '1 vez ao dia',
      status: 'Programado',
    },
    {
      id: 'med-006',
      residentId: 'antonio',
      name: 'Paracetamol',
      dosage: '500 mg',
      route: 'Via oral',
      time: '20:00',
      frequency: 'Se necessário',
      status: 'Programado',
    },
  ]
  
  export const vitals: Vital[] = [
    {
      id: 'vital-001',
      residentId: 'maria',
      date: '2026-09-26',
      time: '08:15',
      weight: '68',
      height: '158',
      pressure: '138/82',
      temperature: '36.5',
      heartRate: '76',
      saturation: '97',
      glucose: '126',
    },
    {
      id: 'vital-002',
      residentId: 'maria',
      date: '2026-09-25',
      time: '08:10',
      weight: '68.2',
      height: '158',
      pressure: '142/84',
      temperature: '36.6',
      heartRate: '78',
      saturation: '96',
      glucose: '131',
    },
    {
      id: 'vital-003',
      residentId: 'joao',
      date: '2026-09-26',
      time: '09:00',
      weight: '71',
      height: '165',
      pressure: '130/80',
      temperature: '36.4',
      heartRate: '72',
      saturation: '96',
      glucose: '108',
    },
    {
      id: 'vital-004',
      residentId: 'tereza',
      date: '2026-09-26',
      time: '08:40',
      weight: '64',
      height: '160',
      pressure: '124/78',
      temperature: '36.3',
      heartRate: '70',
      saturation: '98',
      glucose: '118',
    },
    {
      id: 'vital-005',
      residentId: 'antonio',
      date: '2026-09-26',
      time: '09:20',
      weight: '76',
      height: '168',
      pressure: '136/82',
      temperature: '36.7',
      heartRate: '74',
      saturation: '97',
      glucose: '102',
    },
  ]
  
  export const evolutions: Evolution[] = [
    {
      id: 'evolution-001',
      residentId: 'maria',
      date: '2026-09-26',
      time: '09:30',
      type: 'Rotina',
      description:
        'Residente apresentou-se bem durante o início da manhã. Alimentação realizada normalmente e sem queixas no momento.',
      author: 'Enfermagem',
    },
    {
      id: 'evolution-002',
      residentId: 'maria',
      date: '2026-09-25',
      time: '14:20',
      type: 'Acompanhamento',
      description:
        'Realizado acompanhamento da glicemia e administração das medicações conforme prescrição.',
      author: 'Enfermagem',
    },
    {
      id: 'evolution-003',
      residentId: 'joao',
      date: '2026-09-26',
      time: '10:10',
      type: 'Rotina',
      description:
        'Residente tranquilo, acompanhado durante a higiene pessoal e alimentação.',
      author: 'Cuidador',
    },
    {
      id: 'evolution-004',
      residentId: 'tereza',
      date: '2026-09-25',
      time: '16:00',
      type: 'Rotina',
      description:
        'Residente participou das atividades recreativas da instituição sem intercorrências.',
      author: 'Cuidador',
    },
    {
      id: 'evolution-005',
      residentId: 'antonio',
      date: '2026-09-26',
      time: '11:00',
      type: 'Acompanhamento',
      description:
        'Relatou leve desconforto durante a caminhada. Mantido acompanhamento durante a movimentação.',
      author: 'Enfermagem',
    },
  ]
  
  export const occurrences: Occurrence[] = [
    {
      id: 'occurrence-001',
      residentId: 'maria',
      date: '2026-09-24',
      time: '15:40',
      type: 'Alteração de glicemia',
      severity: 'Média',
      description:
        'Glicemia acima do valor habitual durante verificação de rotina.',
      action:
        'Realizado acompanhamento e comunicado à equipe responsável.',
    },
    {
      id: 'occurrence-002',
      residentId: 'joao',
      date: '2026-09-22',
      time: '10:15',
      type: 'Agitação',
      severity: 'Baixa',
      description:
        'Residente apresentou período de agitação durante a manhã.',
      action:
        'Realizada abordagem tranquila e acompanhamento até estabilização.',
    },
    {
      id: 'occurrence-003',
      residentId: 'antonio',
      date: '2026-09-20',
      time: '14:30',
      type: 'Dor',
      severity: 'Média',
      description:
        'Relatou desconforto nas articulações durante movimentação.',
      action:
        'Repouso e acompanhamento da evolução do desconforto.',
    },
  ]