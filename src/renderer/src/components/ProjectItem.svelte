<script lang="ts">
  // MARK: Types
  // -----------------------------------------------------------------------------
  type Project = {
    contractNo: string
    poNo: string
    price: number
    customerName: string
    created: Date | string
    releaseDate: Date | null
    notes: string
  }

  type Props = {
    project: Project
    onRelease: () => void
    onDelete: () => void
  }

  // MARK: Components
  // -----------------------------------------------------------------------------
  import { Divider } from '@moss/comp/divider'
  import { ListItem } from '@moss/comp/list'
  import { Icon } from '@moss/comp/icon'
  import { Menu, MenuItem } from '@moss/comp/menu'

  // MARK: Stores
  // -----------------------------------------------------------------------------
  // MARK: Properties
  // -----------------------------------------------------------------------------
  let { project, onDelete, onRelease }: Props = $props()

  // MARK: Globals
  // -----------------------------------------------------------------------------
  // MARK: Helpers
  // -----------------------------------------------------------------------------
  // MARK: State
  // -----------------------------------------------------------------------------
  let open = $state(false)

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
  function toggleMenu() {
    open = !open
  }

  // MARK: Lifecycle
  // -----------------------------------------------------------------------------
</script>

<span style="position: relative">
  <ListItem type="button" id="project-row-{project.contractNo}" onclick={toggleMenu}>
    <div data-slot="headline">{project.contractNo} - {project.customerName}</div>
    <div data-slot="supporting-text">PO: {project.poNo}</div>
    <Icon data-slot="end">more_vert</Icon>
  </ListItem>

  <Menu
    anchor="project-row-{project.contractNo}"
    bind:open
    anchor-corner="start-end"
    menu-corner="end-end"
  >
    <MenuItem onclick={onRelease}>
      <div data-slot="headline">Release</div>
      <Icon data-slot="end">assignment_turned_in</Icon>
    </MenuItem>
    <Divider role="separator" tabindex="-1" />
    <MenuItem onclick={onDelete}>
      <div data-slot="headline">Delete</div>
      <Icon data-slot="end">delete</Icon>
    </MenuItem>
  </Menu>
</span>
