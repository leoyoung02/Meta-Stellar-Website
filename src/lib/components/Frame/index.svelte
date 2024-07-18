<script lang="ts">
	import { type ComponentProps} from 'svelte';
	import {Frame} from "flowbite-svelte";
  import { twMerge } from 'tailwind-merge';

	// defined whether mouse track is recorded or not

	interface $$Props extends ComponentProps<Frame> {
    isMouseTrackRecord?: boolean;
		dataURL?: string;
  }

	
	
	let divClass;
	// $:divClass = twMerge('ms-frame ', $$props.rounded && 'rounded-lg', hoverTransform && "hover", $$props.class, imgHoverTransform && ("img-hover"))
	$:divClass = twMerge('ms-frame ', $$props.rounded && 'rounded-lg',  $$props.class)

</script>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div  style="perspective: 1000px;"> 
		<svelte:element this={"div"} {...$$restProps} 
			class={divClass} 
			on:focusin 
			on:focusout >
			<slot />
		</svelte:element>
	</div>