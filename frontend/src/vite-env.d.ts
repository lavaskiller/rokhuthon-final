/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  /** 라즈베리파이 Paperang 출력 에이전트 (예: http://localhost:8765) */
  readonly VITE_PRINT_AGENT_URL?: string
}
