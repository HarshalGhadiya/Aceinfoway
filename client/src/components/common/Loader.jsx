export default function Loader({ size = 'medium', fullWidth = false, message = 'Loading...' }) {
  const sizeClass = {
    small: '20px',
    medium: '40px',
    large: '60px'
  }[size] || sizeClass.medium;

  return (
    <div 
      className="loader-container" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: fullWidth ? '40px' : '20px',
        width: fullWidth ? '100%' : 'auto',
        minHeight: fullWidth ? '200px' : 'auto'
      }}
    >
      <div 
        className="spinner"
        style={{ width: sizeClass, height: sizeClass }}
      />
      {message && (
        <div 
          className="loader-message"
          style={{ 
            marginTop: '12px', 
            color: 'var(--muted)', 
            fontSize: '14px' 
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

