import React from 'react';
import { Progress, Text, Flex, Paper, RingProgress, Center, ThemeIcon, Tooltip } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

interface ProgressBarProps {
    value: number;
    text: string;
    icon: any;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ value, text, icon }) => {

    const getProgressColor = (val: number): "green" | "yellow" | "red" => {
        if (val >= 70) {
            return "green";
        } else if (val >= 30) {
            return "yellow";
        } else {
            return "red";
        }
    };
    const fuelColor = getProgressColor(value);

    return (
        <Tooltip sx={{ padding: '2px 10px', borderRadius: 7 }} openDelay={400} label={`${text}: ${value}%`} color={fuelColor} transitionProps={{ transition: 'skew-down', duration: 300 }}  withArrow>
            <RingProgress
                color={fuelColor}
                size={50}
                thickness={3}
                sections={[
                    { value: value, color: fuelColor }
                ]}
                label={
                    <Center >

                        <ThemeIcon color={fuelColor} variant="light" radius="xl" size={30}>

                            {icon}

                        </ThemeIcon>

                    </Center>

                }
            />
        </Tooltip >

    );
};

export default ProgressBar;
