<script lang="ts">
  import Button from '../common/Button.svelte';
  import Card from '../common/Card.svelte';
  import Form from '../common/Form.svelte';
  import Input from '../common/Input.svelte';

  // Props
  export let username: string;
  export let password: string;
  export let onSubmit: (event: SubmitEvent) => void;
</script>

<Card title="Login">
  <Form onSubmit={onSubmit}>
    <Input
      type="text"
      placeholder="Username"
      bind:value={username}
      autocomplete="username"
      required
    />
    <Input
      type="password"
      placeholder="Password"
      bind:value={password}
      autocomplete="current-password"
      password
      required
    />
    <Button type="submit" text="Login" />
  </Form>
</Card>
