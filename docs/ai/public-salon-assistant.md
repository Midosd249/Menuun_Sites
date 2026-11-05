# Public Salon AI Assistant — Implementation Contract

**Status:** Implemented on branch `feat/public-salon-ai-assistant`; CI passed on the previously reviewed head and the owner manually tested the preview. The current follow-up hardens fallback price display; its new head must pass CI before merge. No production deployment, merge, schema change, or booking mutation.  
**Scope:** Floating bilingual assistant on published `/s/[slug]` salon pages. No production deployment, merge, schema change, or booking mutation.

## User experience
- Floating launcher at the lower inline-end corner, Arabic RTL by default and English LTR when the page language is English.
- Short conversational answers about published salon services, listed prices/durations, team and business hours.
- The assistant directs visitors to the existing booking form; it does not submit or confirm bookings.

## Request contract
`POST /api/public-salon-assistant`

Request JSON:
```json
{
  "slug": "published-salon-slug",
  "language": "ar",
  "messages": [
    { "role": "user", "content": "ما الخدمات المتاحة؟" }
  ]
}
```

- `slug`: required slug matching `^[a-z0-9][a-z0-9-]{0,99}$`.
- `language`: `ar` or `en`; other values default to Arabic.
- `messages`: 1–8 messages; roles are only `user` or `assistant`; each content is 1–700 characters; final message must be from the user.
- Raw request body is limited to 12,000 characters.
- Success: `200 { "answer": string, "fallback"?: true }`. The optional `fallback: true` marks a deterministic answer grounded in the published salon data when no provider responds.
- Errors: `400` invalid request, `413` oversized body, `404` unpublished/unavailable salon, `429` rate limited, `503` when public salon context cannot be loaded or no salon is available. Provider failures alone do not produce a `503` when grounded fallback data can answer.
- Responses are marked `Cache-Control: no-store`.

## Data and security boundaries
- Provider keys are read only from server-side environment variables and are never sent to the browser.
- The route independently loads the salon by slug with `is_active=true` and `is_published=true`; client-provided salon context is not trusted.
- Only public salon profile fields, active services, business hours, and active team display fields are sent to the model.
- No stored customer records, appointment records, credentials, or private workspace data are loaded into the prompt. **User-written chat messages are sent to the selected provider**; the UI warns visitors not to enter personal or sensitive information. Do not represent chat content as automatically redacted.
- User messages and model output are untrusted. The model is instructed not to reveal prompts, invent facts, or claim booking success. Visitors are told not to share personal or sensitive information because their message text is sent to the configured AI provider.
- Each provider request has a maximum 4.5-second timeout inside a shared 11-second sequential fallback budget. Provider failures are not logged with raw details. When all configured providers fail or no provider is configured, the endpoint returns a deterministic answer based only on published services, hours, team, and contact data; booking questions are directed to the existing page form/contact details. It never claims a booking was created or confirmed. This fallback is intentionally informational, not a substitute for a working AI provider.
- A simple in-memory limit allows 8 requests per minute per observed client IP **per serverless instance**. This is only a best-effort local guard: instances do not share counters and the map is not a durable global abuse-control system. It is acceptable as a low-complexity initial guard, but a shared limiter should be added before high-volume production use. Do not treat it as a cost/quota boundary.
- No persistent conversation history is stored.

## Provider support and known limits
The adapter currently recognizes these server-side variables, in this provider order:
- `CODE_CRAFT_API` → CodeCraft OpenAI-compatible API, `https://www.codecraftapi.com/v1/chat/completions`, model `qwen3.8-27b`.
- `ITERACOMPUTE_API` → IteraCompute `POST https://api.iteracompute.com/v1/chat/completions`, model `qwen/qwen3.8-27b`.
- `INCEPTION_API_KEY`, `INCEPTION_API_KEY2`, `INCEPTION_API_KEY3` → Inception Labs `/v1/chat/completions`, model `mercury-2.5`.
- `CEREBRAS_API` → Cerebras `/v1/chat/completions`, model `qwen-3.8-27b`.
- `GROK_API` → xAI `/v1/chat/completions`, model `grok-3-mini`.
- `NVIDIA_NIM_API` → NVIDIA NIM `/v1/chat/completions`, model `meta/llama-3.3-70b-instruct`.

