import React from 'react';
import { Tooltip, ActionIcon } from '@mantine/core';
import { Icon as TablerIcon } from '@tabler/icons-react'; 

type RenderTooltipProps = {
  label: string;
  color: string;
  IconComponent: TablerIcon;
  onClick: () => void;
};

const TooltipActionIcon: React.FC<RenderTooltipProps> = ({ label, color, IconComponent, onClick }) => (
  <Tooltip label={label} color={color} withArrow withinPortal>
    <ActionIcon color={color} variant="light" onClick={onClick}>
      <IconComponent size="1rem" />
    </ActionIcon>
  </Tooltip>
);

export default TooltipActionIcon;
