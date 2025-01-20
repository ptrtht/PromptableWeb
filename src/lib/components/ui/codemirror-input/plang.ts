// src/lib/editor/variable-language.ts
import { StreamLanguage, type StringStream } from "@codemirror/language"

const variableParser = {
  token(stream: StringStream, state: any): string | null {
    // Check for opening braces
    if (stream.match("{{")) {
      // Look ahead to determine variable type
      const ahead = stream.string.slice(stream.pos)
      
      if (ahead.match(/^context\./)) {
        stream.match(/context\.[a-zA-Z0-9._-]+(?=\}\})/)
        return "keyword"  // For context variables
      }
      
      // Match any other variable pattern (node variables)
      stream.match(/[a-zA-Z0-9._-]+(?=\}\})/)
      return "variable"  // Changed from definition to variable
    }
    
    // Match closing braces for variables
    if (stream.match("}}")) {
      return "bracket"
    }
    
    stream.next()
    return null
  }
}

export const variableLanguage = StreamLanguage.define(variableParser)

export function createVariableLanguage() {
  return [variableLanguage]
}