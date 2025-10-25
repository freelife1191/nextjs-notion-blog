/**
 * Programming Language Utilities
 *
 * 프로그래밍 언어 관련 유틸리티 함수와 매핑
 * Prism.js 구문 강조를 위한 언어 매핑 및 라벨링
 */

/**
 * 언어 코드를 Prism.js 클래스로 매핑
 *
 * @example
 * getLanguageClass('js') // 'javascript'
 * getLanguageClass('ts') // 'typescript'
 */
export const LANGUAGE_CLASS_MAP: Record<string, string> = {
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'typescript',
  'ts': 'typescript',
  'tsx': 'tsx',
  'jsx': 'jsx',
  'python': 'python',
  'py': 'python',
  'java': 'java',
  'cpp': 'cpp',
  'c': 'c',
  'csharp': 'csharp',
  'cs': 'csharp',
  'php': 'php',
  'ruby': 'ruby',
  'rb': 'ruby',
  'go': 'go',
  'rust': 'rust',
  'rs': 'rust',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'kt': 'kotlin',
  'scala': 'scala',
  'r': 'r',
  'perl': 'perl',
  'lua': 'lua',
  'haskell': 'haskell',
  'hs': 'haskell',
  'elixir': 'elixir',
  'ex': 'elixir',
  'clojure': 'clojure',
  'clj': 'clojure',
  'dart': 'dart',
  'html': 'markup',
  'xml': 'markup',
  'markup': 'markup',
  'svg': 'markup',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  'stylus': 'stylus',
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'toml': 'toml',
  'ini': 'ini',
  'sql': 'sql',
  'graphql': 'graphql',
  'gql': 'graphql',
  'bash': 'bash',
  'shell': 'bash',
  'sh': 'bash',
  'zsh': 'bash',
  'powershell': 'powershell',
  'ps1': 'powershell',
  'dockerfile': 'dockerfile',
  'docker': 'dockerfile',
  'makefile': 'makefile',
  'make': 'makefile',
  'nginx': 'nginx',
  'apache': 'apacheconf',
  'git': 'git',
  'diff': 'diff',
  'patch': 'diff',
  'markdown': 'markdown',
  'md': 'markdown',
  'latex': 'latex',
  'tex': 'latex',
  'matlab': 'matlab',
  'octave': 'matlab',
  'text': 'text',
  'plain': 'text',
  'plaintext': 'text',
} as const;

/**
 * 언어 코드를 사람이 읽을 수 있는 라벨로 매핑
 *
 * @example
 * getLanguageLabel('js') // 'JavaScript'
 * getLanguageLabel('py') // 'Python'
 */
export const LANGUAGE_LABEL_MAP: Record<string, string> = {
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'tsx': 'TypeScript (JSX)',
  'jsx': 'JavaScript (JSX)',
  'python': 'Python',
  'py': 'Python',
  'java': 'Java',
  'cpp': 'C++',
  'c': 'C',
  'csharp': 'C#',
  'cs': 'C#',
  'php': 'PHP',
  'ruby': 'Ruby',
  'rb': 'Ruby',
  'go': 'Go',
  'rust': 'Rust',
  'rs': 'Rust',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'kt': 'Kotlin',
  'scala': 'Scala',
  'r': 'R',
  'perl': 'Perl',
  'lua': 'Lua',
  'haskell': 'Haskell',
  'hs': 'Haskell',
  'elixir': 'Elixir',
  'ex': 'Elixir',
  'clojure': 'Clojure',
  'clj': 'Clojure',
  'dart': 'Dart',
  'html': 'HTML',
  'xml': 'XML',
  'markup': 'Markup',
  'svg': 'SVG',
  'css': 'CSS',
  'scss': 'SCSS',
  'sass': 'Sass',
  'less': 'Less',
  'stylus': 'Stylus',
  'json': 'JSON',
  'yaml': 'YAML',
  'yml': 'YAML',
  'toml': 'TOML',
  'ini': 'INI',
  'sql': 'SQL',
  'graphql': 'GraphQL',
  'gql': 'GraphQL',
  'bash': 'Bash',
  'shell': 'Shell',
  'sh': 'Shell',
  'zsh': 'Zsh',
  'powershell': 'PowerShell',
  'ps1': 'PowerShell',
  'dockerfile': 'Dockerfile',
  'docker': 'Docker',
  'makefile': 'Makefile',
  'make': 'Makefile',
  'nginx': 'Nginx',
  'apache': 'Apache',
  'git': 'Git',
  'diff': 'Diff',
  'patch': 'Patch',
  'markdown': 'Markdown',
  'md': 'Markdown',
  'latex': 'LaTeX',
  'tex': 'LaTeX',
  'matlab': 'MATLAB',
  'octave': 'Octave',
  'text': 'Plain Text',
  'plain': 'Plain Text',
  'plaintext': 'Plain Text',
} as const;

