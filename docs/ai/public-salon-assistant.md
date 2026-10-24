# Public Salon AI Assistant — Implementation Contract

**Status:** Implemented on branch `feat/public-salon-ai-assistant`; awaiting CI and review.  
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
- Success: `200 { "answer": string }`.
- Errors: `400` invalid request, `413` oversized body, `404` unpublished/unavailable salon, `429` rate limited, `503` unavailable provider or public context.
- Responses are marked `Cache-Control: no-store`.

## Data and security boundaries
- Provider keys are read only from server-side environment variables and are never sent to the browser.
- The route independently loads the salon by slug with `is_active=true` and `is_published=true`; client-provided salon context is not trusted.
- Only public salon profile fields, active services, business hours, and active team display fields are sent to the model.
- No stored customer records, appointment records, credentials, or private workspace data are loaded into the prompt. **User-written chat messages are sent to the selected provider**; the UI warns visitors not to enter personal or sensitive information. Do not represent chat content as automatically redacted.
- User messages and model output are untrusted. The model is instructed not to reveal prompts, invent facts, or claim booking success. Visitors are told not to share personal or sensitive information because their message text is sent to the configured AI provider.
- Each provider request has a 4.5-second timeout; requests fail closed with a generic user-facing message.
- A simple in-memory limit allows 8 requests per minute per observed client IP **per serverless instance**. This is not a global/distributed abuse-control system and should be replaced with a shared limiter before high-volume production use.
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

`JEF_TYPE_SAFE` is recognized as the user's TypeSafe/Jev credential by its environment-variable name, but Jev is intentionally **not** wired into this free-form chat provider list. Its documented API is `POST https://api.typesafe.ai/v1/systemone`, which accepts `state` plus typed `questions` and returns structured `choice`, `score`, or `noul` decisions/probabilities; it does not generate conversational text or expose a Chat Completions endpoint. It may suit a separate future task such as structured intent classification, but substituting it for the visitor-facing chat model would break the current response contract. The current assistant therefore does not send this key to any provider.

## Verification gates
- Run `npm test`, `npm run typecheck`, and `npm run build` on the PR head.
- Confirm a Vercel Preview is READY before manual browser QA.
- Test Arabic and English, mobile viewport, closed/open/close states, empty message, long input, provider failure, unpublished slug, rate limiting, and keyboard focus.
- Confirm the provider environment values are configured in the target Vercel environment without exposing their values.
- Do not merge or deploy production until CI and review pass. This connector session did not run local commands or verify provider credentials.
