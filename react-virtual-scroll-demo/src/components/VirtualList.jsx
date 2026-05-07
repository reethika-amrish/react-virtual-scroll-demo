/**
 * VirtualList — renders only visible rows from a large dataset.
 */

export default function VirtualList({ items, totalCount, visibleStart, visibleEnd, rowHeight, totalHeight, onScroll, loading }) {
  const visibleRows = [];
  for (let i = visibleStart; i < visibleEnd; i++) {
    const item = items.get(i);
    visibleRows.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: i * rowHeight,
          left: 0,
          right: 0,
          height: rowHeight,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid #1e293b',
          fontSize: '13px',
          color: item ? '#e2e8f0' : '#64748b',
          background: i % 2 === 0 ? '#0f172a' : '#1e1e2e',
        }}
      >
        {item ? (
          <>
            <span style={{ width: '12%', fontWeight: 600, color: '#64ffda' }}>{item.id}</span>
            <span style={{ width: '12%' }}>{item.patientCode}</span>
            <span style={{ width: '14%' }}>{item.department}</span>
            <span style={{ width: '12%' }}>{item.study}</span>
            <span style={{ width: '12%' }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                background: item.status === 'Active' ? 'rgba(34,197,94,0.15)' :
                            item.status === 'Completed' ? 'rgba(59,130,246,0.15)' :
                            'rgba(245,158,11,0.15)',
                color: item.status === 'Active' ? '#22c55e' :
                       item.status === 'Completed' ? '#3b82f6' : '#f59e0b',
              }}>
                {item.status}
              </span>
            </span>
            <span style={{ width: '14%' }}>{item.enrollDate}</span>
            <span style={{ width: '10%', textAlign: 'right' }}>{item.dataPoints}</span>
          </>
        ) : (
          <span style={{ opacity: 0.4 }}>Loading...</span>
        )}
      </div>
    );
  }

  return (
    <div
      onScroll={onScroll}
      style={{
        height: '600px',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #334155',
        borderRadius: '8px',
        background: '#0f172a',
      }}
    >
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', padding: '0 16px', height: '40px', alignItems: 'center',
        background: '#1e293b', borderBottom: '2px solid #64ffda',
        fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        <span style={{ width: '12%' }}>Record ID</span>
        <span style={{ width: '12%' }}>Patient</span>
        <span style={{ width: '14%' }}>Department</span>
        <span style={{ width: '12%' }}>Study</span>
        <span style={{ width: '12%' }}>Status</span>
        <span style={{ width: '14%' }}>Enroll Date</span>
        <span style={{ width: '10%', textAlign: 'right' }}>Data Points</span>
      </div>

      {/* Virtual scroll area */}
      <div style={{ position: 'relative', height: totalHeight }}>
        {visibleRows}
      </div>

      {loading && (
        <div style={{
          position: 'absolute', bottom: 12, right: 16,
          padding: '4px 12px', background: 'rgba(100,255,218,0.1)',
          borderRadius: '8px', fontSize: '12px', color: '#64ffda',
        }}>
          Loading...
        </div>
      )}
    </div>
  );
}
