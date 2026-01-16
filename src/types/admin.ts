// Client types
export interface ClientAddress {
  street?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface ClientHealthProfile {
  concerns?: string[]
  allergies?: string
  medications?: string
}

export type ClientStatus = 'actif' | 'pause' | 'archive'
export type ClientSource = 'questionnaire' | 'import' | 'manuel' | 'recommandation'
export type ConsultationType = 'sante-generale' | 'troubles-digestifs' | 'equilibre-hormonal' | 'suivi-complet'

export interface Client {
  _id: string
  _type: 'client'
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  address?: ClientAddress
  status: ClientStatus
  source: ClientSource
  linkedSubmission?: {
    _ref: string
    _type: 'reference'
  }
  healthProfile?: ClientHealthProfile
  consultationType?: ConsultationType
  internalNotes?: string
  createdAt?: string
  lastContactAt?: string
}

// Client Note types
export type NoteType = 'appel' | 'email' | 'consultation' | 'general' | 'important'

export interface ClientNote {
  _id: string
  _type: 'clientNote'
  client: {
    _ref: string
    _type: 'reference'
  }
  content: string
  type: NoteType
  createdAt?: string
}

export interface ClientNoteWithClient extends Omit<ClientNote, 'client'> {
  client: {
    _id: string
    firstName: string
    lastName: string
  }
}

// Prospect types (questionnaire submission)
export type ProspectProfile = 'equilibre' | 'alerte' | 'difficulte' | 'urgent'
export type ProspectStatus = 'nouveau' | 'contacte' | 'discussion' | 'converti' | 'non_interesse'

export interface ProspectCategoryScores {
  etatGeneral?: number
  energieVitalite?: number
  digestionTransit?: number
  alimentationComportement?: number
  emotionsMental?: number
  sommeil?: number
  peauCheveux?: number
  douleursInconforts?: number
  modeVie?: number
}

export interface ProspectAnswer {
  questionId?: string
  questionText?: string
  answerText?: string
  points?: number
  additionalInfo?: string
}

export interface Prospect {
  _id: string
  _type: 'questionnaireSubmission'
  firstName: string
  lastName: string
  email: string
  age: number
  totalScore?: number
  profile?: ProspectProfile
  categoryScores?: ProspectCategoryScores
  answers?: ProspectAnswer[]
  status: ProspectStatus
  notes?: string
  submittedAt?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalClients: number
  activeClients: number
  newProspects: number
  pendingProspects: number
  recentActivity: RecentActivity[]
}

export interface RecentActivity {
  id: string
  type: 'new_prospect' | 'new_client' | 'note_added' | 'status_change'
  title: string
  description: string
  timestamp: string
}

// Form types
export interface CreateClientInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  address?: ClientAddress
  status?: ClientStatus
  source?: ClientSource
  healthProfile?: ClientHealthProfile
  consultationType?: ConsultationType
  internalNotes?: string
  linkedSubmissionId?: string
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  lastContactAt?: string
}

export interface CreateNoteInput {
  clientId: string
  content: string
  type: NoteType
}

// CSV Import
export interface CSVImportRow {
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  city?: string
  postalCode?: string
  country?: string
  consultationType?: string
  notes?: string
}

export interface CSVImportResult {
  success: number
  failed: number
  errors: Array<{
    row: number
    error: string
  }>
}
