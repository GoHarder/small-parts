<script lang="ts">
  import { onMount } from 'svelte'

  // MARK: Types
  // -----------------------------------------------------------------------------
  type Props = {
    setPage: (page: string) => void
  }

  type Report = {
    thisWeek: {
      monday: string
      projects: Project[]
      total: number
    }
    lastWeek: {
      monday: string
      projects: Project[]
      total: number
    }
  }

  type Section = Report['thisWeek'] | Report['lastWeek']

  type Project = {
    _id: string
    customerName: string
    contractNo: string
    price: number
    completed: string | null
    user: string
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Icon } from '@moss/comp/icon'
  import { IconButton } from '@moss/comp/icon-button'
  import { Elevation } from '@moss/comp/elevation'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { setPage }: Props = $props()

  // MARK: Globals
  // -----------------------------------------------------------------------------
  const dateFormatter = new Intl.DateTimeFormat('en-US')
  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  // MARK: Helpers
  // -----------------------------------------------------------------------------
  function dateString(dateStr: string) {
    const date = new Date(dateStr)
    console.log(date)

    try {
      return dateFormatter.format(date)
    } catch (error) {
      return 'Invalid date'
    }
  }

  function priceString(price: number) {
    return priceFormatter.format(price)
  }

  // MARK: State
  // -----------------------------------------------------------------------------
  let report = $state<Report>()

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
  function copyTable(projects: Project[]) {
    const lines = projects.map((project) => {
      const { completed, contractNo, customerName, price, user } = project
      return `${dateString(completed)}\t${price}\t${contractNo}\t${customerName}\t${user}`
    })

    const text = lines.join('\n')

    navigator.clipboard.writeText(text)
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(async () => {
    const res = await window.api.projects.getReport()

    if (res.code) {
      // TODO: Handle error in UI
      return
    }

    res.lastWeek.projects.map((row) => {
      row.user = row.user.replace(/@.*$/, '')
      return row
    })

    res.thisWeek.projects.map((row) => {
      row.user = row.user.replace(/@.*$/, '')
      return row
    })

    report = res as Report
  })
</script>

<svelte:head>
  <title>Project Manager - Report</title>
</svelte:head>

<div class="app-bar">
  <IconButton tooltip="Back" onclick={() => setPage('projects')}>
    <Icon>arrow_back</Icon>
  </IconButton>
  <h1>Report</h1>
</div>

{#snippet tableRow(project: Project)}
  <tr>
    <td>{dateString(project.completed)}</td>
    <td>{project.contractNo}</td>
    <td>{project.customerName}</td>
    <td>{project.user}</td>
    <td>{priceString(project.price)}</td>
  </tr>
{/snippet}

{#snippet reportCard(section: Section)}
  {#if section.projects.length > 0}
    <div class="wrapper">
      <Elevation />
      <table>
        <caption>
          Week of {dateString(section.monday)}
        </caption>
        <thead>
          <tr>
            <th>Date</th><th>Contract</th><th>Customer</th><th>Engineer</th><th>Price</th>
          </tr>
        </thead>
        <tbody>
          {#each section.projects as project (project._id)}
            {@render tableRow(project)}
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <th class="total" scope="row" colspan="4">Total</th>
            <th>{priceString(section.total)}</th>
          </tr>
        </tfoot>
      </table>

      <IconButton
        tooltip="Copy"
        onclick={() => {
          copyTable(section.projects)
        }}
      >
        <Icon>backup_table</Icon>
      </IconButton>
    </div>
  {/if}
{/snippet}

{#if report}
  <div class="tables">
    {@render reportCard(report.lastWeek)}
    {@render reportCard(report.thisWeek)}
  </div>
{/if}

<style lang="scss">
  @use '../../assets/scss/mixin';

  .tables {
    align-items: start;

    padding-inline: 12px;
    --grid-max-col-qty: 2;
    --grid-gap: 8px;
    --grid-min-col-width: 500px;

    --grid-col-width-calc: calc(
      (100% - var(--grid-gap) * var(--grid-max-col-qty)) / var(--grid-max-col-qty)
    );
    --grid-col-min-size-calc: min(100%, max(var(--grid-min-col-width), var(--grid-col-width-calc)));

    display: grid;
    gap: var(--grid-gap);
    grid-template-columns: repeat(auto-fit, minmax(var(--grid-col-min-size-calc), 1fr));
  }

  .wrapper {
    position: relative;
    --md-elevation-level: 2; // width: min(2000px, 100% - 24px);
    width: 100%;
    margin-inline: auto;
    display: flex;
    justify-content: flex-start;
    background-color: var(--md-sys-color-surface-container-highest);
    border-radius: var(--md-sys-shape-corner-medium);
    padding-inline-end: 0.25rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  caption,
  th,
  td {
    padding-inline: 1rem;
    padding-block: 0.5rem;
  }

  caption {
    text-align: left;
    @include mixin.text-style('title-medium');
  }

  th {
    text-align: left;
    @include mixin.text-style('title-small');
  }

  .total {
    text-align: right;
  }
</style>
