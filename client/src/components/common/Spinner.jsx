const Spinner = ({ size = '', fullPage = false, label = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-wrapper">
          <div className={`spinner spinner-lg`} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{label}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="spinner-wrapper">
      <div className={`spinner ${size ? `spinner-${size}` : ''}`} />
      {label && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{label}</p>}
    </div>
  );
};

export default Spinner;
