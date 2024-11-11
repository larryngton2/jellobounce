<script lang="ts">
    import { scale } from "svelte/transition";
    import { SortableList } from "@jhubbardsf/svelte-sortablejs";
    import "./menulist.scss";
    import { createEventDispatcher } from "svelte";
    import { expoOut } from "svelte/easing";

    export let sortable = false;
    export let elementCount = -1;

    let sortableElement: HTMLElement | undefined;

    interface MenuListSortEvent {
        newOrder: number[];
    }

    const dispatch = createEventDispatcher<{
        sort: MenuListSortEvent;
    }>();

    function handleChange(e: any) {
        dispatch("sort", {
            newOrder: calculateNewOrder(e.oldIndex, e.newIndex, elementCount),
        });
    }

    function calculateNewOrder(
        oldIndex: number,
        newIndex: number,
        length: number,
    ): number[] {
        const a = Array.from({ length }, (x, i) => i);
        a.splice(oldIndex, 1);
        a.splice(newIndex, 0, oldIndex);
        return a;
    }
</script>

<div
    class="menu-list"
    transition:scale|global={{ duration: 500, easing: expoOut }}
>
    {#if sortable && elementCount > -1}
        <SortableList
            class="menu-list-items"
            onSort={handleChange}
            forceFallback={true}
            animation={150}
        >
            <slot />
        </SortableList>
    {:else}
        <div class="menu-list-items">
            <slot />
        </div>
    {/if}
</div>

<style lang="scss">
    @import "../../../../colors";

    .menu-list {
        background-color: rgba($background-color, $opacity);
        flex: 1;
        border-radius: 12px;
        position: relative;
        z-index: -1;
        box-shadow: $primary-shadow;
        //border: $border-thing;
    }
</style>
