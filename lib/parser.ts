export interface EnvVariable {
  key: string;
  value: string;
  line: number;
}

export interface ValidationIssue {
  key: string;
  type: "missing" | "empty" | "leak" | "format";
  message: string;
}

export function parseEnv(content: string): Map<string, EnvVariable> {
  const map = new Map<string, EnvVariable>();
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const match = trimmed.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match) {
      const [, key, rawVal] = match;
      const value = rawVal.replace(/^["'](.*)["']$/, "$1");
      map.set(key, { key, value, line: index + 1 });
    }
  });

  return map;
}

export function validateEnvs(
  targetEnv: string,
  exampleEnv: string
): { issues: ValidationIssue[]; healthScore: number } {
  const target = parseEnv(targetEnv);
  const example = parseEnv(exampleEnv);
  const issues: ValidationIssue[] = [];

  // 1. Missing keys from .env.example
  example.forEach((_, key) => {
    if (!target.has(key)) {
      issues.push({
        key,
        type: "missing",
        message: `Key "${key}" is defined in .env.example but missing.`,
      });
    }
  });

  // 2. Syntax and leak auditing
  target.forEach((item, key) => {
    if (!item.value.trim()) {
      issues.push({
        key,
        type: "empty",
        message: `Key "${key}" is empty.`,
      });
    }

    const sensitiveKeywords = ["SECRET", "KEY", "TOKEN", "PASSWORD", "PRIVATE"];
    const isSensitive = sensitiveKeywords.some((k) => key.toUpperCase().includes(k));
    if (key.startsWith("NEXT_PUBLIC_") && isSensitive) {
      issues.push({
        key,
        type: "leak",
        message: `Security Leak: "${key}" is exposed to the browser client bundle.`,
      });
    }

    if (key.endsWith("_URL") && !/^(https?|postgres(ql)?|mysql|mongodb(\+srv)?|redis(s)?):\/\//i.test(item.value)) {
      issues.push({
        key,
        type: "format",
        message: `Value for "${key}" is not a valid URL schema.`,
      });
    }
  });

  const totalKeys = example.size || target.size || 1;
  const healthScore = Math.max(0, 100 - (issues.length / totalKeys) * 100);

  return { issues, healthScore: Math.round(healthScore) };
}
