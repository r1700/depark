import React, { useEffect, useState } from 'react';

const Header: React.FC<{ screenType: string }> = ({ screenType }) => {
    const [logos, setLogos] = useState<{ id: number; logoUrl: string }[]>([]);

 useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/logos/by-name/${screenType}`)
    .then(res => res.json())
    .then(data => {
      console.log('API logos response:', data); // בדיקת הנתונים מהשרת
      if (data.logos) setLogos(data.logos);
      else setLogos([]);
    });
}, [screenType]);

    return (
        <header style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16 }}>
            {logos.map(logo => (
                <img
                    key={logo.id}
                    src={logo.logoUrl}
                    alt="Logo"
                    style={{ width: 80, height: 'auto' }}
                />
            ))}
        </header>
    );
};

export default Header;