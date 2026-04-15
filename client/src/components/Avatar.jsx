/**
 * Avatar – shows profile picture if set, otherwise a coloured initials badge.
 *
 * Props:
 *  picturePath  – filename stored on the server (string | null | undefined)
 *  firstName    – user's first name  (for initials fallback)
 *  lastName     – user's last name   (for initials fallback)
 *  size         – px size of the circle (default 40)
 *  className    – extra Tailwind / CSS classes for the wrapper
 *  style        – extra inline styles for the wrapper
 *  onClick      – click handler
 *  ring         – if true, shows a coloured story ring around the avatar
 */

const PALETTE = [
  ['#1877f2', '#e8f0fe'],  // Facebook blue
  ['#e71d36', '#ffe0e3'],  // red
  ['#2ec4b6', '#d4f5f2'],  // teal
  ['#ff9f1c', '#fff0d9'],  // orange
  ['#6d28d9', '#ede9fe'],  // purple
  ['#059669', '#d1fae5'],  // green
  ['#db2777', '#fce7f3'],  // pink
  ['#d97706', '#fef3c7'],  // amber
];

const pickColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

const Avatar = ({
  picturePath,
  firstName = '',
  lastName = '',
  size = 40,
  className = '',
  style = {},
  onClick,
  ring = false,
}) => {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
  const [fg, bg] = pickColor(firstName + lastName);
  const fontSize = Math.max(10, Math.round(size * 0.38));

  const base = {
    width:  size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
    boxSizing: 'border-box',
    ...style,
  };

  const ringStyle = ring
    ? {
        padding: 2,
        background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        borderRadius: '50%',
      }
    : {};

  const inner = picturePath ? (
    <img
      src={`http://localhost:5000/assets/${picturePath}`}
      alt={`${firstName} ${lastName}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
        border: ring ? '2px solid white' : 'none',
        display: 'block',
      }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.dataset.fallback = 'true';
      }}
    />
  ) : (
    <span
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: bg,
        color: fg,
        fontWeight: 800,
        fontSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-0.5px',
        border: ring ? '2px solid white' : 'none',
        userSelect: 'none',
      }}
    >
      {initials}
    </span>
  );

  return (
    <div
      className={className}
      style={{ ...ringStyle, ...base }}
      onClick={onClick}
    >
      {inner}
    </div>
  );
};

export default Avatar;
