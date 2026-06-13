import React, { useState, useEffect, useCallback } from "react";
import { Cpu, Save, Key, Globe, Activity, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import "./settings.css";

const PROVIDER_MODELS = {
  gemini: [
    { value: "gemini-3.5-flash", label: "Gemini 3.5 Flash (Latest)" },
    { value: "gemini-3.5-pro", label: "Gemini 3.5 Pro" },
    { value: "gemini-3.0-flash", label: "Gemini 3.0 Flash" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" }
  ],
  openai: [
    { value: "gpt-5.4-turbo", label: "GPT-5.4 Turbo (Latest)" },
    { value: "gpt-5.3-turbo", label: "GPT-5.3 Turbo" },
    { value: "gpt-5-mini", label: "GPT-5 Mini" },
    { value: "gpt-4o", label: "GPT-4o (Flagship)" }
  ],
  claude: [
    { value: "claude-4-7-sonnet", label: "Claude 4.7 Sonnet (Latest)" },
    { value: "claude-4-6-sonnet", label: "Claude 4.6 Sonnet" },
    { value: "claude-4-5-sonnet", label: "Claude 4.5 Sonnet" },
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" }
  ],
  groq: [
    { value: "llama-4.1-70b-versatile", label: "LLaMA 4.1 70b (Latest)" },
    { value: "llama-4.0-70b-versatile", label: "LLaMA 4.0 70b" },
    { value: "llama-3.3-70b-versatile", label: "LLaMA 3.3 70b" }
  ],
  ollama: [] // Dynamically loaded from user device
};

const PROVIDERS = [
  { id: "gemini", label: "Gemini", sublabel: "Google", icon: "/gemini.svg" },
  { id: "openai", label: "OpenAI", sublabel: "GPT", icon: "/openai.svg" },
  { id: "claude", label: "Claude", sublabel: "Anthropic", icon: "/claude.svg" },
  { id: "groq", label: "Groq", sublabel: "LLaMA", icon: "/groq.svg" },
  { id: "ollama", label: "Ollama", sublabel: "Local", icon: "/ollama.svg" },
];

export default function SettingsPage() {
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [localUrl, setLocalUrl] = useState("http://localhost:11434");
  const [model, setModel] = useState("gemini-3.5-flash");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Dynamic Ollama state
  const [ollamaModels, setOllamaModels] = useState([]);
  const [isOllamaLoading, setIsOllamaLoading] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem("prysm_llm_provider") || "gemini";
    const savedKey = localStorage.getItem("prysm_llm_key") || "";
    const savedUrl = localStorage.getItem("prysm_llm_local_url") || "http://localhost:11434";
    const savedModel = localStorage.getItem("prysm_llm_model");

    setProvider(savedProvider);
    if (savedKey) setApiKey(savedKey);
    setLocalUrl(savedUrl);

    if (savedProvider !== "ollama") {
      const predefinedList = PROVIDER_MODELS[savedProvider] || [];
      const isPredefined = predefinedList.some(m => m.value === savedModel);
      if (savedModel && isPredefined) {
        setModel(savedModel);
      } else {
        setModel(predefinedList[0]?.value || "");
      }
    } else {
      setModel(savedModel || "");
    }
  }, []);

  // Fetch Ollama models from backend proxy
  const fetchLocalOllamaModels = useCallback(async (urlToUse) => {
    setIsOllamaLoading(true);
    try {
      const res = await axiosInstance.post(
        "/dashboard/ollama-models",
        {},
        {
          headers: {
            "X-LLM-Local-Url": urlToUse || localUrl,
          },
        }
      );
      if (res.data.success && Array.isArray(res.data.models) && res.data.models.length > 0) {
        setOllamaModels(res.data.models);
      } else {
        setOllamaModels([]);
      }
    } catch (err) {
      console.warn("Error fetching local Ollama models:", err);
      setOllamaModels([]);
    } finally {
      setIsOllamaLoading(false);
    }
  }, [localUrl]);

  // Trigger Ollama fetch on provider/url changes
  useEffect(() => {
    if (provider === "ollama") {
      fetchLocalOllamaModels(localUrl);
    }
  }, [provider, localUrl, fetchLocalOllamaModels]);

  // Adjust model select option when list loads
  useEffect(() => {
    if (provider === "ollama") {
      if (ollamaModels.length > 0) {
        const isStillAvailable = ollamaModels.includes(model);
        if (!isStillAvailable) {
          setModel(ollamaModels[0]);
        }
      } else if (!isOllamaLoading) {
        setModel("not_available");
      }
    }
  }, [ollamaModels, provider, isOllamaLoading, model]);

  // Clear connection test result when any value changes
  const handleConfigChange = (type, val) => {
    setTestResult(null);
    if (type === "provider") {
      setProvider(val);
      if (val !== "ollama") {
        const list = PROVIDER_MODELS[val] || [];
        setModel(list[0]?.value || "");
      }
    } else if (type === "key") {
      setApiKey(val);
    } else if (type === "url") {
      setLocalUrl(val);
    }
  };

  const handleSave = () => {
    if (provider === "ollama" && model === "not_available") {
      toast.error("Ollama local service is not available or has no pulled models.");
      return;
    }
    localStorage.setItem("prysm_llm_provider", provider);
    localStorage.setItem("prysm_llm_key", apiKey);
    localStorage.setItem("prysm_llm_local_url", localUrl);
    localStorage.setItem("prysm_llm_model", model);
    toast.success("AI model configuration saved successfully!");
  };

  const handleTestConnection = async () => {
    if (provider === "ollama" && model === "not_available") {
      toast.error("Ollama local service is not available or has no pulled models.");
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const toastId = toast.loading("Testing LLM connection...");

    try {
      const res = await axiosInstance.post(
        "/dashboard/test-connection",
        {},
        {
          headers: {
            "X-LLM-Provider": provider,
            "X-LLM-Key": apiKey,
            "X-LLM-Local-Url": localUrl,
            "X-LLM-Model": model
          },
        }
      );
      if (res.data.success) {
        setTestResult({ success: true, message: "Connection successful!" });
        toast.success("Connection successful!", { id: toastId });
      } else {
        setTestResult({ success: false, message: res.data.message || "Connection failed" });
        toast.error(res.data.message || "Connection failed", { id: toastId });
      }
    } catch (error) {
      console.error("Test connection failed:", error);
      const errMsg = error.response?.data?.message || error.message || "Connection failed";
      setTestResult({ success: false, message: errMsg });
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsTesting(false);
    }
  };

  // Get active model details for hints
  const getModelDetails = () => {
    if (!model) return "";
    if (provider === "ollama") {
      if (model === "not_available") {
        return "Ollama local service is not active or unreachable.";
      }
      return `Local Ollama Host - running model ${model}.`;
    }
    switch (provider) {
      case "gemini":
        return `Google Gemini API - targeting model version ${model}.`;
      case "openai":
        return `OpenAI API - targeting model version ${model}.`;
      case "claude":
        return `Anthropic Claude API - targeting model version ${model}.`;
      case "groq":
        return `Groq Cloud API - targeting LLaMA model version ${model}.`;
      default:
        return "";
    }
  };

  return (
    <div className="settings-page">
      <section className="settings-provider-strip">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`provider-tile liquid-glass-card${provider === p.id ? " active" : ""}`}
            onClick={() => handleConfigChange("provider", p.id)}
          >
            <div className="provider-tile-icon">
              <img src={p.icon} alt={p.label} />
            </div>
            <div className="provider-tile-text">
              <span className="provider-tile-name">{p.label}</span>
              <span className="provider-tile-sub">{p.sublabel}</span>
            </div>
          </button>
        ))}
      </section>

      <div className="settings-layout">
        <div className="settings-main">
          <section className="settings-panel liquid-glass-card">
            <div className="panel-header">
              <Cpu className="panel-icon" size={20} />
              <div>
                <h2 className="panel-title">Model Configuration</h2>
                <p className="panel-desc">Choose the model version used for feedback analysis.</p>
              </div>
            </div>

            <div className="panel-body">
              <div className="setting-control-group">
                <span className="control-name block mb-05">Model Version</span>
                {provider === "ollama" ? (
                  <select
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      setTestResult(null);
                    }}
                    className="settings-select"
                    disabled={isOllamaLoading || ollamaModels.length === 0}
                  >
                    {isOllamaLoading ? (
                      <option value="">Checking local models...</option>
                    ) : ollamaModels.length > 0 ? (
                      ollamaModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))
                    ) : (
                      <option value="not_available">not available</option>
                    )}
                  </select>
                ) : (
                  <select
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      setTestResult(null);
                    }}
                    className="settings-select"
                  >
                    {(PROVIDER_MODELS[provider] || []).map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                )}
                <span className="control-hint highlight">{getModelDetails()}</span>
              </div>
            </div>
          </section>

          <section className="settings-panel liquid-glass-card">
            <div className="panel-header">
              {provider !== "ollama" ? (
                <Key className="panel-icon" size={20} />
              ) : (
                <Globe className="panel-icon" size={20} />
              )}
              <div>
                <h2 className="panel-title">
                  {provider !== "ollama" ? "API Credentials" : "Local Endpoint"}
                </h2>
                <p className="panel-desc">
                  {provider !== "ollama"
                    ? "Your key is stored locally in the browser and sent only with analysis requests."
                    : "Point Prysm at your local Ollama runtime."}
                </p>
              </div>
            </div>

            <div className="panel-body">
              {provider !== "ollama" ? (
                <div className="setting-control-group">
                  <span className="control-name flex-align gap-05 mb-05">
                    <Key size={14} /> API Key
                  </span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => handleConfigChange("key", e.target.value)}
                    placeholder="Paste your API key here"
                    className="settings-text-input"
                  />
                  <span className="control-hint">
                    Never stored on our servers — BYOK only.
                  </span>
                </div>
              ) : (
                <div className="setting-control-group">
                  <span className="control-name flex-align gap-05 mb-05">
                    <Globe size={14} /> Ollama Endpoint URL
                  </span>
                  <input
                    type="text"
                    value={localUrl}
                    onChange={(e) => handleConfigChange("url", e.target.value)}
                    placeholder="e.g. http://localhost:11434"
                    className="settings-text-input"
                  />
                  <span className="control-hint">
                    The base API endpoint URL of your local Ollama runtime.
                  </span>
                </div>
              )}

              {provider === "ollama" && (
                <div className="ollama-suggestions-box">
                  <span className="suggestions-title">Local Ollama Suggestions</span>
                  <p className="suggestions-desc">
                    Pull a model in your terminal before testing the connection:
                  </p>
                  <div className="code-snippets-container">
                    <code>ollama run llama4</code>
                    <code>ollama run gemma3</code>
                    <code>ollama run mistral-v0.4</code>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="settings-aside">
          <section className="settings-panel liquid-glass-card">
            <div className="panel-header">
              <Activity className="panel-icon" size={20} />
              <div>
                <h2 className="panel-title">Active Setup</h2>
                <p className="panel-desc">Summary of your current LLM configuration.</p>
              </div>
            </div>

            <div className="panel-body">
              <dl className="config-summary">
                <div className="config-summary-row">
                  <dt>Provider</dt>
                  <dd>{PROVIDERS.find((p) => p.id === provider)?.label}</dd>
                </div>
                <div className="config-summary-row">
                  <dt>Model</dt>
                  <dd>{model === "not_available" ? "Unavailable" : model}</dd>
                </div>
                <div className="config-summary-row">
                  <dt>Auth</dt>
                  <dd>
                    {provider === "ollama"
                      ? localUrl
                      : apiKey
                        ? "Key configured"
                        : "No key set"}
                  </dd>
                </div>
              </dl>

              {testResult && (
                <div className={`connection-status-box ${testResult.success ? "success" : "error"}`}>
                  {testResult.success ? (
                    <CheckCircle2 className="status-icon success-icon" size={16} />
                  ) : (
                    <XCircle className="status-icon error-icon" size={16} />
                  )}
                  <span className="status-message">{testResult.message}</span>
                </div>
              )}
            </div>

            <div className="settings-footer-actions">
              <button
                className="btn-test-settings"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                <Activity className={`btn-icon ${isTesting ? "animate-pulse" : ""}`} size={16} />
                <span>{isTesting ? "Testing..." : "Test Connection"}</span>
              </button>
              <button className="btn-save-settings" onClick={handleSave}>
                <Save className="btn-icon" size={16} />
                <span>Save Config</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
