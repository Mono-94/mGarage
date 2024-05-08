import React from 'react';
import { Progress, Text, Flex, Paper } from '@mantine/core';

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
        <Paper style={{ backgroundColor: '#373A40', padding:5 }} >
            <Flex justify="space-between" style={{ marginBottom: 5 }}><Text fz="sm">{text}</Text><Text fz="sm"> {icon}</Text></Flex>
            <Progress
                sx={{ backgroundColor: '#14141486' }}
                value={value}
                color={fuelColor}
                radius={5}
                sections={[
                    { value: value, color: fuelColor, tooltip: `${value}%` },
                ]}
            />
        </Paper>
    );
};

export default ProgressBar;
