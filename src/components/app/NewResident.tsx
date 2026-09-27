import {
    ArrowLeft,
    ImagePlus,
    Save,
    UserRound,
    X,
  } from 'lucide-react'
  import {
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
  } from 'react'
  import {
    Link,
    useNavigate,
  } from 'react-router-dom'
  
  import { useAppStore } from '../../lib/store'
  import type {
    Accommodation,
    Dependency,
    FallRisk,
    Resident,
  } from '../../types'
  
  import { Button } from '../ui/button'
  import { Input } from '../ui/input'
  import { Textarea } from '../ui/textarea'
  
  import { AppShell } from './AppShell'
  import { Field } from './FormModal'
  import {
    PageTitle,
    Section,
  } from './common'
  
  interface FormData {
    name: string
    birthDate: string
    room: string
    bed: string
    accommodation: Accommodation
    dependency: Dependency
    fallRisk: FallRisk
    diagnoses: string
    allergies: string
    diet: string
    mobility: string
    careNotes: string
    cpf: string
    sus: string
    healthPlan: string
    guardianName: string
    guardianRelation: string
    guardianPhone: string
    emergencyPhone: string
  }
  
  const initialForm: FormData = {
    name: '',
    birthDate: '',
    room: '',
    bed: '',
    accommodation: 'Compartilhada',
    dependency: 'Grau I',
    fallRisk: 'Baixo',
    diagnoses: '',
    allergies: '',
    diet: '',
    mobility: '',
    careNotes: '',
    cpf: '',
    sus: '',
    healthPlan: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    emergencyPhone: '',
  }
  
  export default function NewResident() {
    const navigate = useNavigate()
    const { addResident } = useAppStore()
  
    const fileInputRef =
      useRef<HTMLInputElement>(null)
  
    const [form, setForm] =
      useState<FormData>(initialForm)
  
    const [photo, setPhoto] =
      useState<string | null>(null)
  
    const [error, setError] =
      useState('')
  
    function updateField<
      K extends keyof FormData,
    >(
      field: K,
      value: FormData[K],
    ) {
      setForm((current) => ({
        ...current,
        [field]: value,
      }))
  
      if (error) {
        setError('')
      }
    }
  
    function handlePhotoChange(
      event: ChangeEvent<HTMLInputElement>,
    ) {
      const file = event.target.files?.[0]
  
      if (!file) {
        return
      }
  
      if (!file.type.startsWith('image/')) {
        setError(
          'Selecione um arquivo de imagem válido.',
        )
  
        event.target.value = ''
        return
      }
  
      if (file.size > 5 * 1024 * 1024) {
        setError(
          'A foto deve ter no máximo 5 MB.',
        )
  
        event.target.value = ''
        return
      }
  
      const reader = new FileReader()
  
      reader.onload = () => {
        if (
          typeof reader.result === 'string'
        ) {
          setPhoto(reader.result)
          setError('')
        }
      }
  
      reader.onerror = () => {
        setError(
          'Não foi possível carregar a foto.',
        )
      }
  
      reader.readAsDataURL(file)
    }
  
    function removePhoto() {
      setPhoto(null)
  
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      setError('')
  
      if (!form.name.trim()) {
        setError(
          'Informe o nome completo do residente.',
        )
        return
      }
  
      if (!form.birthDate) {
        setError(
          'Informe a data de nascimento.',
        )
        return
      }
  
      if (!form.room.trim()) {
        setError('Informe o quarto.')
        return
      }
  
      if (!form.bed.trim()) {
        setError('Informe o leito.')
        return
      }
  
      if (!form.guardianName.trim()) {
        setError(
          'Informe o nome do responsável.',
        )
        return
      }
  
      const birthDate = new Date(
        `${form.birthDate}T00:00:00`,
      )
  
      const age = calculateAge(birthDate)
  
      if (age < 0) {
        setError(
          'A data de nascimento não pode ser futura.',
        )
        return
      }
  
      const residentId = createResidentId(
        form.name,
      )
  
      const resident: Resident = {
        id: residentId,
  
        name: form.name.trim(),
  
        age,
  
        birthDate: form.birthDate,
  
        room: form.room.trim(),
  
        bed: form.bed.trim(),
  
        accommodation:
          form.accommodation,
  
        status: 'Ativo',
  
        admission: getCurrentDate(),
  
        dependency: form.dependency,
  
        fallRisk: form.fallRisk,
  
        diagnoses: parseList(
          form.diagnoses,
        ),
  
        allergies: parseList(
          form.allergies,
        ),
  
        diet:
          form.diet.trim() ||
          'Não informado',
  
        mobility:
          form.mobility.trim() ||
          'Não informado',
  
        careNotes:
          form.careNotes.trim() ||
          'Nenhuma orientação registrada.',
  
        photo:
          photo ||
          createAvatarUrl(form.name),
  
        cpf:
          form.cpf.trim() ||
          'Não informado',
  
        sus:
          form.sus.trim() ||
          'Não informado',
  
        healthPlan:
          form.healthPlan.trim() ||
          'Particular',
  
        guardian: {
          name: form.guardianName.trim(),
  
          relation:
            form.guardianRelation.trim() ||
            'Não informado',
  
          phone:
            form.guardianPhone.trim() ||
            'Não informado',
  
          emergencyPhone:
            form.emergencyPhone.trim() ||
            'Não informado',
        },
      }
  
      addResident(resident)
  
      navigate(
        `/residentes/${resident.id}`,
      )
    }
  
    return (
      <AppShell>
        <div className="mb-5">
          <Link
            to="/residentes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="size-4" />
            Voltar para residentes
          </Link>
        </div>
  
        <PageTitle
          title="Novo residente"
          description="Cadastre as informações iniciais para criar o prontuário."
        />
  
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              <X className="mt-0.5 size-4 shrink-0" />
  
              <span>{error}</span>
            </div>
          )}
  
          <Section
            title="Dados pessoais"
            icon={UserRound}
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Prévia da foto do residente"
                      className="size-28 rounded-2xl object-cover ring-4 ring-gray-100"
                    />
                  ) : (
                    <div className="flex size-28 items-center justify-center rounded-2xl bg-gray-100 ring-4 ring-gray-50">
                      <UserRound className="size-10 text-gray-400" />
                    </div>
                  )}
  
                  {photo && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      aria-label="Remover foto"
                      className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
  
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Foto do residente
                  </h3>
  
                  <p className="mt-1 max-w-md text-sm leading-5 text-gray-500">
                    Adicione uma foto para facilitar
                    a identificação do residente no
                    prontuário.
                  </p>
  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <ImagePlus />
                      {photo
                        ? 'Trocar foto'
                        : 'Adicionar foto'}
                    </Button>
  
                    {photo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removePhoto}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
  
                  <p className="mt-2 text-xs text-gray-400">
                    JPG, PNG ou WEBP · máximo 5 MB
                  </p>
                </div>
              </div>
  
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nome completo"
                  wide
                >
                  <Input
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        'name',
                        event.target.value,
                      )
                    }
                    placeholder="Ex.: Maria Aparecida Santos"
                    required
                  />
                </Field>
  
                <Field label="Data de nascimento">
                  <Input
                    type="date"
                    value={form.birthDate}
                    onChange={(event) =>
                      updateField(
                        'birthDate',
                        event.target.value,
                      )
                    }
                    required
                  />
                </Field>
  
                <Field label="CPF">
                  <Input
                    value={form.cpf}
                    onChange={(event) =>
                      updateField(
                        'cpf',
                        event.target.value,
                      )
                    }
                    placeholder="000.000.000-00"
                  />
                </Field>
  
                <Field label="Cartão SUS">
                  <Input
                    value={form.sus}
                    onChange={(event) =>
                      updateField(
                        'sus',
                        event.target.value,
                      )
                    }
                    placeholder="Número do cartão SUS"
                  />
                </Field>
  
                <Field label="Plano de saúde">
                  <Input
                    value={form.healthPlan}
                    onChange={(event) =>
                      updateField(
                        'healthPlan',
                        event.target.value,
                      )
                    }
                    placeholder="Ex.: Unimed"
                  />
                </Field>
              </div>
            </div>
          </Section>
  
          <Section
            title="Acomodação"
            icon={UserRound}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Quarto">
                <Input
                  value={form.room}
                  onChange={(event) =>
                    updateField(
                      'room',
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: 12"
                  required
                />
              </Field>
  
              <Field label="Leito">
                <Input
                  value={form.bed}
                  onChange={(event) =>
                    updateField(
                      'bed',
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: A"
                  required
                />
              </Field>
  
              <Field label="Acomodação">
                <select
                  value={form.accommodation}
                  onChange={(event) =>
                    updateField(
                      'accommodation',
                      event.target
                        .value as Accommodation,
                    )
                  }
                  className={selectClassName}
                >
                  <option value="Individual">
                    Individual
                  </option>
  
                  <option value="Compartilhada">
                    Compartilhada
                  </option>
                </select>
              </Field>
  
              <Field label="Grau de dependência">
                <select
                  value={form.dependency}
                  onChange={(event) =>
                    updateField(
                      'dependency',
                      event.target
                        .value as Dependency,
                    )
                  }
                  className={selectClassName}
                >
                  <option value="Grau I">
                    Grau I
                  </option>
  
                  <option value="Grau II">
                    Grau II
                  </option>
  
                  <option value="Grau III">
                    Grau III
                  </option>
                </select>
              </Field>
  
              <Field label="Risco de queda">
                <select
                  value={form.fallRisk}
                  onChange={(event) =>
                    updateField(
                      'fallRisk',
                      event.target
                        .value as FallRisk,
                    )
                  }
                  className={selectClassName}
                >
                  <option value="Baixo">
                    Baixo
                  </option>
  
                  <option value="Médio">
                    Médio
                  </option>
  
                  <option value="Alto">
                    Alto
                  </option>
                </select>
              </Field>
            </div>
          </Section>
  
          <Section
            title="Informações clínicas"
            icon={UserRound}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Diagnósticos"
                wide
              >
                <Textarea
                  value={form.diagnoses}
                  onChange={(event) =>
                    updateField(
                      'diagnoses',
                      event.target.value,
                    )
                  }
                  placeholder="Separe os diagnósticos por vírgula."
                />
              </Field>
  
              <Field
                label="Alergias"
                wide
              >
                <Textarea
                  value={form.allergies}
                  onChange={(event) =>
                    updateField(
                      'allergies',
                      event.target.value,
                    )
                  }
                  placeholder="Informe alergias conhecidas."
                />
              </Field>
  
              <Field label="Dieta">
                <Input
                  value={form.diet}
                  onChange={(event) =>
                    updateField(
                      'diet',
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Dieta branda"
                />
              </Field>
  
              <Field label="Mobilidade">
                <Input
                  value={form.mobility}
                  onChange={(event) =>
                    updateField(
                      'mobility',
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Deambula com auxílio"
                />
              </Field>
  
              <Field
                label="Orientações de cuidado"
                wide
              >
                <Textarea
                  value={form.careNotes}
                  onChange={(event) =>
                    updateField(
                      'careNotes',
                      event.target.value,
                    )
                  }
                  placeholder="Descreva cuidados específicos, restrições ou observações importantes."
                />
              </Field>
            </div>
          </Section>
  
          <Section
            title="Responsável"
            icon={UserRound}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo">
                <Input
                  value={form.guardianName}
                  onChange={(event) =>
                    updateField(
                      'guardianName',
                      event.target.value,
                    )
                  }
                  placeholder="Nome do responsável"
                  required
                />
              </Field>
  
              <Field label="Parentesco">
                <Input
                  value={
                    form.guardianRelation
                  }
                  onChange={(event) =>
                    updateField(
                      'guardianRelation',
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Filha"
                />
              </Field>
  
              <Field label="Telefone">
                <Input
                  value={
                    form.guardianPhone
                  }
                  onChange={(event) =>
                    updateField(
                      'guardianPhone',
                      event.target.value,
                    )
                  }
                  placeholder="(00) 00000-0000"
                />
              </Field>
  
              <Field label="Telefone de emergência">
                <Input
                  value={
                    form.emergencyPhone
                  }
                  onChange={(event) =>
                    updateField(
                      'emergencyPhone',
                      event.target.value,
                    )
                  }
                  placeholder="(00) 00000-0000"
                />
              </Field>
            </div>
          </Section>
  
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link to="/residentes">
                Cancelar
              </Link>
            </Button>
  
            <Button
              type="submit"
              size="lg"
            >
              <Save />
              Criar prontuário
            </Button>
          </div>
        </form>
      </AppShell>
    )
  }
  
  const selectClassName =
    'h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
  
  function calculateAge(
    birthDate: Date,
  ) {
    const today = new Date()
  
    let age =
      today.getFullYear() -
      birthDate.getFullYear()
  
    const monthDifference =
      today.getMonth() -
      birthDate.getMonth()
  
    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() <
          birthDate.getDate())
    ) {
      age--
    }
  
    return age
  }
  
  function getCurrentDate() {
    const now = new Date()
  
    return [
      now.getFullYear(),
      String(
        now.getMonth() + 1,
      ).padStart(2, '0'),
      String(now.getDate()).padStart(
        2,
        '0',
      ),
    ].join('-')
  }
  
  function parseList(value: string) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  
  function createResidentId(
    name: string,
  ) {
    const slug = name
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  
    return `${slug}-${Date.now()}`
  }
  
  function createAvatarUrl(
    name: string,
  ) {
    const initials = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(
        (part) => part[0],
      )
      .join('')
      .toUpperCase()
  
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials,
    )}&background=e5e7eb&color=374151&size=256`
  }