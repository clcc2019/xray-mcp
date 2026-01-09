export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate Xray configuration
 */
export function validateConfig(config: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (typeof config !== 'object' || config === null) {
    errors.push('Configuration must be an object');
    return { valid: false, errors, warnings };
  }
  
  const cfg = config as Record<string, unknown>;
  
  // Check inbounds
  if (!cfg.inbounds || !Array.isArray(cfg.inbounds)) {
    errors.push('Configuration must have "inbounds" array');
  } else if (cfg.inbounds.length === 0) {
    errors.push('Configuration must have at least one inbound');
  } else {
    const tags = new Set<string>();
    const ports = new Set<string>();
    
    for (let i = 0; i < cfg.inbounds.length; i++) {
      const inbound = cfg.inbounds[i] as Record<string, unknown>;
      
      // Check for duplicate tags
      if (inbound.tag) {
        if (tags.has(inbound.tag as string)) {
          errors.push(`Duplicate inbound tag: ${inbound.tag}`);
        }
        tags.add(inbound.tag as string);
      } else {
        warnings.push(`Inbound at index ${i} has no tag`);
      }
      
      // Check for duplicate ports
      const listen = (inbound.listen as string) || '0.0.0.0';
      const portKey = `${listen}:${inbound.port}`;
      if (ports.has(portKey)) {
        errors.push(`Duplicate inbound port: ${portKey}`);
      }
      ports.add(portKey);
      
      // Check required fields
      if (!inbound.protocol) {
        errors.push(`Inbound ${i}: missing protocol`);
      }
      if (!inbound.port) {
        errors.push(`Inbound ${i}: missing port`);
      }
      
      // Protocol-specific validation
      validateInboundProtocol(inbound, i, errors, warnings);
    }
  }
  
  // Check outbounds
  if (!cfg.outbounds || !Array.isArray(cfg.outbounds)) {
    errors.push('Configuration must have "outbounds" array');
  } else if (cfg.outbounds.length === 0) {
    errors.push('Configuration must have at least one outbound');
  } else {
    const tags = new Set<string>();
    
    for (let i = 0; i < cfg.outbounds.length; i++) {
      const outbound = cfg.outbounds[i] as Record<string, unknown>;
      
      // Check for duplicate tags
      if (outbound.tag) {
        if (tags.has(outbound.tag as string)) {
          errors.push(`Duplicate outbound tag: ${outbound.tag}`);
        }
        tags.add(outbound.tag as string);
      } else {
        warnings.push(`Outbound at index ${i} has no tag`);
      }
      
      // Check required fields
      if (!outbound.protocol) {
        errors.push(`Outbound ${i}: missing protocol`);
      }
      
      // Protocol-specific validation
      validateOutboundProtocol(outbound, i, errors, warnings);
    }
  }
  
  // Check routing references
  if (cfg.routing && typeof cfg.routing === 'object') {
    const routing = cfg.routing as Record<string, unknown>;
    const rules = routing.rules as Array<Record<string, unknown>> | undefined;
    
    if (rules && Array.isArray(rules)) {
      const outboundTags = new Set(
        (cfg.outbounds as Array<Record<string, unknown>>)?.map(o => o.tag as string).filter(Boolean) || []
      );
      const balancerTags = new Set(
        (routing.balancers as Array<Record<string, unknown>>)?.map(b => b.tag as string).filter(Boolean) || []
      );
      
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        
        if (rule.outboundTag && !outboundTags.has(rule.outboundTag as string)) {
          errors.push(`Routing rule ${i}: outboundTag "${rule.outboundTag}" not found`);
        }
        
        if (rule.balancerTag && !balancerTags.has(rule.balancerTag as string)) {
          errors.push(`Routing rule ${i}: balancerTag "${rule.balancerTag}" not found`);
        }
        
        if (!rule.outboundTag && !rule.balancerTag) {
          errors.push(`Routing rule ${i}: must have either outboundTag or balancerTag`);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateInboundProtocol(
  inbound: Record<string, unknown>,
  index: number,
  errors: string[],
  warnings: string[]
): void {
  const settings = inbound.settings as Record<string, unknown> | undefined;
  const streamSettings = inbound.streamSettings as Record<string, unknown> | undefined;
  
  switch (inbound.protocol) {
    case 'vless':
      if (!settings?.clients || !Array.isArray(settings.clients) || settings.clients.length === 0) {
        errors.push(`Inbound ${index} (vless): must have at least one client`);
      }
      if (settings?.decryption !== 'none') {
        warnings.push(`Inbound ${index} (vless): decryption should be "none"`);
      }
      break;
    
    case 'vmess':
      if (!settings?.clients || !Array.isArray(settings.clients) || settings.clients.length === 0) {
        errors.push(`Inbound ${index} (vmess): must have at least one client`);
      }
      break;
    
    case 'trojan':
      if (!settings?.clients || !Array.isArray(settings.clients) || settings.clients.length === 0) {
        errors.push(`Inbound ${index} (trojan): must have at least one client`);
      }
      // Trojan typically requires TLS
      if (streamSettings?.security !== 'tls' && streamSettings?.security !== 'reality') {
        warnings.push(`Inbound ${index} (trojan): should use TLS or REALITY for security`);
      }
      break;
    
    case 'shadowsocks':
      if (!settings?.password && (!settings?.clients || !Array.isArray(settings.clients) || settings.clients.length === 0)) {
        errors.push(`Inbound ${index} (shadowsocks): must have password or clients`);
      }
      break;
    
    case 'socks':
    case 'http':
      // These are typically local proxies, no special validation needed
      break;
    
    default:
      warnings.push(`Inbound ${index}: unknown protocol "${inbound.protocol}"`);
  }
  
  // Validate REALITY settings
  if (streamSettings?.security === 'reality') {
    const realitySettings = streamSettings.realitySettings as Record<string, unknown> | undefined;
    if (!realitySettings?.privateKey) {
      errors.push(`Inbound ${index}: REALITY requires privateKey`);
    }
    if (!realitySettings?.serverNames || !Array.isArray(realitySettings.serverNames) || realitySettings.serverNames.length === 0) {
      errors.push(`Inbound ${index}: REALITY requires serverNames`);
    }
    if (!realitySettings?.shortIds || !Array.isArray(realitySettings.shortIds) || realitySettings.shortIds.length === 0) {
      errors.push(`Inbound ${index}: REALITY requires shortIds`);
    }
    if (!realitySettings?.dest) {
      errors.push(`Inbound ${index}: REALITY requires dest`);
    }
  }
  
  // Validate TLS settings
  if (streamSettings?.security === 'tls') {
    const tlsSettings = streamSettings.tlsSettings as Record<string, unknown> | undefined;
    if (!tlsSettings?.certificates || !Array.isArray(tlsSettings.certificates) || tlsSettings.certificates.length === 0) {
      errors.push(`Inbound ${index}: TLS requires certificates`);
    }
  }
}

function validateOutboundProtocol(
  outbound: Record<string, unknown>,
  index: number,
  errors: string[],
  warnings: string[]
): void {
  const settings = outbound.settings as Record<string, unknown> | undefined;
  const streamSettings = outbound.streamSettings as Record<string, unknown> | undefined;
  
  switch (outbound.protocol) {
    case 'vless':
      if (!settings?.address) {
        errors.push(`Outbound ${index} (vless): must have address`);
      }
      if (!settings?.port) {
        errors.push(`Outbound ${index} (vless): must have port`);
      }
      if (!settings?.id) {
        errors.push(`Outbound ${index} (vless): must have id (UUID)`);
      }
      break;
    
    case 'vmess':
      if (!settings?.address) {
        errors.push(`Outbound ${index} (vmess): must have address`);
      }
      if (!settings?.port) {
        errors.push(`Outbound ${index} (vmess): must have port`);
      }
      if (!settings?.id) {
        errors.push(`Outbound ${index} (vmess): must have id (UUID)`);
      }
      break;
    
    case 'trojan':
      if (!settings?.address) {
        errors.push(`Outbound ${index} (trojan): must have address`);
      }
      if (!settings?.port) {
        errors.push(`Outbound ${index} (trojan): must have port`);
      }
      if (!settings?.password) {
        errors.push(`Outbound ${index} (trojan): must have password`);
      }
      break;
    
    case 'shadowsocks':
      if (!settings?.address) {
        errors.push(`Outbound ${index} (shadowsocks): must have address`);
      }
      if (!settings?.port) {
        errors.push(`Outbound ${index} (shadowsocks): must have port`);
      }
      if (!settings?.password) {
        errors.push(`Outbound ${index} (shadowsocks): must have password`);
      }
      if (!settings?.method) {
        errors.push(`Outbound ${index} (shadowsocks): must have method`);
      }
      break;
    
    case 'freedom':
    case 'blackhole':
      // These don't require additional settings
      break;
    
    default:
      warnings.push(`Outbound ${index}: unknown protocol "${outbound.protocol}"`);
  }
  
  // Validate REALITY client settings
  if (streamSettings?.security === 'reality') {
    const realitySettings = streamSettings.realitySettings as Record<string, unknown> | undefined;
    if (!realitySettings?.publicKey) {
      errors.push(`Outbound ${index}: REALITY requires publicKey`);
    }
    if (!realitySettings?.fingerprint) {
      warnings.push(`Outbound ${index}: REALITY should have fingerprint`);
    }
  }
}

/**
 * Format validation result as string
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];
  
  if (result.valid) {
    lines.push('✓ Configuration is valid');
  } else {
    lines.push('✗ Configuration is invalid');
  }
  
  if (result.errors.length > 0) {
    lines.push('\nErrors:');
    for (const error of result.errors) {
      lines.push(`  - ${error}`);
    }
  }
  
  if (result.warnings.length > 0) {
    lines.push('\nWarnings:');
    for (const warning of result.warnings) {
      lines.push(`  - ${warning}`);
    }
  }
  
  return lines.join('\n');
}
