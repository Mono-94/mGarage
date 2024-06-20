import React, { useEffect, useState } from 'react';
import Garage from './garage';
import Menu from './menu';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { debugData } from '../utils/debugData';
import { isEnvBrowser } from '../utils/misc';

debugData([
  {
    action: 'setVisibleGarage',
    data: true
  },
  {
    action: 'setVisibleMenu',
    data: false
  },
  {
    action: 'setVisibleMenuKeys',
    data: false
  }
], 100);


const App: React.FC = () => {
  const [garageVisible, setGarageVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useNuiEvent<boolean>('setVisibleGarage', (isVisible) => {
    setGarageVisible(isVisible);
    if (isVisible) setMenuVisible(false); 
  });

  useNuiEvent<boolean>('setVisibleMenu', (isVisible) => {
    setMenuVisible(isVisible);
    if (isVisible) setGarageVisible(false); 
  });

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if ((garageVisible || menuVisible) && e.code === 'Escape') {
        if (!isEnvBrowser()) {
          if (garageVisible) {
            fetchNui('mGarage:Close', { name: 'setVisibleGarage' });
          } else if (menuVisible) {
            fetchNui('mGarage:Close', { name: 'setVisibleMenu' });
          }
        } else {
          setGarageVisible(false);
          setMenuVisible(false);
        }
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [garageVisible, menuVisible]);

  return (
    <>
      <Menu visible={menuVisible} />
      <Garage visible={garageVisible} />
    </>
  );
};

export default App;

