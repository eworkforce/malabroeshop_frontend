<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-bold">UI Kit</h1>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">Buttons</h2>
      <div class="flex gap-4">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-4">Card</h2>
      <Card class="w-[350px]">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card content area. It's perfect for displaying product information or summaries.</p>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </section>

  </div>
</template>
