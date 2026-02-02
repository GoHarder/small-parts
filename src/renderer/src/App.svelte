<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity'

  // MARK: Types
  // -----------------------------------------------------------------------------
  type MainError = {
    code: string
    message: string
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import NewProject from './pages/new-project/Page.svelte'
  import Projects from './pages/projects/Page.svelte'
  import Report from './pages/report/Page.svelte'
  import Settings from './pages/settings/Page.svelte'

  import { Dialog } from '@moss/comp/dialog'
  import { Button } from '@moss/comp/button'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  // MARK: Globals
  // -----------------------------------------------------------------------------
  const pageMap = new SvelteMap([
    ['new-project', NewProject],
    ['projects', Projects],
    ['report', Report],
    ['settings', Settings]
  ])

  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let pageName = $state<string>('projects')
  let dialogOpen = $state(false)
  let error = $state<MainError>()

  // MARK: Derived
  // -----------------------------------------------------------------------------
  let Page = $derived(pageMap.get(pageName))

  // MARK: Effects
  // -----------------------------------------------------------------------------
  // MARK: Contexts
  // -----------------------------------------------------------------------------
  // MARK: Subscriptions
  // -----------------------------------------------------------------------------
  // MARK: Events
  // -----------------------------------------------------------------------------
  function setPage(page: string) {
    pageName = page
  }

  window.api.error.listen((update) => {
    error = update
    dialogOpen = true
  })

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<Page {setPage} />

<Dialog bind:open={dialogOpen}>
  <div data-slot="headline">{error?.code || 'Error'}</div>

  <div data-slot="content">
    <p>{error?.message || 'Unknown error'}</p>
  </div>
  <div data-slot="actions">
    <Button onclick={() => (dialogOpen = false)}>Ok</Button>
  </div>
</Dialog>
