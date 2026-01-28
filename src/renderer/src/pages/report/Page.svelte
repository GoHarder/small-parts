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
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Icon } from '@moss/comp/icon'
  import { IconButton } from '@moss/comp/icon-button'

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
    return dateFormatter.format(date)
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
      const { completed, contractNo, customerName, price } = project
      return `${dateString(completed)}\t${price}\t${contractNo}\t${customerName}`
    })

    const text = lines.join('\n')

    navigator.clipboard.writeText(text)
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
  onMount(async () => {
    report = await window.api.projects.getReport()
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
    <td>{priceString(project.price)}</td>
  </tr>
{/snippet}

{#snippet reportCard(section: Section)}
  {#if section.projects.length > 0}
    <div class="wrapper">
      <table>
        <caption>
          Week of {dateString(section.monday)}
        </caption>
        <thead>
          <tr>
            <th>Date</th><th>Contract</th><th>Customer</th><th>Price</th>
          </tr>
        </thead>
        <tbody>
          {#each section.projects as project (project._id)}
            {@render tableRow(project)}
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <th class="total" scope="row" colspan="3">Total</th>
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
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .wrapper {
    width: min(2000px, 100% - 24px);
    margin-inline: auto;
    display: flex;
    justify-content: flex-start;
  }

  table {
    // width: 100%;
    background-color: var(--md-sys-color-surface-container-highest);
    border-collapse: collapse;
    border-end-start-radius: var(--md-sys-shape-corner-medium);
    border-end-end-radius: var(--md-sys-shape-corner-medium);
  }

  caption,
  th,
  td {
    padding-inline: 1rem;
    padding-block: 0.5rem;
  }

  td:last-child {
    padding-inline-end: 0;
  }

  caption {
    background-color: var(--md-sys-color-surface-container-highest);
    border-start-start-radius: var(--md-sys-shape-corner-medium);
    border-start-end-radius: var(--md-sys-shape-corner-medium);

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
