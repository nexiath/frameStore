interface FrameButton {
  label: string;
  target?: string;
  action?: 'post' | 'post_redirect' | 'link';
}

interface FrameObject {
  'fc:frame': string;
  'fc:frame:image': string;
  'fc:frame:button:1'?: string;
  'fc:frame:button:2'?: string;
  'fc:frame:button:1:action'?: string;
  'fc:frame:button:2:action'?: string;
  'fc:frame:button:1:target'?: string;
  'fc:frame:button:2:target'?: string;
  'fc:frame:post_url'?: string;
  'og:title': string;
  'og:description': string;
  'og:image': string;
}

// URL validation regex
const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/;

/**
 * Validates if a string is a valid URL
 */
function isValidURL(url: string): boolean {
  return URL_REGEX.test(url);
}

/**
 * Validates a Farcaster Frame object according to the official specification
 * @param frame - The frame object to validate
 * @returns boolean - true if valid, false otherwise
 */
export function validateFrame(frame: any): boolean {
  try {
    // Check if frame is an object
    if (!frame || typeof frame !== 'object') {
      return false;
    }

    // Required fields
    if (frame['fc:frame'] !== 'vNext') {
      return false;
    }

    if (!frame['fc:frame:image'] || !isValidURL(frame['fc:frame:image'])) {
      return false;
    }

    if (!frame['og:title'] || typeof frame['og:title'] !== 'string' || frame['og:title'].trim().length === 0) {
      return false;
    }

    if (!frame['og:description'] || typeof frame['og:description'] !== 'string' || frame['og:description'].trim().length === 0) {
      return false;
    }

    if (!frame['og:image'] || !isValidURL(frame['og:image'])) {
      return false;
    }

    // Validate buttons (max 4 buttons)
    const buttons: FrameButton[] = [];
    for (let i = 1; i <= 4; i++) {
      const buttonLabel = frame[`fc:frame:button:${i}`];
      if (buttonLabel) {
        const buttonAction = frame[`fc:frame:button:${i}:action`] || 'post';
        const buttonTarget = frame[`fc:frame:button:${i}:target`];

        // Button label must be non-empty string
        if (typeof buttonLabel !== 'string' || buttonLabel.trim().length === 0) {
          return false;
        }

        // Validate button action
        if (!['post', 'post_redirect', 'link'].includes(buttonAction)) {
          return false;
        }

        // If action is 'link', target must be a valid URL
        if (buttonAction === 'link') {
          if (!buttonTarget || !isValidURL(buttonTarget)) {
            return false;
          }
        }

        buttons.push({
          label: buttonLabel,
          action: buttonAction,
          target: buttonTarget
        });
      }
    }

    // Must have at least one button
    if (buttons.length === 0) {
      return false;
    }

    // If any button has a 'post' or 'post_redirect' action, post_url should exist
    const hasPostAction = buttons.some(button => 
      button.action === 'post' || button.action === 'post_redirect'
    );
    
    if (hasPostAction) {
      const postUrl = frame['fc:frame:post_url'];
      if (!postUrl || !isValidURL(postUrl)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validates and returns detailed validation errors
 * @param frame - The frame object to validate
 * @returns object with isValid boolean and errors array
 */
export function validateFrameWithErrors(frame: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if frame is an object
  if (!frame || typeof frame !== 'object') {
    errors.push('Frame must be an object');
    return { isValid: false, errors };
  }

  // Required fields validation
  if (frame['fc:frame'] !== 'vNext') {
    errors.push('fc:frame must be "vNext"');
  }

  if (!frame['fc:frame:image']) {
    errors.push('fc:frame:image is required');
  } else if (!isValidURL(frame['fc:frame:image'])) {
    errors.push('fc:frame:image must be a valid URL');
  }

  if (!frame['og:title']) {
    errors.push('og:title is required');
  } else if (typeof frame['og:title'] !== 'string' || frame['og:title'].trim().length === 0) {
    errors.push('og:title must be a non-empty string');
  }

  if (!frame['og:description']) {
    errors.push('og:description is required');
  } else if (typeof frame['og:description'] !== 'string' || frame['og:description'].trim().length === 0) {
    errors.push('og:description must be a non-empty string');
  }

  if (!frame['og:image']) {
    errors.push('og:image is required');
  } else if (!isValidURL(frame['og:image'])) {
    errors.push('og:image must be a valid URL');
  }

  // Validate buttons
  const buttons: FrameButton[] = [];
  for (let i = 1; i <= 4; i++) {
    const buttonLabel = frame[`fc:frame:button:${i}`];
    if (buttonLabel) {
      const buttonAction = frame[`fc:frame:button:${i}:action`] || 'post';
      const buttonTarget = frame[`fc:frame:button:${i}:target`];

      if (typeof buttonLabel !== 'string' || buttonLabel.trim().length === 0) {
        errors.push(`Button ${i} label must be a non-empty string`);
      }

      if (!['post', 'post_redirect', 'link'].includes(buttonAction)) {
        errors.push(`Button ${i} action must be 'post', 'post_redirect', or 'link'`);
      }

      if (buttonAction === 'link') {
        if (!buttonTarget || !isValidURL(buttonTarget)) {
          errors.push(`Button ${i} with 'link' action must have a valid target URL`);
        }
      }

      buttons.push({
        label: buttonLabel,
        action: buttonAction,
        target: buttonTarget
      });
    }
  }

  if (buttons.length === 0) {
    errors.push('At least one button is required');
  }

  // Post URL validation
  const hasPostAction = buttons.some(button => 
    button.action === 'post' || button.action === 'post_redirect'
  );
  
  if (hasPostAction) {
    const postUrl = frame['fc:frame:post_url'];
    if (!postUrl || !isValidURL(postUrl)) {
      errors.push('fc:frame:post_url is required when using post or post_redirect actions');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Type guard to check if an object is a valid Frame
 */
export function isValidFrame(frame: any): frame is FrameObject {
  return validateFrame(frame);
}