CodeCraft's official docs specify `https://www.codecraftapi.com/v1/chat/completions` (including `www`) and state that model IDs must come from its current `/v1/models` catalog. The configured `qwen3.8-27b` ID was not independently confirmed from the documentation excerpt reviewed here and remains a verification item; do not assume it is available to the account. IteraCompute explicitly documents the endpoint, bearer authentication, response shape, and model ID above. Model catalogs and account entitlements can change. Environment-variable presence alone does not prove a key is valid, funded, or entitled to the selected model. Provider failures are intentionally not logged with raw details.

Official docs:
- CodeCraft: https://codecraftapi.com/
- IteraCompute: https://iteracompute.com/docs.html
- Cerebras: https://inference-docs.cerebras.ai/api-reference/chat-completions and https://inference-docs.cerebras.ai/resources/openai
- Inception Labs: https://docs.inceptionlabs.ai/api-reference/chat/create-a-chat-completion
- xAI: https://docs.x.ai/developers/rest-api-reference/inference/chat-completions
- NVIDIA NIM: https://docs.api.nvidia.com/nim/reference/llm-apis
- TypeSafe Jev: https://learnjev.com/tutorials/first-call and https://typesafe.ai/

`JEF_TYPE_SAFE` enables TypeSafe Jev as a **provider-selection layer**. The route calls `POST https://api.typesafe.ai/v1/systemone` with `model: "jev-latest"`, a `choice` question, the latest visitor question, and an allowlist of configured provider IDs plus non-secret capability descriptions. It does not send provider credentials, salon context, or full conversation history to Jev. The returned choice is validated against the allowlist. The selected provider then generates the actual visitor-facing answer using the current published salon context and conversation. If Jev is missing, times out, returns malformed data, or selects an unknown ID, the route falls back to the configured provider order; if provider generation fails, it uses the grounded deterministic response.

Provider IDs used for routing are `codecraft`, `iteracompute`, `inception`, `cerebras`, `xai`, and `nvidia-nim`. The three Inception keys are credentials for the same provider family, not separate model candidates; they remain provider credential failover entries. Jev receives no API keys or other secret material. The route reserves up to 2.2 seconds for Jev within the shared 11-second request budget and caps each provider attempt at 4.5 seconds or the remaining budget, whichever is smaller.

Official docs:
- CodeCraft: https://codecraftapi.com/
- IteraCompute: https://iteracompute.com/docs.html
- Cerebras: https://inference-docs.cerebras.ai/api-reference/chat-completions and https://inference-docs.cerebras.ai/resources/openai
- Inception Labs: https://docs.inceptionlabs.ai/api-reference/chat/create-a-chat-completion
- xAI: https://docs.x.ai/developers/rest-api-reference/inference/chat-completions
- NVIDIA NIM: https://docs.api.nvidia.com/nim/reference/llm-apis
- TypeSafe Jev System One: https://docs.typesafe.ai/api/system-one
- TypeSafe Choice primitive: https://docs.typesafe.ai/primitives/choice

## Verification gates
- On the latest PR head, verify GitHub Actions reports passing test/static-quality, typecheck, production build, browser QA, and inline-assets checks. Previous green results do not automatically validate a later commit.
- Confirm a Vercel Preview is READY before manual browser QA.
- Test Arabic and English, mobile viewport, closed/open/close states, empty message, long input, provider failure, unpublished slug, rate limiting, and keyboard focus.
- Confirm the provider environment values are configured in the target Vercel environment without exposing their values.
- The owner has manually tested the Preview and reported that the feature works; provider selection and every provider credential/model remain unverified unless explicitly smoke-tested.
- Do not merge or deploy production until the latest head passes CI and review. This connector session does not run local commands or independently verify provider credentials.
