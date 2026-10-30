
import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/predict";

const initialData = {
  age: "",
  gender: "Male",
  country: "India",
  academic_level: "Undergraduate",
  most_used_platform: "Instagram",
  purpose_of_use: "Entertainment",
  avg_daily_usage_hours: "",
  daily_unlocks: "",
  study_hours: "",
  physical_activity_hours: "",
  sleep_hours_per_night: "",
  stress_level: "Medium",
};

const fields = [
  {
    key: "age",
    label: "Age",
    type: "number",
    min: 10,
    max: 100,
    placeholder: "Your age",
  },
  {
    key: "gender",
    label: "Gender",
    options: ["Male", "Female"],
  },
  {
    key: "country",
    label: "Country",
    options: [
      "India",
      "USA",
      "Canada",
      "Australia",
      "UK",
      "Germany",
      "Mexico",
      "Turkey",
      "France",
      "Other",
    ],
  },
  {
    key: "academic_level",
    label: "Academic Level",
    options: [
      "Undergraduate",
      "Graduate",
      "High School",
    ],
  },
  {
    key: "most_used_platform",
    label: "Most Used Platform",
    options: [
      "Facebook",
      "LinkedIn",
      "Instagram",
      "Snapchat",
      "Twitter",
      "YouTube",
      "TikTok",
      "LINE",
      "KakaoTalk",
      "VKontakte",
      "WhatsApp",
      "WeChat",
    ],
  },
  {
    key: "purpose_of_use",
    label: "Purpose of Use",
    options: [
      "Networking",
      "Education",
      "Entertainment",
      "News",
    ],
  },
  {
    key: "avg_daily_usage_hours",
    label: "Daily Social Media Usage (hours)",
    type: "number",
    min: 0,
    max: 24,
    step: 0.1,
    placeholder: "e.g. 4.5",
  },
  {
    key: "daily_unlocks",
    label: "Daily Phone Unlocks",
    type: "number",
    min: 0,
    placeholder: "e.g. 80",
  },
  {
    key: "study_hours",
    label: "Daily Study Hours",
    type: "number",
    min: 0,
    max: 24,
    step: 0.1,
    placeholder: "e.g. 5",
  },
  {
    key: "physical_activity_hours",
    label: "Daily Physical Activity (hours)",
    type: "number",
    min: 0,
    max: 24,
    step: 0.1,
    placeholder: "e.g. 1",
  },
  {
    key: "sleep_hours_per_night",
    label: "Sleep Hours Per Night",
    type: "number",
    min: 0,
    max: 24,
    step: 0.1,
    placeholder: "e.g. 7.5",
  },
  {
    key: "stress_level",
    label: "Stress Level",
    options: ["Low", "Medium", "High", "Very High"],
  },
];

