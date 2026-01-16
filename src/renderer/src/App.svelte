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
  // MARK: Types
  // -----------------------------------------------------------------------------
  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Button } from '@moss/comp/button'
  import { NumberField, TextField } from '@moss/comp/text-field'

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

  let items = $state([
    { i: 1, name: 'one' },
    { i: 2, name: 'one' },
    { i: 3, name: 'one' }
  ])

  // MARK: Derived
  // -----------------------------------------------------------------------------
  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function onNewProject(): void {
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
  }

  window.api.getCurrentProjects((value) => {
    console.log(value)
  })

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

{#each items as item (item.i)}
  <div>{item.name}</div>
{/each}

<TextField label="Customer name" bind:value={customerName} />
<TextField label="Contract number" bind:value={contractNo} />
<TextField label="Purchase order number" bind:value={poNo} />
<NumberField label="Price" bind:value={price} prefix-text="$" min="0" step="0.01" />

<Button onclick={onNewProject} variant="filled">Create project</Button>
