function Warning({ warning }) {
  if (!warning) return null;

  return <div className="warning">{warning}</div>;
}

export default Warning;