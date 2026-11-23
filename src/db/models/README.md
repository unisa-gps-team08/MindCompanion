# Model Mongoose

Un file per model, con nome e campi presi dal class diagram in `docs/`.
Le route chiamano `connectDB()` da `@/db/connect` prima di usare un model.

```ts
import { Schema, model, models } from "mongoose";

const exampleSchema = new Schema({ name: { type: String, required: true } });

// `models.Example` evita OverwriteModelError quando Next.js ricarica il modulo.
export const Example = models.Example ?? model("Example", exampleSchema);
```
