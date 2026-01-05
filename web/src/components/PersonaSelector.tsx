import { PERSONAS, type PersonaId } from "../personas";

interface Props {
  selected: PersonaId;
  onChange: (id: PersonaId) => void;
}

export function PersonaSelector({ selected, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {PERSONAS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "999px",
            border: p.id === selected ? "2px solid black" : "1px solid #ccc",
            background: p.id === selected ? "#f5f5f5" : "white",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

