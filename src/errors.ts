// SPDX-License-Identifier: MIT

/**
 * Standardized error types for Abstract Names SDK
 * Provides user-friendly error messages for common contract and network errors
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INSUFFICIENT_PAYMENT = 'INSUFFICIENT_PAYMENT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NAME_EXPIRED = 'NAME_EXPIRED',
  NAME_TAKEN = 'NAME_TAKEN',
  INVALID_PROOF = 'INVALID_PROOF',
  INVALID_TEXT_KEY = 'INVALID_TEXT_KEY',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Structured error object with both technical and user-friendly messages
 */
export interface AbstractNamesError {
  /** Error category for programmatic handling */
  type: ErrorType;
  /** Technical error message from the underlying error */
  message: string;
  /** User-friendly message suitable for display in UI */
  userMessage: string;
  /** Optional additional error details */
  details?: unknown;
}

/**
 * Parse raw errors from wagmi/viem into structured AbstractNamesError
 * Analyzes error messages to categorize and provide user-friendly descriptions
 *
 * @param error - Raw error from contract call or network request
 * @returns Structured error with type and user-friendly message, or null if no error
 */
export function parseContractError(
  error: Error | null
): AbstractNamesError | null {
  if (!error) return null;

  const msg = error.message.toLowerCase();

  // Contract validation errors
  if (msg.includes('invalidlength')) {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: error.message,
      userMessage: 'Name must be between 3 and 63 characters.',
    };
  }

  if (msg.includes('invalidcharacter')) {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: error.message,
      userMessage: 'Name contains invalid characters.',
    };
  }

  // Permission errors
  if (msg.includes('unauthorized')) {
    return {
      type: ErrorType.UNAUTHORIZED,
      message: error.message,
      userMessage: 'You do not own this name.',
    };
  }

  // State errors
  if (msg.includes('nameexpired')) {
    return {
      type: ErrorType.NAME_EXPIRED,
      message: error.message,
      userMessage: 'This name has expired.',
    };
  }

  if (msg.includes('nametaken') || msg.includes('alreadyregistered')) {
    return {
      type: ErrorType.NAME_TAKEN,
      message: error.message,
      userMessage: 'This name is already registered.',
    };
  }

  // Payment errors
  if (msg.includes('insufficientpayment') || msg.includes('invalidfee')) {
    return {
      type: ErrorType.INSUFFICIENT_PAYMENT,
      message: error.message,
      userMessage: 'Insufficient payment for this transaction.',
    };
  }

  // Proof/verification errors
  if (
    msg.includes('invalidproof') ||
    msg.includes('notwhitelisted') ||
    msg.includes('notwaitlisted')
  ) {
    return {
      type: ErrorType.INVALID_PROOF,
      message: error.message,
      userMessage: 'Invalid proof or not authorized for this phase.',
    };
  }

  // Text record errors
  if (msg.includes('invalidtextkey') || msg.includes('textkeyalreadyexists')) {
    return {
      type: ErrorType.INVALID_TEXT_KEY,
      message: error.message,
      userMessage: 'This text record key is not allowed.',
    };
  }

  // Network errors
  if (
    msg.includes('network') ||
    msg.includes('timeout') ||
    msg.includes('fetch')
  ) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: error.message,
      userMessage: 'Network error. Please check your connection.',
    };
  }

  // Generic contract errors
  if (msg.includes('revert') || msg.includes('execution reverted')) {
    return {
      type: ErrorType.CONTRACT_ERROR,
      message: error.message,
      userMessage: 'Transaction failed. Please try again.',
    };
  }

  // Unknown error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error.message,
    userMessage: 'An unexpected error occurred. Please try again.',
  };
}
