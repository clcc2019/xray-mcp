export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Validate Xray configuration
 */
export declare function validateConfig(config: unknown): ValidationResult;
/**
 * Format validation result as string
 */
export declare function formatValidationResult(result: ValidationResult): string;
//# sourceMappingURL=validator.d.ts.map