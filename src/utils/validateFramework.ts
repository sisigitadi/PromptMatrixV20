import Ajv from "ajv";
import frameworkSchema from "../schemas/framework.schema.json";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(frameworkSchema);

export function validateFramework(framework: any): {
  isValid: boolean;
  errors: any[] | null;
} {
  const isValid = validate(framework);
  if (!isValid) {
    return { isValid: false, errors: validate.errors };
  } else {
    return { isValid: true, errors: null };
  }
}
