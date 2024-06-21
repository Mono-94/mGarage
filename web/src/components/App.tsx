import React, { useEffect, useState } from 'react';
import Garage from './garage';
import Menu from './menu';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { isEnvBrowser } from '../utils/misc';
import BuyGarage from './private/buyprivate';
import VisibilityButtons from './mono';


const App: React.FC = () => {
  const [garageVisible, setGarageVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);

  useNuiEvent<boolean>('setVisibleGarage', (isVisible) => {
    setGarageVisible(isVisible);
    if (isVisible) setMenuVisible(false);
  });

  useNuiEvent<boolean>('setVisibleMenu', (isVisible) => {
    setMenuVisible(isVisible);
    if (isVisible) setGarageVisible(false);
  });

  useNuiEvent<boolean>('setVisibleBuy', (isVisible) => {
    setBuyVisible(isVisible);
    if (isVisible) setGarageVisible(false);
  });

  const handleShowGarage = () => {
    setGarageVisible(true);
    setMenuVisible(false);
    setBuyVisible(false);
  };

  const handleShowMenu = () => {
    setGarageVisible(false);
    setMenuVisible(true);
    setBuyVisible(false);
  };

  const handleShowBuy = () => {
    setGarageVisible(false);
    setMenuVisible(false);
    setBuyVisible(true);
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if ((garageVisible || menuVisible || buyVisible) && e.code === 'Escape') {
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
          setBuyVisible(false);
        }
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [garageVisible, menuVisible, buyVisible]);

  return (
    <>
     <VisibilityButtons 
        handleShowGarage={handleShowGarage}
        handleShowMenu={handleShowMenu}
        handleShowBuy={handleShowBuy}
        garageVisible={garageVisible}
        menuVisible={menuVisible}
        buyVisible={buyVisible}
      />
      <Menu visible={menuVisible} />
      <Garage visible={garageVisible} />
      <BuyGarage visible={buyVisible} />
    </>
  );
};

export default App;
