# purify-objects

A powerful TypeScript library for cleaning objects by removing empty values, applying custom filters, and handling nested objects.

## Features

- Automatically remove empty values (null, undefined, "", {}, [])
- Support for custom cleaning conditions
- Handle nested objects
- Ability to preserve specific fields

## Installation

```bash
npm install purify-objects
```

## Usage

### CLI Usage

Clean JSON files directly from the command line:

```bash
# Clean and print to console
npx purify-objects input.json

# Clean and save to new file
npx purify-objects input.json --output cleaned.json

# Compare original and cleaned objects
npx purify-objects input.json --compare

# Use safe mode (won't modify original)
npx purify-objects input.json --safe

# Compare in safe mode
npx purify-objects input.json --compare --safe
```

The `--compare` flag shows:
- Original object
- Cleaned object
- List of removed fields

The `--safe` flag ensures:
- Original object remains unchanged
- Creates new copy for modifications
- Perfect for previewing changes

### Basic Cleaning

```typescript
import cleanObject from 'purify-objects';

const dirtyObject = {
  name: "Turki",
  age: null,
  address: {
    city: "Riyadh",
    street: "",
    zip: undefined,
  },
  tags: [],
};

const cleaned = cleanObject(dirtyObject);
// Result: { name: "Turki", address: { city: "Riyadh" } }
```

### Using Custom Cleaner

```typescript
const object = {
  name: "Turki",
  age: 0,
  points: 50,
};

const cleaned = cleanObject(object, (key, value) => value === 0);
```

### Preserving Fields

```typescript
const object = {
  name: "Turki",
  age: null,
  status: "",
  points: 0,
};

const cleaned = cleanObject(object, undefined, ["age", "points"]);
```

## API

```typescript
function cleanObject(
  obj: object,
  customCleaner?: (key: string, value: any) => boolean,
  keepFields?: string[],
  options?: CleanerOptions
): object

interface CleanerOptions {
  recursive?: boolean;
  safe?: boolean;
}
```

## License

MIT