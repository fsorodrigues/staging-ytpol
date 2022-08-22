<script>
  //Row component is optional and only serves to render odd/even row, you can use <tr> instead.
  //Sort component is optional
  import Table, { Pagination, Row, Search, Sort } from "./Table.svelte";
  import { sortNumber, sortString } from "../../utils/sorting";

  // utils
  import { channelMap as channelLabelMap } from '../../utils/labels'
  import clusterColorMap from '../../utils/colors'
  import { formatThousandsComma } from '../../utils/format-numbers'

  export let data = [];
  let page = 0; //first page
  export let pageSize = 10;

  function onSortString(event) {
    event.detail.rows = sortString(
      event.detail.rows,
      event.detail.dir,
      event.detail.key
    );
  }

  function onSortNumber(event) {
    event.detail.rows = sortNumber(
      event.detail.rows,
      event.detail.dir,
      event.detail.key
    );
  }
</script>

<Table 
  { page } 
  { pageSize } 
  rows={ data } 
  responsive={false}
  let:rows={ rows2 }
>
  <thead slot="head">
    <tr>
      {#if data.length}
        {#each Object.entries(data[0]) as [k, v]}
          {@const type = Number.isFinite(v) ? 'number' : 'string'}
          {@const sorter = type === 'number' ? onSortNumber : onSortString}
          <th class={`header-cell header-cell-${type} header-cell-${k}`}>
            <div class='content'>{channelLabelMap.get(k)} <Sort key={k} on:sort={sorter} /></div>
          </th>
        {/each}
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each rows2 as row, index (row)}
      <Row {index}>
      {#each Object.entries(data[0]) as [k, v]}
        {@const type = Number.isFinite(v) ? 'number' : 'string'}
        {@const formatter = type === 'number' ? formatThousandsComma : (d) => d }
        {#if k === 'cluster'}
          <td 
            class={`row-cell row-cell-${type} row-cell-${k}`}
            data-label={channelLabelMap.get(k)}
          >
            <span class='cluster' style="--color: {clusterColorMap.get(row[k])}">{formatter(row[k])}</span>
          </td>
          {:else} <td 
            class={`row-cell row-cell-${type} row-cell-${k}`}
            data-label={channelLabelMap.get(k)}
          >
            {formatter(row[k])}
          </td>
        {/if}
      {/each}
      </Row>
    {/each}
  </tbody>
</Table>

<style lang='scss'>
  .header-cell {
    @include fs-xxs;

    @media (min-width: $bp-2) {
      @include fs-sm;
    }

    .content {
      display: flex;
      justify-content: space-between;
    }
  }

  .header-cell-number {
    .content {
      padding-left: 0;

      @media (min-width: $bp-3) {
        padding-left: 15px;
      }
    }
  }
  
  .row-cell-number {
    text-align: right;
  }

  .row-cell-string {
    text-align: left;
  }

  .row-cell-channel_name,
  .header-cell-channel_name {
    width: 40%;
  }

  .row-cell-cluster,
  .header-cell-cluster {
    width: 10%;
  }

  .row-cell-subscribers,
  .header-cell-subscribers,
  .row-cell-total_views,
  .header-cell-total_views,
  .row-cell-total_videos,
  .header-cell-total_videos {
    width: auto;

    @media (min-width: $bp-3) {
      width: calc(50% / 3)
    }
  }

  .cluster {
    background-color: var(--color);
    padding: 3px;
    border-radius: 3px;
    color: $white;
    font-weight: 700;
  }
</style>
