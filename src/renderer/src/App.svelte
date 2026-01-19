<!-- <script lang="ts">
  import Versions from './components/Versions.svelte'
  import electronLogo from './assets/electron.svg'

  let contractNo = $state<string>('625317-test')
  let poNo = $state<string>('4700722976')
  let price = $state<number>(1495)
  let customerName = $state<string>('Schindler')
  let createdDate = $state<Date>(new Date())

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping', newProject)
</script>

<img alt="logo" class="logo" src={electronLogo} />
<div class="creator">Powered by electron-vite</div>
<div class="text">
  Build an Electron app with
  <span class="svelte">Svelte</span>
  and
  <span class="ts">TypeScript</span>
</div>
<p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
<div class="actions">
  <div class="action">
    <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
  </div>
  <div class="action">
    svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute
    <a target="_blank" rel="noreferrer" onclick={ipcHandle}>Send IPC</a>
  </div>
</div>
<Versions />-->

<script lang="ts">
  import { onMount } from 'svelte'

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Project = {
    contractNo: string
    poNo: string
    price: number
    customerName: string
    created: Date | string
    releaseDate: string | null
    notes: string
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
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
  let contractNo = $state<string>('625317-test')
  let poNo = $state<string>('4700722976')
  let price = $state<number>(1495.0)
  let customerName = $state<string>('Schindler')

  let formEle = $state<HTMLFormElement>(null)

  let projects = $state<Project[]>([])

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let liveProjects = $derived(projects.filter((project) => project.releaseDate === null))
  let releasedProjects = $derived(projects.filter((project) => project.releaseDate !== null))

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
      contractNo,
      poNo,
      price,
      customerName,
      created: new Date(),
      releaseDate: null,
      notes: ''
    }

    window.api.newProject(project)

    formEle.reset()
  }

  function onDelete(contractNo: string) {
    const project = projects.find((project) => project.contractNo === contractNo)
    // TODO: Ask for confirmation
    window.api.deleteProject(`${project.contractNo} ${project.customerName}`)
  }

  function onRelease(contractNo: string) {
    const project = projects.find((project) => project.contractNo === contractNo)
    if (!project) return
    project.releaseDate = new Date().toISOString()

    const snap = $state.snapshot(project)
    window.api.updateProject(snap)
  }

  window.api.updateProjects((update) => {
    projects = update
  })

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(() => {
    if (projects.length === 0) {
      window.api.getProjects()
    }
  })
</script>

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
