<script lang="ts">
import type { HTMLInputAttributes } from "svelte/elements";
import Button from "./Button.svelte";

let {
  label,
  hideLabel = false,
  value = $bindable(""),
  type = "text",
  placeholder,
  help,
  error,
  disabled = false,
  search = false,
  action = "Go",
  id,
  ...rest
}: {
  label: string;
  hideLabel?: boolean;
  value?: string;
  type?: string;
  placeholder?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  search?: boolean;
  action?: string;
  id?: string;
} & HTMLInputAttributes = $props();

const uid = $props.id();
const inputId = $derived(id ?? uid);
const helpId = $derived(`${inputId}-help`);
const errorId = $derived(`${inputId}-error`);
const describedBy = $derived(
  [help && helpId, error && errorId].filter(Boolean).join(" ") || undefined,
);
</script>

{#snippet input()}
  <input
    {...rest}
    class={["dex-field__input", rest.class]}
    id={inputId}
    type={search ? "search" : type}
    {placeholder}
    {disabled}
    aria-invalid={error ? "true" : undefined}
    aria-describedby={describedBy}
    bind:value
  />
{/snippet}

<div class={["dex-field", search && "dex-field--search"]}>
  <label class={["dex-field__label", hideLabel && "visually-hidden"]} for={inputId}>
    {label}
  </label>
  {#if search}
    <div class="dex-field__row">
      {@render input()}
      <Button type="submit" {disabled}>{action}</Button>
    </div>
  {:else}
    {@render input()}
  {/if}
  {#if help}
    <p class="dex-field__help" id={helpId}>{help}</p>
  {/if}
  {#if error}
    <p class="dex-field__error" id={errorId}>{error}</p>
  {/if}
</div>
