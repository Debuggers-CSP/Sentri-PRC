import { useState } from "react";

function CheckinView({ pillStyle, smallCardStyle, onSubmit }) {
  const [formData, setFormData] = useState({
    mood_score: 5,
    stress_score: 5,
    craving_score: 5,
    sleep_hours: 8,
    attended_meeting: false,
    exercise_done: false,
    journal_note: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setLocalError("");
      await onSubmit(formData);
    } catch (err) {
      setLocalError(err.message || "Failed to submit check-in");
    } finally {
      setSubmitting(false);
    }
  };

  const compactCardStyle = {
    ...smallCardStyle,
    padding: "12px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
    fontSize: "15px",
    background: "#ffffff"
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0
      }}
    >
      <div>
        <div style={pillStyle}>📝 Daily Check-In</div>
        <h1
          style={{
            fontSize: "clamp(28px, 3vw, 34px)",
            margin: "14px 0 6px 0",
            lineHeight: 1.1
          }}
        >
          How are you feeling today?
        </h1>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "clamp(15px, 1.4vw, 17px)"
          }}
        >
          Keep this quick, honest, and judgment-free.
        </p>
      </div>

      <div
        style={{
          marginTop: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          alignContent: "start",
          minHeight: 0
        }}
      >
        <div style={compactCardStyle}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "15px"
            }}
          >
            Mood Score
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.mood_score}
            onChange={(e) => handleChange("mood_score", Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={compactCardStyle}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "15px"
            }}
          >
            Stress Score
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.stress_score}
            onChange={(e) => handleChange("stress_score", Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={compactCardStyle}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "15px"
            }}
          >
            Craving Score
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.craving_score}
            onChange={(e) => handleChange("craving_score", Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={compactCardStyle}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "15px"
            }}
          >
            Sleep Hours
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleep_hours}
            onChange={(e) => handleChange("sleep_hours", Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={compactCardStyle}>
          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              fontSize: "15px",
              minHeight: "22px"
            }}
          >
            <input
              type="checkbox"
              checked={formData.attended_meeting}
              onChange={(e) => handleChange("attended_meeting", e.target.checked)}
            />
            Attended a meeting
          </label>
        </div>

        <div style={compactCardStyle}>
          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              fontSize: "15px",
              minHeight: "22px"
            }}
          >
            <input
              type="checkbox"
              checked={formData.exercise_done}
              onChange={(e) => handleChange("exercise_done", e.target.checked)}
            />
            Exercised today
          </label>
        </div>

        <div style={{ ...compactCardStyle, gridColumn: "1 / span 2" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "15px"
            }}
          >
            Journal Note
          </label>
          <textarea
            rows="3"
            placeholder="Write a short reflection..."
            value={formData.journal_note}
            onChange={(e) => handleChange("journal_note", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
              fontSize: "15px",
              resize: "none",
              minHeight: "84px",
              maxHeight: "84px",
              background: "#ffffff"
            }}
          />
        </div>
      </div>

      {localError && (
        <div style={{ marginTop: "10px", color: "crimson", fontSize: "14px" }}>
          {localError}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "12px"
        }}
      >
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "12px 18px",
            borderRadius: "14px",
            border: "none",
            background: "#111827",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
            opacity: submitting ? 0.7 : 1
          }}
        >
          {submitting ? "Submitting..." : "Submit Check-In"}
        </button>
      </div>
    </form>
  );
}

export default CheckinView;