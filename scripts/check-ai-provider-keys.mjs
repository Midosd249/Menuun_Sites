const enabled = process.env.VERCEL_ENV === "preview"
  && process.env.VERCEL_GIT_COMMIT_REF === "feat/public-salon-ai-assistant";

if (!enabled) {
  console.log("AI provider smoke test skipped (only runs on the salon-assistant Preview branch).");
  process.exit(0);
}

const timeoutMs = 7_000;
const iteraTimeoutMs = 25_000;
const message = [{ role: "user", content: "Reply with exactly: OK" }];

async function requestJson(url, key, body, timeout = timeoutMs) {
  try {
    const response = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${key}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(timeout),
      cache: "no-store",
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    const error = payload?.error;
    return {
      status: response.status,
      payload,
      errorType: typeof error?.type === "string" ? error.type : undefined,
      errorCode: typeof error?.code === "string" ? error.code : undefined,
    };
  } catch {
    return { status: "NETWORK_ERROR", payload: null };
  }
}

async function chatTest(name, envKey, endpoint, model, extra = {}, timeout = timeoutMs) {
  const key = process.env[envKey]?.trim();
  if (!key) return { provider: name, result: "MISSING_IN_PREVIEW" };

  const response = await requestJson(endpoint, key, {
    model,
    messages: message,
    max_tokens: 12,
    temperature: 0,
    stream: false,
    ...extra,
  }, timeout);

  if ((response.status === 400 || response.status === 404) && name === "xAI") {
    const retry = await requestJson(endpoint, key, {
      model: "grok-4.7",
      messages: message,
      max_tokens: 12,
      temperature: 0,
      stream: false,
    });
    if (retry.status === 200 && typeof retry.payload?.choices?.[0]?.message?.content === "string"
      && retry.payload.choices[0].message.content.trim()) {
      return { provider: name, configuredModel: model, result: "KEY_OK_CONFIGURED_MODEL_REJECTED", configuredHttpStatus: response.status, fallbackModel: "grok-4.7", fallbackResult: "PASS" };
    }
    return { provider: name, configuredModel: model, result: response.status === "NETWORK_ERROR" ? "NETWORK_ERROR" : `HTTP_${response.status}`, errorType: response.errorType, errorCode: response.errorCode, fallbackModel: "grok-4.7", fallbackResult: retry.status === "NETWORK_ERROR" ? "NETWORK_ERROR" : `HTTP_${retry.status}`, fallbackErrorType: retry.errorType, fallbackErrorCode: retry.errorCode };
  }

  if (response.status !== 200) {
    return { provider: name, model, result: response.status === "NETWORK_ERROR" ? "NETWORK_ERROR" : `HTTP_${response.status}`, errorType: response.errorType, errorCode: response.errorCode };
  }
  const answer = response.payload?.choices?.[0]?.message?.content;
  return { provider: name, model, result: typeof answer === "string" && answer.trim() ? "PASS" : "HTTP_200_EMPTY_RESPONSE" };
}

async function codeCraftTest() {
  const key = process.env.CODE_CRAFT_API?.trim();
  if (!key) return { provider: "CodeCraft", result: "MISSING_IN_PREVIEW" };

  const catalog = await requestJson("https://www.codecraftapi.com/v1/models", key);
  const configuredModel = "qwen3.8-27b";
  if (catalog.status === 200) {
    const models = Array.isArray(catalog.payload?.data) ? catalog.payload.data : [];
    if (!models.some((model) => model?.id === configuredModel)) {
      return { provider: "CodeCraft", result: "KEY_OK_CATALOG_ACCESS", configuredModel, modelStatus: "NOT_IN_CATALOG", inferenceTest: "SKIPPED" };
    }
    return chatTest("CodeCraft", "CODE_CRAFT_API", "https://www.codecraftapi.com/v1/chat/completions", configuredModel);
  }
  if (catalog.status === 403) {
    const inference = await chatTest("CodeCraft", "CODE_CRAFT_API", "https://www.codecraftapi.com/v1/chat/completions", configuredModel);
    return { ...inference, catalogResult: "HTTP_403", catalogErrorType: catalog.errorType, catalogErrorCode: catalog.errorCode };
  }
  return { provider: "CodeCraft", result: catalog.status === "NETWORK_ERROR" ? "NETWORK_ERROR" : `CATALOG_HTTP_${catalog.status}`, errorType: catalog.errorType, errorCode: catalog.errorCode };
}

const results = await Promise.all([
  codeCraftTest(),
  chatTest("IteraCompute", "ITERACOMPUTE_API", "https://api.iteracompute.com/v1/chat/completions", "qwen/qwen3.8-27b", { reasoning: false }, iteraTimeoutMs),
  chatTest("Inception-1", "INCEPTION_API_KEY", "https://api.inceptionlabs.ai/v1/chat/completions", "mercury-2.5"),
  chatTest("Inception-2", "INCEPTION_API_KEY2", "https://api.inceptionlabs.ai/v1/chat/completions", "mercury-2.5"),
  chatTest("Inception-3", "INCEPTION_API_KEY3", "https://api.inceptionlabs.ai/v1/chat/completions", "mercury-2.5"),
  chatTest("Cerebras", "CEREBRAS_API", "https://api.cerebras.ai/v1/chat/completions", "qwen-3.8-27b"),
  chatTest("xAI", "GROK_API", "https://api.x.ai/v1/chat/completions", "grok-3-mini"),
  chatTest("NVIDIA NIM", "NVIDIA_NIM_API", "https://integrate.api.nvidia.com/v1/chat/completions", "meta/llama-3.3-70b-instruct"),
]);

console.log("AI provider smoke test results (no credentials or response text are logged):");
for (const result of results) console.log(JSON.stringify(result));
if (results.some((result) => result.result === "PASS" || result.result === "KEY_OK_CATALOG_ACCESS" || result.result === "KEY_OK_CONFIGURED_MODEL_UNAVAILABLE")) {
  // The smoke test is diagnostic: report individual failures without failing the entire build.
  console.log("At least one configured provider key or catalog endpoint responded successfully.");
}
