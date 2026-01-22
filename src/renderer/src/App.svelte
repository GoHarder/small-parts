<script lang="ts">
  import { onMount } from 'svelte'

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Project = {
    _id: string
    customerName: string
    contractNo: string
    poNo: string
    user: string
    price: number
    created: Date | string
    released: string | null
    bookmarked: boolean
    // notes: string
  }

  type Settings = {
    firstName: string
    lastName: string
    email: string
    server: string
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import Settings from './pages/Settings.svelte'
  import { Button } from '@moss/comp/button'
  import { NumberField, TextField } from '@moss/comp/text-field'
  import { Icon } from '@moss/comp/icon'
  import { List } from '@moss/comp/list'
  import ProjectItem from './components/ProjectItem.svelte'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let contractNo = $state<string>()
  let poNo = $state<string>()
  let price = $state<number>()
  let customerName = $state<string>()

  let formEle = $state<HTMLFormElement>(null)

  let setup = $state<boolean>(false)
  let projects = $state<Project[]>([])
  let settings = $state<Settings>({
    firstName: '',
    lastName: '',
    email: '',
    server: ''
  })

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let liveProjects = $derived(projects.filter((project) => project.released === null))
  let releasedProjects = $derived(projects.filter((project) => project.released !== null))

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function onNewProject(event: SubmitEvent): void {
    event.preventDefault()

    const project = {
      customerName,
      contractNo,
      poNo,
      price
    }

    window.api.projects.new(project)

    formEle.reset()
  }

  function onDelete(contractNo: string) {
    const project = projects.find((project) => project.contractNo === contractNo)
    // TODO: Ask for confirmation

    window.api.projects.delete(`${project.contractNo} ${project.customerName}`)
  }

  function onRelease(contractNo: string) {
    const project = projects.find((project) => project.contractNo === contractNo)
    if (!project) return
    project.released = new Date().toISOString()

    const snap = $state.snapshot(project)

    window.api.projects.update(snap)
  }

  window.api.projects.listen((update) => {
    projects = update
  })

  window.api.settings.listen((isSet, update) => {
    for (const key in update) {
      if (update[key] !== null) continue
      update[key] = ''
    }

    setup = isSet
    settings = update
  })

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(() => {
    if (projects.length === 0) window.api.projects.get()
  })
</script>

{#if !setup}
  <Settings
    firstName={settings.firstName}
    lastName={settings.lastName}
    email={settings.email}
    server={settings.server}
  />
{:else}
  <form bind:this={formEle} onsubmit={onNewProject}>
    <TextField label="Customer name" bind:value={customerName} />
    <TextField label="Contract number" bind:value={contractNo} />
    <TextField label="Purchase order number" bind:value={poNo} />
    <NumberField label="Price" bind:value={price} prefix-text="$" min="0" step="0.01" />
    <Button variant="filled">
      <Icon data-slot="icon">assignment_add</Icon>
      Create project
    </Button>
  </form>
{/if}

<div>
  <p>Live projects</p>
  <List>
    {#each liveProjects as project (project.contractNo)}
      <ProjectItem
        {project}
        onDelete={() => onDelete(project.contractNo)}
        onRelease={() => onRelease(project.contractNo)}
      />
    {/each}
  </List>
</div>

<div>
  <p>Released projects</p>

  <List>
    {#each releasedProjects as project (project.contractNo)}
      <ProjectItem {project} onDelete={() => onDelete(project.contractNo)} onRelease={() => {}} />
    {/each}
  </List>
</div>
