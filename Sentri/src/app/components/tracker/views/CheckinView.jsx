import { useState } from "react";

function CheckinView({ pillStyle, smallCardStyle, onSubmit, checkinLabel = "Did you stay sober today?" }) {
  const [formData, setFormData] = useState({
    mood_score: 5,
    stress_score: 5,
    craving_score: 5,
    sleep_hours: 8,
    stayed_sober_today: true,
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
    padding: "10px 12px",
    borderRadius: "18px"
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "12px",
    border: "1px solid rgba(209, 218, 225, 0.95)",
    boxSizing: "border-box",
    fontSize: "14px",
    background: "rgba(255,255,255,0.78)",
    color: "#334155",
    outline: "none"
  };

  const soberChoiceStyle = (selected) => ({
    flex: 1,
    padding: "10px 12px",
    borderRadius: "12px",
    border: selected
      ? "1.5px solid rgba(122, 156, 143, 0.95)"
      : "1px solid rgba(209, 218, 225, 0.95)",
    background: selected
      ? "linear-gradient(180deg, rgba(123,160,142,0.16) 0%, rgba(109,143,151,0.12) 100%)"
      : "rgba(255,255,255,0.72)",
    color: selected ? "#2f4a42" : "#475569",
    fontSize: "14px",
    fontWeight: selected ? "700" : "500",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.16s ease"
  });

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
            fontSize: "clamp(24px, 2.6vw, 32px)",
            margin: "10px 0 4px 0",
            lineHeight: 1.08,
            color: "#24323d",
            letterSpacing: "-0.02em"
          }}
        >
          How are you feeling today?
        </h1>
        <p
          style={{
            margin: 0,
            color: "#667685",
            fontSize: "clamp(14px, 1.2vw, 16px)"
          }}
        >
          Keep this quick, honest, and judgment-free.
        </p>
      </div>

      <div
        style={{
          marginTop: "12px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          alignContent: "start",
          minHeight: 0
        }}
      >
        <div style={{ ...compactCardStyle, gridColumn: "1 / span 2" }}>
          <div
            style={{
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#334155"
            }}
          >
            {checkinLabel}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleChange("stayed_sober_today", true)}
              style={soberChoiceStyle(formData.stayed_sober_today === true)}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() => handleChange("stayed_sober_today", false)}
              style={soberChoiceStyle(formData.stayed_sober_today === false)}
            >
              No
            </button>
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "12px",
              color: "#70808e",
              lineHeight: 1.3
            }}
          >
            This helps calculate your sobriety streak and tailor support more accurately.
          </div>
        </div>

        <div style={compactCardStyle}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#334155"
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
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#334155"
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
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#334155"
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
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#334155"
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
              gap: "8px",
              alignItems: "center",
              fontSize: "14px",
              minHeight: "20px",
              color: "#475569"
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
              gap: "8px",
              alignItems: "center",
              fontSize: "14px",
              minHeight: "20px",
              color: "#475569"
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
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#334155"
            }}
          >
            Journal Note
          </label>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-end"
            }}
          >
            <textarea
              rows="2"
              placeholder="Write a short reflection..."
              value={formData.journal_note}
              onChange={(e) => handleChange("journal_note", e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid rgba(209, 218, 225, 0.95)",
                boxSizing: "border-box",
                fontSize: "14px",
                resize: "none",
                minHeight: "64px",
                maxHeight: "64px",
                background: "rgba(255,255,255,0.78)",
                color: "#334155"
              }}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "11px 16px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(180deg, #7ba08e 0%, #6d8f97 100%)",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                opacity: submitting ? 0.7 : 1,
                boxShadow: "0 10px 22px rgba(109, 143, 151, 0.18)",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
            >
              {submitting ? "Submitting..." : "Submit Check-In"}
            </button>
          </div>
        </div>
      </div>

      {localError && (
        <div style={{ marginTop: "8px", color: "crimson", fontSize: "13px" }}>
          {localError}
        </div>
      )}
    </form>
  );
}

export default CheckinView;