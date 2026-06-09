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
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-subtitle">
          Configure your preferred Large Language Model (LLM) provider and API credentials. All settings are kept locally in your browser.
        </p>
      </div>

      <div className="settings-container-centered">
        <div className="settings-card">
          <div className="card-header-with-icon">
            <Cpu className="header-icon blue" size={22} />
            <h2 className="card-title">LLM Configuration</h2>
          </div>
          <p className="card-desc">
            Select an LLM provider and configure the credentials to power the feedback analysis engine.
          </p>

          <div className="card-content">
            {/* LLM Provider Selection */}
            <div className="setting-control-group">
              <span className="control-name block mb-05">Model Provider</span>
              <select
                value={provider}
                onChange={(e) => handleConfigChange("provider", e.target.value)}
                className="settings-select"
              >
                <option value="gemini">Gemini (Google)</option>
                <option value="openai">OpenAI (GPT)</option>
                <option value="claude">Claude (Anthropic)</option>
                <option value="groq">Groq (LLaMA)</option>
                <option value="ollama">Ollama (Local Host)</option>
              </select>
            </div>

            {/* LLM Model Selection */}
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

            {/* API Key Input (Hidden for Ollama) */}
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
                <span className="control-hint">Your API key is never stored on our server, only sent with requests.</span>
              </div>
            ) : (
              /* Local Host URL Input (Visible only for Ollama) */
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
                <span className="control-hint">The base API endpoint URL of your local Ollama runtime.</span>
              </div>
            )}



            {/* Ollama suggestions container */}
            {provider === "ollama" && (
              <div className="ollama-suggestions-box">
                <span className="suggestions-title">💡 Local Ollama Suggestions</span>
                <p className="suggestions-desc">
                  To run a local model, open your terminal and pull it before testing connection:
                </p>
                <div className="code-snippets-container">
                  <code>ollama run llama4</code>
                  <code>ollama run gemma3</code>
                  <code>ollama run mistral-v0.4</code>
                </div>
              </div>
            )}

            {/* Test Connection result box */}
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
        </div>
      </div>
    </div>
  );
}
