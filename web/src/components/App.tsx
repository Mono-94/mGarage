import React, { useEffect, useState } from 'react';
import Garage from './garage';
import Menu from './menu';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { debugData } from '../utils/debugData';
import { isEnvBrowser } from '../utils/misc';
import BuyGarage from './buyprivate';

debugData([
  {
    action: 'setVisibleGarage',
    data: false
  },
  {
    action: 'setVisibleMenu',
    data: false
  },
  {
    action: 'setVisibleBuy',
    data: true
  }
], 100);


const App: React.FC = () => {
  const [garageVisible, setGarageVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [buyVisible, setbuyVisible] = useState(false);

  useNuiEvent<boolean>('setVisibleGarage', (isVisible) => {
    setGarageVisible(isVisible);
    if (isVisible) setMenuVisible(false);
  });

  useNuiEvent<boolean>('setVisibleMenu', (isVisible) => {
    setMenuVisible(isVisible);
    if (isVisible) setGarageVisible(false);
  });

  useNuiEvent<boolean>('setVisibleBuy', (isVisible) => {
    setbuyVisible(isVisible);
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
          } else if (buyVisible) {
            fetchNui('mGarage:Close', { name: 'setVisibleBuy' });
          }
        } else {
          setGarageVisible(false);
          setMenuVisible(false);
          setbuyVisible(false);
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
      <BuyGarage visible={buyVisible} />

    </>
  );
};

export default App;

