---
name: accessibility
description: Use this skill when implementing accessibility features, auditing for a11y compliance, or ensuring WCAG standards. Triggers on requests about accessibility, a11y, screen readers, keyboard navigation, or WCAG.
---

# Accessibility Skill

Ensure Legacy Insight meets **WCAG 2.1 AA** standards.

## Core Principles (POUR)

| Principle          | Description                               |
| ------------------ | ----------------------------------------- |
| **P**erceivable    | Content can be perceived by all users     |
| **O**perable       | Interface can be operated by all users    |
| **U**nderstandable | Content and UI are understandable         |
| **R**obust         | Content works with assistive technologies |

## Reshaped Accessibility

Reshaped components are built with accessibility in mind. Always use them properly:

```tsx
// Button with accessible label
<Button
  icon={<Icon name="trash" />}
  aria-label="Delete item"
/>

// Form fields with labels
<TextField
  name="email"
  label="Email address"
  inputAttributes={{
    'aria-describedby': 'email-hint',
    required: true,
  }}
/>
<Text id="email-hint" variant="caption">We'll never share your email</Text>

// Modal with proper focus
<Modal
  active={isOpen}
  onClose={handleClose}
  aria-labelledby="modal-title"
>
  <Modal.Title id="modal-title">Confirm Action</Modal.Title>
</Modal>
```

## Semantic HTML

```tsx
// Use semantic elements
<nav aria-label="Main navigation">
  <ul>
    <li><Link href="/dashboard">Dashboard</Link></li>
  </ul>
</nav>

<main>
  <article>
    <header>
      <h1>Page Title</h1>
    </header>
    <section aria-labelledby="section-title">
      <h2 id="section-title">Section</h2>
    </section>
  </article>
</main>

// Heading hierarchy (never skip levels)
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
```

## Keyboard Navigation

```tsx
// Ensure interactive elements are focusable
<View
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Interactive Element
</View>

// Skip links for main content
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<main id="main-content" tabIndex={-1}>
  {/* content */}
</main>
```

## Focus Management

```tsx
// Focus trap in modals (Reshaped handles this)
<Modal active={isOpen} onClose={handleClose}>
  {/* Focus is trapped inside */}
</Modal>;

// Return focus after modal closes
const triggerRef = useRef<HTMLButtonElement>(null);

const handleClose = () => {
  setIsOpen(false);
  triggerRef.current?.focus();
};

<Button ref={triggerRef} onClick={() => setIsOpen(true)}>
  Open Modal
</Button>;
```

## Images and Media

```tsx
// Informative images need alt text
<img src="/chart.png" alt="Sales increased 25% in Q4 2024" />

// Decorative images use empty alt
<img src="/decorative-pattern.svg" alt="" aria-hidden="true" />

// Icons with meaning
<Icon name="warning" aria-label="Warning" />

// Decorative icons
<Icon name="star" aria-hidden="true" />
```

## Color and Contrast

```scss
// Use Reshaped tokens for proper contrast
.text {
  color: var(--rs-color-foreground);
  background: var(--rs-color-background);
}

// Don't rely on color alone
.status {
  // BAD: Color only
  &.error {
    color: var(--rs-color-critical);
  }

  // GOOD: Color + icon
  &.error {
    color: var(--rs-color-critical);
    &::before {
      content: '⚠ ';
    }
  }
}
```

## Forms

```tsx
// Always label form fields
<FormControl>
  <FormControl.Label>Username</FormControl.Label>
  <TextField name="username" />
  <FormControl.Helper>Must be 3-20 characters</FormControl.Helper>
</FormControl>

// Error messages
<TextField
  name="email"
  hasError={!!errors.email}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <Text id="email-error" color="critical" role="alert">
    {errors.email.message}
  </Text>
)}

// Required fields
<TextField
  label="Email"
  inputAttributes={{ required: true, 'aria-required': true }}
/>
```

## Loading States

```tsx
// Announce loading states
<View aria-busy={isLoading} aria-live="polite">
  {isLoading ? (
    <Loader aria-label="Loading content" />
  ) : (
    <Content />
  )}
</View>

// Skeleton with accessible label
<Skeleton aria-label="Loading user profile" />
```

## Tables

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Cell as="th" scope="col">
        Name
      </Table.Cell>
      <Table.Cell as="th" scope="col">
        Status
      </Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Campaign A</Table.Cell>
      <Table.Cell>Active</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## Testing Checklist

### Keyboard Testing

- [ ] All interactive elements reachable with Tab
- [ ] Focus order is logical
- [ ] Focus indicator visible
- [ ] Escape closes modals/dropdowns
- [ ] Enter/Space activates buttons

### Screen Reader Testing

- [ ] Page title announced
- [ ] Headings hierarchy correct
- [ ] Images have appropriate alt text
- [ ] Form labels announced
- [ ] Error messages announced
- [ ] Loading states announced

### Visual Testing

- [ ] 4.5:1 contrast ratio for text
- [ ] 3:1 for large text and UI components
- [ ] Works at 200% zoom
- [ ] No content lost in horizontal scroll

## Common Issues to Avoid

```tsx
// BAD: Click handler on non-interactive element
<div onClick={handleClick}>Click me</div>

// GOOD: Use button
<Button onClick={handleClick}>Click me</Button>

// BAD: Empty link
<a href="#"><Icon name="settings" /></a>

// GOOD: Accessible link
<a href="/settings" aria-label="Settings">
  <Icon name="settings" aria-hidden="true" />
</a>

// BAD: Placeholder as label
<TextField placeholder="Email" />

// GOOD: Proper label
<TextField label="Email" placeholder="you@example.com" />
```
