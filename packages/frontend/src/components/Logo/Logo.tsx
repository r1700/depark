import React, { useEffect, useState } from 'react';

const Logo: React.FC<{ screenType: string }> = ({ screenType }) => {
  const [logos, setLogos] = useState<{ id: number; logoUrl: string }[]>([]);

  useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/logos/${screenType}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch logos');
      return res.json();
    })
    .then(data => setLogos(data.logos || []))
    .catch(err => {
      console.error('Error fetching logos:', err);
      setLogos([]);
    });
}, [screenType]);

  return (
    <div>
      {logos.map(logo => (
        <img key={logo.id} src={logo.logoUrl} alt="Logo" style={{ width: 120, margin: 8 }} />
      ))}
    </div>
  );
};

export default Logo;