/**
 * 언어 코드를 Prism.js 컴포넌트 이름으로 매핑
 * (동적 import를 위한 매핑: `prismjs/components/prism-{component}`)
 *
 * @example
 * getPrismComponent('js') // 'prism-javascript'
 * getPrismComponent('py') // 'prism-python'
 */
export const PRISM_COMPONENT_MAP: Record<string, string> = {
  'javascript': 'prism-javascript',
  'js': 'prism-javascript',
  'typescript': 'prism-typescript',
  'ts': 'prism-typescript',
  'tsx': 'prism-tsx',
  'jsx': 'prism-jsx',
  'python': 'prism-python',
  'py': 'prism-python',
  'sql': 'prism-sql',
  'bash': 'prism-bash',
  'sh': 'prism-bash',
  'shell': 'prism-bash',
  'json': 'prism-json',
  'html': 'prism-markup',
  'xml': 'prism-markup',
  'markup': 'prism-markup',
  'css': 'prism-css',
  'java': 'prism-java',
  'cpp': 'prism-cpp',
  'c': 'prism-c',
  'csharp': 'prism-csharp',
  'cs': 'prism-csharp',
  'php': 'prism-php',
  'ruby': 'prism-ruby',
  'rb': 'prism-ruby',
  'go': 'prism-go',
  'rust': 'prism-rust',
  'rs': 'prism-rust',
  'swift': 'prism-swift',
  'kotlin': 'prism-kotlin',
  'kt': 'prism-kotlin',
  'scala': 'prism-scala',
  'r': 'prism-r',
  'yaml': 'prism-yaml',
  'yml': 'prism-yaml',
  'toml': 'prism-toml',
  'graphql': 'prism-graphql',
  'gql': 'prism-graphql',
  'dockerfile': 'prism-docker',
  'docker': 'prism-docker',
  'nginx': 'prism-nginx',
  'git': 'prism-git',
  'diff': 'prism-diff',
  'markdown': 'prism-markdown',
  'md': 'prism-markdown',
} as const;

/**
 * 언어 코드에 해당하는 Prism.js 클래스명을 반환
 *
 * @param language - 언어 코드 (예: 'js', 'python', 'html')
 * @returns Prism.js 클래스명 (예: 'javascript', 'python', 'markup')
 */
export function getLanguageClass(language: string): string {
  const normalizedLang = language.toLowerCase().trim();
  return LANGUAGE_CLASS_MAP[normalizedLang] || normalizedLang;
}

/**
 * 언어 코드에 해당하는 사람이 읽을 수 있는 라벨을 반환
 *
 * @param language - 언어 코드 (예: 'js', 'python', 'html')
 * @returns 사람이 읽을 수 있는 라벨 (예: 'JavaScript', 'Python', 'HTML')
 */
export function getLanguageLabel(language: string): string {
  const normalizedLang = language.toLowerCase().trim();
  return LANGUAGE_LABEL_MAP[normalizedLang] || language.toUpperCase();
}

/**
 * 언어 코드에 해당하는 Prism.js 컴포넌트 이름을 반환
 *
 * @param language - 언어 코드 (예: 'js', 'python', 'html')
 * @returns Prism.js 컴포넌트 이름 (예: 'prism-javascript', 'prism-python', 'prism-markup')
 */
export function getPrismComponent(language: string): string | null {
  const normalizedLang = language.toLowerCase().trim();
  return PRISM_COMPONENT_MAP[normalizedLang] || null;
}

/**
 * 여러 언어 코드를 Prism.js 컴포넌트 이름 배열로 변환
 *
 * @param languages - 언어 코드 배열
 * @returns 중복 제거된 Prism.js 컴포넌트 이름 배열
 */
export function getPrismComponents(languages: string[]): string[] {
  const components = new Set<string>();

  for (const lang of languages) {
    const component = getPrismComponent(lang);
    if (component) {
      components.add(component);
    }
  }

  return Array.from(components);
}
