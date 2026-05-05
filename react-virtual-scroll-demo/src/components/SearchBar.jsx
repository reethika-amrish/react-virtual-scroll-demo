export default function SearchBar({ value, onChange, totalCount, visibleCount }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '12px 16px', background: '#1e293b',
      borderRadius: '8px', marginBottom: '12px',
    }}>
      <input
        type="text"
        placeholder="Search records by ID, patient, department..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1, padding: '10px 14px',
          background: '#0f172a', border: '1px solid #334155',
          borderRadius: '6px', color: '#e2e8f0', fontSize: '14px',
          outline: 'none',
        }}
      />
      <span style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
        {visibleCount.toLocaleString()} of {totalCount.toLocaleString()} records
      </span>
    </div>
  );
}
