<script lang="ts">
  import CodeMirror from 'svelte-codemirror-editor';
  import { json } from '@codemirror/lang-json';
  import { createTheme } from '@uiw/codemirror-themes';
  import { tags as t } from '@lezer/highlight';

  const promptableLight = createTheme({
    theme: 'light',
    settings: {
      background: 'hsl(0 0% 100%)', // --background
      foreground: 'hsl(240 6% 10%)', // --foreground
      caret: 'hsl(240 6% 10%)', // --primary
      selection: 'hsl(240 5% 96% / 0.5)', // --accent with opacity
      selectionMatch: 'hsl(240 5% 96% / 0.3)', // --accent with lower opacity
      lineHighlight: 'hsl(240 5% 96% / 0.3)', // --accent with opacity
      gutterBackground: 'hsl(0 0% 100%)', // --background
      gutterForeground: 'hsl(240 4% 46%)', // --muted-foreground
      gutterBorder: '1px solid hsl(240 6% 90%)', // --border
    },
    styles: [
      { tag: t.comment, color: 'hsl(240 4% 46%)' }, // --muted-foreground
      { tag: t.variableName, color: 'hsl(240 6% 10%)' }, // --primary
      { tag: [t.string, t.special(t.brace)], color: 'hsl(173 58% 39%)' }, // --chart-1
      { tag: t.number, color: 'hsl(12 76% 61%)' }, // --chart-2
      { tag: t.bool, color: 'hsl(197 37% 24%)' }, // --chart-3
      { tag: t.null, color: 'hsl(43 74% 66%)' }, // --chart-4
      { tag: t.keyword, color: 'hsl(27 87% 67%)' }, // --chart-5
      { tag: t.operator, color: 'hsl(240 6% 10%)' }, // --primary
      { tag: t.className, color: 'hsl(173 58% 39%)' }, // --chart-1
      { tag: t.definition(t.typeName), color: 'hsl(12 76% 61%)' }, // --chart-2
      { tag: t.typeName, color: 'hsl(197 37% 24%)' }, // --chart-3
      { tag: t.angleBracket, color: 'hsl(240 6% 10%)' }, // --primary
      { tag: t.tagName, color: 'hsl(173 58% 39%)' }, // --chart-1
      { tag: t.attributeName, color: 'hsl(12 76% 61%)' }, // --chart-2
    ],
  });

  const promptableDark = createTheme({
    theme: 'dark',
    settings: {
      background: 'hsl(240 10% 4%)', // --background
      foreground: 'hsl(0 0% 98%)', // --foreground
      caret: 'hsl(0 0% 98%)', // --primary
      selection: 'hsl(240 4% 16% / 0.5)', // --accent with opacity
      selectionMatch: 'hsl(240 4% 16% / 0.3)', // --accent with lower opacity
      lineHighlight: 'hsl(240 4% 16% / 0.3)', // --accent with opacity
      gutterBackground: 'hsl(240 10% 4%)', // --background
      gutterForeground: 'hsl(240 5% 65%)', // --muted-foreground
      gutterBorder: '1px solid hsl(240 4% 16%)', // --border
    },
    styles: [
      { tag: t.comment, color: 'hsl(240 5% 65%)' }, // --muted-foreground
      { tag: t.variableName, color: 'hsl(0 0% 98%)' }, // --primary
      { tag: [t.string, t.special(t.brace)], color: 'hsl(220 70% 50%)' }, // --chart-1
      { tag: t.number, color: 'hsl(340 75% 55%)' }, // --chart-2
      { tag: t.bool, color: 'hsl(30 80% 55%)' }, // --chart-3
      { tag: t.null, color: 'hsl(280 65% 60%)' }, // --chart-4
      { tag: t.keyword, color: 'hsl(160 60% 45%)' }, // --chart-5
      { tag: t.operator, color: 'hsl(0 0% 98%)' }, // --primary
      { tag: t.className, color: 'hsl(220 70% 50%)' }, // --chart-1
      { tag: t.definition(t.typeName), color: 'hsl(340 75% 55%)' }, // --chart-2
      { tag: t.typeName, color: 'hsl(30 80% 55%)' }, // --chart-3
      { tag: t.angleBracket, color: 'hsl(0 0% 98%)' }, // --primary
      { tag: t.tagName, color: 'hsl(220 70% 50%)' }, // --chart-1
      { tag: t.attributeName, color: 'hsl(340 75% 55%)' }, // --chart-2
    ],
  });

  let {
    value = $bindable(),
    disabled = false,
  }: {
    value?: string;
    disabled?: boolean;
  } = $props();
</script>

<CodeMirror
  class="
        border-input bg-background ring-offset-background placeholder:text-muted-foreground
        focus-visible:ring-ring flex min-h-[80px] w-full rounded-xl border px-3 py-2 text-base
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
    "
  placeholder={'Enter {{ for variables'}
  bind:value
  lang={json()}
  theme={promptableLight}
  lineWrapping={true}
  readonly={disabled}
/>
