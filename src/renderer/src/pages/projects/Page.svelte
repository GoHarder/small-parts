<script lang="ts">
  import { onMount } from 'svelte'

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    setPage: (page: string) => void
  }

  type Project = {
    _id: string
    customerName: string
    contractNo: string
    poNo: string
    user: string
    price: number
    created: Date | string
    completed: string | null
    released: string | null
    bookmarked: boolean
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import ListItem from './components/ListItem.svelte'

  import { Divider } from '@moss/comp/divider'
  import { Icon } from '@moss/comp/icon'
  import { IconButton } from '@moss/comp/icon-button'
  import { List } from '@moss/comp/list'
  import { Menu, MenuItem } from '@moss/comp/menu'
  import { Dialog } from '@moss/comp/dialog'
  import { Checkbox } from '@moss/comp/checkbox'
  import { Button } from '@moss/comp/button'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props()

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let projects = $state<Project[]>([])
  let menuOpen = $state(false)
  let dialogOpen = $state(false)

  let selected = $state<string>()
  let customerDrawings = $state(true)
  let orderChange = $state(false)
  let hasSheave = $state(false)

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let completedProjects = $derived(projects.filter((project) => project.completed !== null))
  let liveProjects = $derived(projects.filter((project) => project.completed === null))

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function toggleMenu() {
    menuOpen = !menuOpen
  }

  function onComplete(contractNo: string) {
    const project = projects.find((project) => project.contractNo === contractNo)
    if (!project) return
    project.completed = new Date().toISOString()

    const snap = $state.snapshot(project)

    window.api.projects.update(snap)
  }

  function onDelete(contractNo: string) {
    const project = projects.find((project) => project.contractNo === contractNo)
    // TODO: Ask for confirmation
    window.api.projects.delete(`${project.contractNo} ${project.customerName}`)
  }

  function onEmail(contractNo: string) {
    dialogOpen = true
    selected = contractNo
  }

  function sendEmail() {
    const project = projects.find((project) => project.contractNo === selected)
    if (!project) return

    const snap = $state.snapshot(project)

    window.api.email.send(snap, {
      customerDrawings,
      orderChange,
      hasSheave
    })
  }

  window.api.projects.listen((update) => {
    projects = update
  })

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(() => {
    if (projects.length === 0) window.api.projects.get()
  })
</script>

<svelte:head>
  <title>Project Manager - Projects</title>
</svelte:head>

<Dialog bind:open={dialogOpen}>
  <div data-slot="headline">Email selection</div>

  <form data-slot="content" id="email-form" method="dialog">
    <Divider />
    <div class="option">
      <Checkbox id="cust-dwg" bind:checked={customerDrawings} />
      <label for="cust-dwg">Customer drawings</label>
    </div>
    <div class="option">
      <Checkbox id="order-chng" bind:checked={orderChange} disabled />
      <label for="order-chng">Order changes</label>
    </div>
    <div class="option">
      <Checkbox id="has-sheave" bind:checked={hasSheave} disabled={customerDrawings} />
      <label for="has-sheave">Traction sheave</label>
    </div>
    <Divider />
  </form>

  <div data-slot="actions">
    <Button form="email-form">Cancel</Button>
    <Button form="email-form" onclick={sendEmail}>Ok</Button>
  </div>
</Dialog>

<!-- <Dialog></Dialog> -->

<div class="app-bar">
  <span style="position: relative">
    <IconButton id="main-menu" tooltip="Menu" onclick={toggleMenu}>
      <Icon>menu</Icon>
    </IconButton>

    <Menu anchor="main-menu" bind:open={menuOpen}>
      <MenuItem onclick={() => setPage('new-project')}>
        <div data-slot="headline">New</div>
        <Icon data-slot="start">assignment_add</Icon>
      </MenuItem>
      <MenuItem onclick={() => setPage('report')}>
        <div data-slot="headline">Report</div>
        <Icon data-slot="start">table</Icon>
      </MenuItem>
      <MenuItem onclick={() => setPage('settings')}>
        <div data-slot="headline">Settings</div>
        <Icon data-slot="start">settings</Icon>
      </MenuItem>
      <Divider role="separator" tabindex="-1" />
      <MenuItem>
        <div data-slot="headline">Exit</div>
        <Icon data-slot="start">close</Icon>
      </MenuItem>
    </Menu>
  </span>

  <h1>Projects</h1>
</div>

<div class="cards">
  <div class="card">
    <h2>Live projects</h2>
    <List>
      {#each liveProjects as project (project.contractNo)}
        <ListItem
          {project}
          onComplete={() => onComplete(project.contractNo)}
          onDelete={() => onDelete(project.contractNo)}
          onEmail={() => onEmail(project.contractNo)}
        />
      {/each}
    </List>
  </div>
  <div class="card">
    <h2>Completed projects</h2>
    <List>
      {#each completedProjects as project (project.contractNo)}
        <ListItem {project} />
      {/each}
    </List>
  </div>
</div>

<style lang="scss">
  @use '../../assets/scss/mixin';

  .cards {
    // display: flex;
    // gap: 8px;
    padding-inline: 12px;
    --grid-max-col-qty: 2;
    --grid-gap: 8px;
    --grid-min-col-width: 400px;

    --grid-col-width-calc: calc(
      (100% - var(--grid-gap) * var(--grid-max-col-qty)) / var(--grid-max-col-qty)
    );
    --grid-col-min-size-calc: min(100%, max(var(--grid-min-col-width), var(--grid-col-width-calc)));

    display: grid;
    gap: var(--grid-gap);
    grid-template-columns: repeat(auto-fit, minmax(var(--grid-col-min-size-calc), 1fr));
  }

  .card {
    background-color: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-medium);
    border-color: var(--md-sys-color-outline-variant);
    border-width: 1px;
    border-style: solid;
    padding-inline: 12px;

    h2 {
      @include mixin.text-style('title-medium');
      margin-block-end: 0;
    }
  }

  .option {
    display: grid;
    align-items: center;
    justify-items: center;

    grid-template-columns: 40px 1fr;
    height: 40px;

    label {
      justify-self: start;
    }
  }
</style>
