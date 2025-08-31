import React from 'react';
import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type StatsProps = {
  title: string;
  data: number | string | null;
  icon?: React.ReactNode;
  changePercent?: number | null;
  percentageDisplay?: boolean;
  comparisonTime?: string;

};

const DashboardBox: React.FC<StatsProps> = ({ title, data, icon, changePercent, percentageDisplay, comparisonTime }) => {
  const isPositive = (changePercent ?? 0) >= 0;
  const increaseOrDecrease = isPositive ? 'increase' : 'decrease';

  const formatPercent = (value: number) => {
    return Number.isInteger(value) ? value : value.toFixed(2);
  };

  return (
    <Card
      sx={{
        minWidth: 200,
        maxWidth: 200,
        boxShadow: 3,
        textAlign: 'center',
        borderRadius: 2,
        padding: 1,
        backgroundColor: '#f9f9f9',
      }}
    >
      <CardContent sx={{ padding: '8px !important' }}>
        {icon && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
            {icon}
          </Box>
        )}

        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0 }}>
          {title}
        </Typography>

        {data !== null && data !== undefined ? (
          <>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                mt: 0,
              }}
            >
              {data}
              {changePercent !== null && changePercent !== undefined && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isPositive ? 'green' : 'red',
                    fontWeight: 'medium',
                    fontSize: '0.8rem',
                  }}
                >
                  {percentageDisplay ? (
                    <>
                      {isPositive ? (
                        <ArrowUpwardIcon fontSize="small" />
                      ) : (
                        <ArrowDownwardIcon fontSize="small" />
                      )}
                      {formatPercent(Math.abs(changePercent))}% {increaseOrDecrease} this {comparisonTime}
                    </>
                  ) : ''}
                </Box>
              )}
            </Typography>
          </>
        ) : (
          <Skeleton variant="text" height={30} />
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardBox;