function App() {
  const [page, setPage] = useState("welcome");
  const [name, setName] = useState("");
  const [data, setData] = useState(initialData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function startAssessment(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name first.");
      return;
    }

    setError("");
    setPage("assessment");
  }

  async function predictScore(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      age: Number(data.age),
      gender: data.gender,
      country: data.country,
      academic_level: data.academic_level,
      most_used_platform: data.most_used_platform,
      purpose_of_use: data.purpose_of_use,
      avg_daily_usage_hours: Number(
        data.avg_daily_usage_hours
      ),
      daily_unlocks: Number(data.daily_unlocks),
      study_hours: Number(data.study_hours),
      physical_activity_hours: Number(
        data.physical_activity_hours
      ),
      sleep_hours_per_night: Number(
        data.sleep_hours_per_night
      ),
      stress_level: data.stress_level,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const detail = responseData.detail;

        throw new Error(
          typeof detail === "string"
            ? detail
            : "Please check your information and try again."
        );
      }

      setResult(
        responseData.predicted_mental_health_score
      );

      setPage("result");
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the prediction server."
      );
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setData(initialData);
    setResult(null);
    setError("");
    setPage("welcome");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">M</div>
          <span>MindScore</span>
        </div>

        <div className="nav-right">
          <span className="nav-label">ML Powered Wellness</span>
          <div className="nav-dot" />
        </div>
      </nav>

      <main className="main">
        {page === "welcome" && (
          <section className="welcome-page">
            <div className="welcome-left">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                YOUR DIGITAL WELLNESS JOURNEY
              </div>

              <h1>
                Understand your
                <br />
                <span>digital wellness.</span>
              </h1>

              <p className="welcome-description">
                Discover your predicted mental health score
                through your daily habits, lifestyle and
                social media usage.
              </p>

              <form
                className="welcome-form"
                onSubmit={startAssessment}
              >
                <label htmlFor="username">What should we call you?</label>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  required
                />

                <button className="primary-button" type="submit">
                  Get Started
                  <span>→</span>
                </button>

                {error && <p className="error">{error}</p>}
              </form>

              <div className="welcome-note">
                <span>✦</span>
                A few questions. One personalized prediction.
              </div>
            </div>

            <div className="welcome-right">
              <div className="visual-card">
                <div className="visual-top">
                  <span className="visual-label">
                    YOUR WELLNESS
                  </span>
                  <span className="visual-badge">
                    <span /> Personal assessment
                  </span>
                </div>

                <div className="orbit">
                  <div className="orbit-ring ring-one" />
                  <div className="orbit-ring ring-two" />

                  <div className="orbit-center">
                    <span className="orbit-spark">✦</span>
                    <div className="orbit-heart">♡</div>
                    <span className="orbit-caption">
                      Mind & Balance
                    </span>
                  </div>

                  <div className="floating-card floating-one">
                    <span className="float-icon purple">☾</span>
                    <div>
                      <strong>Sleep</strong>
                      <small>Daily habits</small>
                    </div>
                  </div>

                  <div className="floating-card floating-two">
                    <span className="float-icon peach">♡</span>
                    <div>
                      <strong>Wellness</strong>
                      <small>Your lifestyle</small>
                    </div>
                  </div>

                  <div className="floating-card floating-three">
                    <span className="float-icon blue">✧</span>
                    <div>
                      <strong>Balance</strong>
                      <small>Personal insights</small>
                    </div>
                  </div>
                </div>

                <div className="visual-bottom">
                  <div>
                    <strong>A little time for yourself.</strong>
                    <p>Understand your habits, one step at a time.</p>
                  </div>
                  <span className="visual-arrow">↗</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {page === "assessment" && (
          <section className="assessment-page">
            <div className="assessment-heading">
              <button
                className="back-button"
                onClick={() => setPage("welcome")}
                type="button"
              >
                ← Back
              </button>

              <div className="eyebrow">
                PERSONAL ASSESSMENT
              </div>

              <h1>
                Let's get to know
                <span> you, {name.trim()}.</span>
              </h1>

              <p>
                Answer these questions about your daily
                lifestyle to generate your prediction.
              </p>
            </div>

            <form
              className="assessment-card"
              onSubmit={predictScore}
            >
              <div className="form-header">
                <div>
                  <h2>Your information</h2>
                  <p>All fields are required.</p>
                </div>

                <span className="form-count">12 QUESTIONS</span>
              </div>

              <div className="form-grid">
                {fields.map((field, index) => (
                  <div className="form-field" key={field.key}>
                    <label htmlFor={field.key}>
                      <span className="field-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {field.label}
                    </label>

                    {field.options ? (
                      <select
                        id={field.key}
                        value={data[field.key]}
                        onChange={(e) =>
                          updateField(field.key, e.target.value)
                        }
                        required
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.key}
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        placeholder={field.placeholder}
                        value={data[field.key]}
                        onChange={(e) =>
                          updateField(field.key, e.target.value)
                        }
                        required
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && <p className="error">{error}</p>}

              <div className="form-footer">
                <p>
                  Your answers are used to generate a
                  machine learning prediction.
                </p>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Generating..."
                    : "Predict My Score"}

                  {!loading && <span>→</span>}
                </button>
              </div>
            </form>
          </section>
        )}

        {page === "result" && (
          <section className="result-page">
            <div className="result-card">
              <div className="result-icon">✦</div>

              <div className="eyebrow">
                YOUR PREDICTION IS READY
              </div>

              <h1>
                Here is your
                <span> predicted score, {name.trim()}.</span>
              </h1>

              <p className="result-description">
                Your result is generated using your lifestyle
                information and our trained machine learning model.
              </p>

              <div className="score-box">
                <span className="score-label">
                  PREDICTED MENTAL HEALTH SCORE
                </span>

                <div className="score-value">
                  {Number(result).toFixed(2)}
                </div>

                <div className="score-divider" />

                <p>
                  Model prediction based on your submitted
                  information.
                </p>
              </div>

              <div className="result-disclaimer">
                <strong>Remember</strong>
                <p>
                  This is an ML-generated prediction, not a
                  medical diagnosis or a clinical mental
                  health assessment.
                </p>
              </div>

              <button
                className="primary-button result-button"
                onClick={restart}
                type="button"
              >
                Start Again
                <span>↻</span>
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>MindScore © 2026</span>
        <span>Made with care · Machine Learning Project</span>
      </footer>
    </div>
  );
}

export default App;
