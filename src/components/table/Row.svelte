<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
  
    export let index = 0;
  
    function onClick(event) {
      dispatch("click", event);
    }
  </script>
  
  <style lang='scss'>
    .odd {
      background-color: $light-grey;
    }

    .row {
      height: 28px;
      @include fs-sm;
    }

  </style>
  
  <tr
      on:click={onClick}
      class={`row ${$$props.class}`}
      class:odd={index % 2 !== 0}
      class:even={index % 2 === 0}
    >
      <slot />
  </tr>
  